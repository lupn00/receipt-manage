<!-- 发票报销申请单 -->
<template>
  <!--begin::Basic info-->
  <div class="card mb-3">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-target="#kt_account_profile_details"
      aria-expanded="true"
      aria-controls="kt_account_profile_details"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">
          <template v-if="isEdit">
            <el-button
              type="primary"
              :icon="Back"
              @click.prevent="toPrePage"
            ></el-button>
          </template>
          {{ title }}
        </h3>
      </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <!--begin::Content-->
    <div id="kt_account_profile_details" class="collapse show">
      <!--begin::Form-->
      <el-form
        :model="groupReceiptFromData"
        :rules="groupReceiptRules"
        label-width="120px"
        ref="groupReceiptFormRef"
      >
        <el-form-item label="报销单名称" prop="name">
          <el-input v-model.trim="groupReceiptFromData.name" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model.trim="groupReceiptFromData.remark"
            type="textarea"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addReceipt">添加发票</el-button>
        </el-form-item>
      </el-form>
      <!--end::Form-->
    </div>
    <!--begin::Card footer-->
    <div class="card-footer d-flex justify-content-end py-6 px-9">
      <el-button
        type="warning"
        size="large"
        @click="saveGroupReceipt"
        :loading="saveLoadingFlag"
        :disabled="disableBtn"
        >保存</el-button
      >
      <el-button
        type="danger"
        size="large"
        @click="saveGroupReceiptAndSend"
        :loading="saveAndSendLoadingFlag"
        :disabled="disableBtn"
        >保存并发送财务</el-button
      >
    </div>
    <!--end::Card footer-->
    <el-dialog v-model="dialogFormVisible" title="发票信息" :z-index="1050">
      <el-alert
        title="发票文件现版本只支持图片!"
        :closable="false"
        type="warning"
        show-icon
        center
        class="alert-info"
      />
      <el-form
        :model="receiptFormData"
        :label-width="formLabelWidth"
        :rules="receiptRules"
        ref="dialogFormRef"
        status-icon
      >
        <el-form-item label="发票文件" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="RECEIPT_UPLOAD_ADDRESS"
            :data="data"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="limitImgPdfAnd5M"
            ref="fileUploadRef"
            :on-preview="handleUploadImgPreview"
          >
            <img
              v-if="receiptFormData.imgReceipt"
              :src="receiptFormData.imgReceipt"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-button
            v-show="receiptFormData.imgReceipt"
            class="ms-1"
            :icon="Search"
            circle
            @click="handleUploadImgPreview"
          />

          <!-- <embed :src="receiptFormData.imgReceipt" type="application/pdf" width=800 height=800></embed> -->
        </el-form-item>
        <el-form-item
          label="有发票号"
          :label-width="formLabelWidth"
          prop="hasCodeNo"
        >
          <el-select
            v-model="receiptFormData.hasCodeNo"
            placeholder="是否有发票号"
          >
            <el-option
              v-for="item in ReceiptHasCodeNoList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="代码"
          prop="codeReceipt"
          v-show="receiptFormData.hasCodeNo === 1"
        >
          <el-input v-model="receiptFormData.codeReceipt" />
        </el-form-item>
        <el-form-item
          label="号码"
          prop="noReceipt"
          v-show="receiptFormData.hasCodeNo === 1"
        >
          <el-input v-model="receiptFormData.noReceipt" />
        </el-form-item>
        <el-form-item label="开票日期" prop="ddReceipt">
          <el-col :span="11">
            <el-date-picker
              v-model="receiptFormData.ddReceipt"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-col>
          <!-- <el-col :span="2" class="text-center">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-time-picker
              v-model="form.date2"
              placeholder="Pick a time"
              style="width: 100%"
            />
          </el-col> -->
        </el-form-item>
        <el-form-item
          label="类别"
          :label-width="formLabelWidth"
          prop="category"
        >
          <el-select
            v-model="receiptFormData.category"
            placeholder="请选择一种发票类别"
          >
            <el-option
              v-for="item in ReceiptCategoryList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="bdMoney">
          <el-input v-model="receiptFormData.bdMoney" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="receiptFormData.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelReceipt">取消</el-button>
          <el-button type="primary" @click="saveReceipt"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
    <!--end::Content-->
  </div>
  <!--end::Basic info-->

  <el-alert
    title="修改数据后注意保存！"
    type="warning"
    center
    show-icon
    :closable="false"
    class="editAlert"
  />

  <!--begin::Receipts-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <!-- <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_account_deactivate"
      aria-expanded="true"
      aria-controls="kt_account_deactivate"
    >
      <div class="card-title m-0">
        <h3 class="fw-bolder m-0">发票列表</h3>
      </div>
    </div> -->
    <!--end::Card header-->

    <!--begin::Content-->
    <div id="kt_account_deactivate" class="collapse show">
      <!--begin::Card body-->
      <div class="card-body border-top p-9">
        <div
          class="notice d-flex bg-light-warning rounded border-warning border border-dashed mb-9 p-6"
        >
          <!--begin::Wrapper-->
          <div class="d-flex flex-stack flex-grow-1">
            <!--begin::Content-->
            <el-table
              :data="receipts"
              border
              show-summary
              style="width: 100%"
              :summary-method="totalMoney"
            >
              <el-table-column
                prop="codeReceipt"
                label="发票代码"
                width="180"
              />
              <el-table-column prop="noReceipt" label="发票号码" width="180" />
              <el-table-column
                prop="category"
                :formatter="receiptCategory2StrEP"
                label="发票类别"
                width="130"
              />
              <el-table-column
                prop="ddReceipt"
                :formatter="formatDateEP"
                label="开票日期"
                width="150"
              />
              <el-table-column prop="remark" label="备注" />
              <!-- <el-table-column
                prop="status"
                :formatter="receiptStatus2StrEP"
                label="状态"
                width="150"
              /> -->
              <el-table-column
                prop="status"
                label="状态"
                align="center"
                width="150"
              >
                <template #default="scope">
                  <el-tag
                    disable-transitions
                    effect="dark"
                    :type="receiptStatus2Tag(scope.row.status)"
                    >{{ receiptStatus2Str(scope.row.status) }}</el-tag
                  >
                </template>
              </el-table-column>

              <el-table-column
                prop="imgReceipt"
                label="附件"
                width="100"
                align="center"
              >
                <template #default="scope">
                  <el-button
                    type="info"
                    :icon="Link"
                    circle
                    @click.prevent="handleImgPreview(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="bdMoney"
                label="金额"
                :formatter="formatMoneyEP"
                align="right"
                width="180"
              />
              <el-table-column align="center" width="180">
                <template #default="scope">
                  <!-- <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)"
                    >Edit</el-button
                  > -->
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleReceiptDelete(scope.$index, scope.row)"
                    :icon="Delete"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--end::Content-->
            <el-dialog v-model="imgDialogVisible">
              <el-image :src="dialogImageUrl" fit="fill"></el-image>
            </el-dialog>
          </div>
          <!--end::Wrapper-->
        </div>
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Receipts-->
</template>

<script lang="ts" setup>
// import { getAssetPath } from "@/core/helpers/assets";
import { onMounted, ref } from "vue";
import { limitImgAnd5M,limitImgPdfAnd5M, tableTotalMoney } from "@/core/utils/ElementPlusUtils";
import { RECEIPT_UPLOAD_ADDRESS } from "@/core/config/SystemConfig.ts";
import {
  type IReceipt,
  type IGroupReceipt,
  initGroupReceipt,
  initReceipt,
  receiptCategory2StrEP,
  receiptStatus2Str,
  receiptStatus2Tag,
  ReceiptRules,
  GroupReceiptRules,
  ReceiptCategoryList,
  ReceiptHasCodeNoList,
} from "@/core/services/project/ReceiptCommon";

import {
  GroupReceiptSelfServiceImpl as GroupReceiptSelfService,
  ReceiptSelfServiceImpl as ReceiptSelfService,
} from "@/core/services/project/ReceiptSelfService";

import JwtService from "@/core/services/JwtService";
import type { UploadProps } from "element-plus";
import { formatDateEP, formatMoneyEP } from "@/core/utils/ElementPlusFormatter";
import {
  errorAlert,
  successAlert,
  confirmAlert,
} from "@/core/utils/MessageUtils";
import { Link, Back, Delete, Plus, Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const title = ref("填写申请单");
const isEdit = ref(false);
if (route.params.id) {
  title.value = "修改申请单";
  isEdit.value = true;
}

const toPrePage = () => {
  router.go(-1);
};

//begin::修改功能
onMounted(async () => {
  //初始化数据
  if (isEdit.value) {
    const response = await GroupReceiptSelfService.get(route.params.id);
    groupReceiptFromData.value = response.data.obj;
    const receiptResponse = await ReceiptSelfService.listByGroupId(
      route.params.id
    );
    receipts.value = receiptResponse.data.obj;
  }
});
//end::修改功能
console.log("@@@@@@@@@@@@@@@@@@", route.params.id);
//begin::发票组相关
const groupReceiptFromData = ref<IGroupReceipt>(initGroupReceipt());

const saveLoadingFlag = ref(false);
const saveAndSendLoadingFlag = ref(false);
const groupReceiptRules = ref(GroupReceiptRules);
const groupReceiptFormRef = ref<null | HTMLFormElement>(null);
const disableBtn = ref(false);

const saveGroupReceipt = () => {
  storeGroupReceipt();
};

const saveGroupReceiptAndSend = async () => {
  storeGroupReceipt(1);
};

const storeGroupReceipt = async (isSend: number = 0) => {
  let checkResult = await validGroupReceiptData();
  if (checkResult) {
    saveLoadingFlag.value = true;
    disableBtn.value = true;
    if (isSend == 1) {
      groupReceiptFromData.value.status = 2;
    } else if (isSend == 0) {
      groupReceiptFromData.value.status = 1;
    }
    const saveData = {
      ...groupReceiptFromData.value,
      receiptAddVOList: receipts.value,
    };
    if (isEdit.value) {
      //编辑模式下
      GroupReceiptSelfService.update(saveData)
        .then(() => {
          // clearAllData(); 编辑模式下不清空数据
          successAlert("保存成功!");
        })
        .finally(() => {
          disableBtn.value = false;
          saveLoadingFlag.value = false;
        });
    } else {
      //新增模式下
      GroupReceiptSelfService.save(saveData)
        .then(() => {
          clearAllData();
          successAlert("保存成功!");
        })
        .finally(() => {
          disableBtn.value = false;
          saveLoadingFlag.value = false;
        });
    }
  } else {
    errorAlert("请正确填写发票信息！");
  }
};

const validGroupReceiptData = async () => {
  if (!groupReceiptFormRef.value) return false;
  let result = false;
  await groupReceiptFormRef.value.validate((valid, fields) => {
    if (valid && receipts.value.length > 0) {
      result = true;
    }
  });
  return result;
};

const clearAllData = () => {
  //清空发票组
  if (groupReceiptFormRef.value) {
    (groupReceiptFormRef.value as any).resetFields();
  }
  //清空所有发票
  receipts.value = [];
};

const dialogImageUrl = ref("");
const imgDialogVisible = ref(false);

const handleImgPreview = (row) => {
  dialogImageUrl.value = row.imgReceipt;
  imgDialogVisible.value = true;
};
//end::发票组相关
const handleUploadImgPreview: UploadProps["onPreview"] = () => {
  dialogImageUrl.value = receiptFormData.value.imgReceipt;
  imgDialogVisible.value = true;
};

const addReceipt = () => {
  dialogFormVisible.value = true;
};

const totalMoney = (param) => {
  return tableTotalMoney(param, "bdMoney");
};
// dialogFormVisible = false cancelReceipt saveReceipt
//begin::发票对话框相关
const headers = { Authorization: `Bearer ${JwtService.getToken()}` };
const data = ref({ type: "receipt" });

const receiptRules = ref(ReceiptRules);
const dialogFormRef = ref<null | HTMLFormElement>(null);
const fileUploadRef = ref(null);
const receipts = ref<IReceipt[]>([]);
const dialogFormVisible = ref<boolean>(false);
const formLabelWidth = "140px";

const receiptFormData = ref<IReceipt>(initReceipt());

const cancelReceipt = () => {
  dialogFormVisible.value = false;
  clearDialogFrom();
};

// const submitForm = async (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   await formEl.validate((valid, fields) => {
//     if (valid) {
//       console.log('submit!')
//     } else {
//       console.log('error submit!', fields)
//     }
//   })
// }
const saveReceipt = async () => {
  //确认上传附件
  if (!receiptFormData.value.imgReceipt) {
    errorAlert("请上传发票文件！");
    return;
  }
  if (!dialogFormRef.value) return;
  await dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      //有发票号的要判断是否填写发票号
      if (
        receiptFormData.value.hasCodeNo === 1 &&
        (!receiptFormData.value.codeReceipt || !receiptFormData.value.noReceipt)
      ) {
        errorAlert("请填写发票号码！");
        return;
      }
      //有发票号的情况下 排除本组发票中已经填写过的发票
      if (receipts.value.length > 0 && receiptFormData.value.hasCodeNo === 1) {
        if (
          receipts.value.find((element) => {
            if (element.codeReceipt && element.noReceipt) {
              return (
                element.codeReceipt + element.noReceipt ===
                receiptFormData.value.codeReceipt! +
                  receiptFormData.value.noReceipt!
              );
            } else {
              return false;
            }
          })
        ) {
          errorAlert("此发票组已经填写过本发票！");
          return;
        }
      }
      receipts.value.push(Object.assign({}, receiptFormData.value));
      dialogFormVisible.value = false;
      clearDialogFrom();
    }
  });
};

const clearDialogFrom = () => {
  if (receiptFormData.value) {
    receiptFormData.value = initReceipt();
  }
  if (dialogFormRef.value) {
    (dialogFormRef.value as any).resetFields();
  }
  if (fileUploadRef.value) {
    (fileUploadRef.value as any).clearFiles();
  }
};

const handleReceiptDelete = async (index, row) => {
  const confirmResult = await confirmAlert(`确定要删除记录吗？`);
  if (confirmResult.isConfirmed) {
    console.log(index, row);
    receipts.value.splice(index, 1);
  }
};

const handleUploadSuccess: UploadProps["onSuccess"] = (response) => {
  // receiptFormData.value.imgReceipt = URL.createObjectURL(uploadFile.raw!);
  const receiptImgResult = response.obj;
  receiptFormData.value = initReceipt();
  receiptFormData.value.imgReceipt = receiptImgResult.imgUrl;
  if (receiptImgResult.receiptCode) {
    //如果能自动解析出二维码
    receiptFormData.value.systemCategory = receiptImgResult.systemCategory;
    receiptFormData.value.systemCheckCode = receiptImgResult.systemCheckCode;
    receiptFormData.value.systemEncrypt = receiptImgResult.systemEncrypt;
    receiptFormData.value.originStr = receiptImgResult.originStr;

    receiptFormData.value.codeReceipt = receiptImgResult.receiptCode;
    receiptFormData.value.noReceipt = receiptImgResult.receiptNo;
    receiptFormData.value.codeNoReceipt =
      receiptImgResult.receiptCode + "_" + receiptImgResult.receiptNo;
    //
    // receiptFormData.value.bdMoney = receiptImgResult.money;
    receiptFormData.value.ddReceipt = receiptImgResult.dateStr;
    // receiptFormData.value.hasCodeNo = 1;
  }
};

//end::发票对话框相关
</script>

<style scoped>
.editAlert {
  margin-bottom: 5px;
}
.alert-info {
  margin-bottom: 5px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
