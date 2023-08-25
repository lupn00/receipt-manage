<!-- 财务视角，发票申请单视图 -->
<template>
  <!--begin::Step-->
  <div class="step-div">
    <a-steps
      :current="stepInfoAnt.current"
      label-placement="vertical"
      :status="stepInfoAnt.status"
      :items="stepInfoAnt.items"
    ></a-steps>
  </div>
  <!--end::Step-->
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
        :disabled="true"
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
        <!-- <el-form-item>
          <el-button type="primary" @click="addReceipt">添加发票</el-button>
        </el-form-item> -->
      </el-form>
      <!--end::Form-->
    </div>
    <!--begin::Card footer-->
    <div class="card-footer d-flex justify-content-end py-6 px-9">
      <!-- <el-button
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
      > -->
      <!-- <el-button
        v-if="groupReceiptFromData.status === 3"
        type="danger"
        size="large"
        @click="resendReview"
        :loading="resendReviewFlag"
        >重新提交审核</el-button
      > -->
    </div>
    <!--end::Card footer-->
    <!--begin::发票信息添加修改Dialog -->
    <!-- <el-dialog v-model="dialogFormVisible" title="发票信息" :z-index="1050">
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
            :action="IMG_UPLOAD_ADDRESS"
            :data="data"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="limitImgAnd5M"
            ref="fileUploadRef"
          >
            <img
              v-if="receiptFormData.imgReceipt"
              :src="receiptFormData.imgReceipt"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="代码" prop="codeReceipt">
          <el-input v-model="receiptFormData.codeReceipt" />
        </el-form-item>
        <el-form-item label="号码" prop="noReceipt">
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
    </el-dialog> -->
    <!--end::发票信息添加修改Dialog -->
    <!--end::Content-->
  </div>
  <!--end::Basic info-->

  <!--begin::Receipts-->
  <div class="card mb-3">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_receipts"
      aria-expanded="true"
      aria-controls="kt_receipts"
    >
      <div class="card-title m-0">
        <h3 class="fw-bolder m-0">发票列表</h3>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Content-->
    <div id="kt_receipts" class="collapse show">
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
              <el-table-column
                prop="status"
                align="center"
                label="状态"
                width="150"
              >
                <template #default="scope">
                  <el-tag
                    disable-transitions
                    :type="receiptStatus2Tag(scope.row.status)"
                    effect="dark"
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
                  <!-- 等待财务审核的订单显示审核相关按钮（通过，退回） ，role : 财务-->
                  <template v-if="scope.row.status == 2">
                    <el-button
                      size="small"
                      type="success"
                      @click="showPassDialog(scope.$index, scope.row)"
                      :icon="Check"
                    ></el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="showRejectDialog(scope.$index, scope.row)"
                      :icon="Close"
                    ></el-button>
                  </template>
                  <!-- 财务退回的订单显示编辑相关按钮（修改，删除） ，role : 员工-->
                  <!-- <template v-else-if="scope.row.status == 3">
                    <el-button
                      size="small"
                      @click="handleReceiptEdit(scope.$index, scope.row)"
                      :icon="Edit"
                    ></el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleReceiptDelete(scope.$index, scope.row)"
                      :icon="Delete"
                    ></el-button>
                  </template> -->
                </template>
              </el-table-column>
            </el-table>
            <!--end::Content-->
            <!--显示图片对话框-->
            <el-dialog v-model="imgDialogVisible">
              <el-image :src="dialogImageUrl" fit="fill"></el-image>
            </el-dialog>
            <!--审核通过对话框-->
            <el-dialog
              v-model="dialogPassVisible"
              title="审核确认"
              width="30%"
              :before-close="clearDialogDataAndClose"
              center
              :z-index="1050"
            >
              <span v-html="receiptMsg"></span>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="clearDialogDataAndClose">取消</el-button>
                  <el-button type="primary" @click="handleReceiptPass">
                    审核通过
                  </el-button>
                </span>
              </template>
            </el-dialog>
            <!--审核退回对话框-->
            <el-dialog
              v-model="dialogRejectVisible"
              title="审核退回"
              width="30%"
              :before-close="clearDialogDataAndClose"
              center
              :z-index="1050"
            >
              <el-form :model="rejectReceiptForm" :label-width="140">
                <el-form-item label="单号">
                  <span v-html="receiptMsg"></span>
                </el-form-item>
                <el-form-item label="退回原因">
                  <el-select
                    v-model="rejectReceiptForm.reason"
                    placeholder="选择退回原因"
                  >
                    <el-option label="发票金额不正确" value="发票金额不正确" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="填写原因"
                  v-show="rejectReceiptForm.reason == '其他'"
                >
                  <el-input
                    v-model.trim="rejectReceiptForm.remark"
                    type="textarea"
                  />
                </el-form-item>
              </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="clearDialogDataAndClose">取消</el-button>
                  <el-button type="primary" @click="handleReceiptReject">
                    确认
                  </el-button>
                </span>
              </template>
            </el-dialog>
          </div>
          <!--end::Wrapper-->
        </div>
      </div>
      <!--end::Card body-->

      <!--begin::Actions-->
      <div class="card-footer d-flex justify-content-end py-6 px-9">
        <el-button
          type="danger"
          size="large"
          @click="rejectGroupReceiptProcess"
          :loading="payBtnFlag"
          >拒绝</el-button
        >
        <el-button
          type="success"
          size="large"
          @click="passGroupReceiptProcess"
          :loading="passGroupReceiptProcessBtn"
          >审批通过</el-button
        >
      </div>
      <!--end::Actions-->

      <!--begin::Card footer-->
      <div
        v-if="groupReceiptFromData.status === 4"
        class="card-footer d-flex justify-content-end py-6 px-9"
      >
        <el-button
          type="success"
          size="large"
          @click="toPaid"
          :loading="payBtnFlag"
          >已打款</el-button
        >
        <!-- <button
          id="kt_account_deactivate_account_submit"
          ref="submitButton5"
          type="submit"
          class="btn btn-danger fw-semobold"
        >
          <span class="indicator-label"> 已经打款 </span>
          <span class="indicator-progress">
            Please wait...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button> -->
      </div>
      <!--end::Card footer-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Receipts-->

  <!--begin::Log-->
  <div class="card mb-3">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_receipts_logs"
      aria-expanded="true"
      aria-controls="kt_receipts_logs"
    >
      <div class="card-title m-0">
        <h3 class="fw-bolder m-0">操作记录</h3>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Content-->
    <div id="kt_receipts_logs" class="collapse show">
      <!--begin::Card body-->
      <div class="card-body border-top p-9">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack flex-grow-1">
          <!--begin::Content-->
          <el-table
            :data="groupReceiptLogs"
            border
            show-summary
            style="width: 100%"
            :summary-method="totalMoney"
          >
            <el-table-column prop="operation" label="操作" />
            <el-table-column
              prop="operatorEmployeeName"
              label="操作人"
              width="130"
            />
            <el-table-column
              prop="receiptCodeNo"
              label="发票代码号码"
              width="250"
            />
            <el-table-column prop="remark" label="备注" />
            <el-table-column
              prop="dtCreate"
              :formatter="formatDateTimeEP"
              label="操作时间"
              width="180"
            />
          </el-table>
          <!--end::Content-->
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Logs-->
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { limitImgAnd5M, tableTotalMoney } from "@/core/utils/ElementPlusUtils";
// import { IMG_UPLOAD_ADDRESS } from "@/core/config/SystemConfig";
// import {
//   GroupReceiptSelfServiceImpl as GroupReceiptSelfService,
//   ReceiptSelfServiceImpl as ReceiptSelfService,
// } from "@/core/services/project/ReceiptSelfService";
import {
  GroupReceiptFinanceServiceImpl as GroupReceiptFinanceService,
  ReceiptFinanceServiceImpl as ReceiptFinanceService,
} from "@/core/services/project/ReceiptFinanceService";
import {
  type IReceipt,
  type IGroupReceipt,
  initGroupReceipt,
  initReceipt,
  receiptCategory2StrEP,
  // receiptStatus2StrEP,
  receiptStatus2Str,
  receiptStatus2Tag,
  ReceiptRules,
  GroupReceiptRules,
  // GroupReceiptStep,
  GroupReceiptStepAnt,
  // ReceiptCategoryList,
} from "@/core/services/project/ReceiptCommon";
import JwtService from "@/core/services/JwtService";
import type { UploadProps } from "element-plus";
import {
  formatDateEP,
  formatDateTimeEP,
  formatMoneyEP,
} from "@/core/utils/ElementPlusFormatter";
import {
  errorAlert,
  successAlert,
  confirmAlert,
} from "@/core/utils/MessageUtils";
import {
  Link,
  Back,
  Delete,
  Close,
  Check,
  Edit,
} from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import {
  type IGroupReceiptLog,
  GroupReceiptLogServiceImpl,
} from "@/core/services/project/GroupReceiptLogService";

const route = useRoute();
const router = useRouter();
const title = ref("添加申请单");
const isEdit = ref(false);
if (route.params.id) {
  title.value = "查看申请单";
  isEdit.value = true;
}
const stepInfoAnt = ref(new GroupReceiptStepAnt());

const toPrePage = () => {
  router.go(-1);
};

const groupReceiptLogs = ref<IGroupReceiptLog[]>([]);
//begin::修改功能
onMounted(async () => {
  //初始化数据
  if (isEdit.value) {
    const response = await GroupReceiptFinanceService.get(
      Number(route.params.id)
    );
    groupReceiptFromData.value = response.data.obj;
    const receiptResponse = await ReceiptFinanceService.listByGroupId(
      Number(route.params.id)
    );
    receipts.value = receiptResponse.data.obj;
    const receiptLogResponse =
      await GroupReceiptLogServiceImpl.listByGroupReceiptId(
        Number(route.params.id)
      );
    groupReceiptLogs.value = receiptLogResponse.data.obj;
    // stepInfo.value = GroupReceiptStep.getFromGroupReceiptStatus(
    //   groupReceiptFromData.value.status
    // );
    stepInfoAnt.value = GroupReceiptStepAnt.getFromGroupReceiptStatus(
      groupReceiptFromData.value.status
    );
  }
});
//end::修改功能
console.log("@@@@@@@@@@@@@@@@@@", route.params.id);
//begin::发票组相关
const groupReceiptFromData = ref<IGroupReceipt>(initGroupReceipt());

const saveLoadingFlag = ref(false);
const saveAndSendLoadingFlag = ref(false);
const resendReviewFlag = ref(false);
const groupReceiptRules = ref(GroupReceiptRules);
const groupReceiptFormRef = ref<null | HTMLFormElement>(null);
const disableBtn = ref(false);

//::begin步骤条设置
const stepInfo = ref({});
//::end步骤条设置

// const saveGroupReceipt = () => {
//   storeGroupReceipt();
// };

// const resendReview = () => {
//   //修改后的数据，或者直接提交所有退回状态的发票
//   resendReviewFlag.value = true;
//   let rejectReceiptList: IReceipt[] = [];
//   receipts.value.forEach((item) => {
//     if (item.status === 3) {
//       rejectReceiptList.push(item);
//     }
//   });
//   ReceiptSelfService.updateRejectMulti(rejectReceiptList)
//     .then(() => {
//       // clearAllData(); 编辑模式下不清空数据
//       successAlert("重新提交成功!");
//       location.reload();
//     })
//     .finally(() => {
//       resendReviewFlag.value = false;
//     });
// };

// const saveGroupReceiptAndSend = () => {
//   storeGroupReceipt(1);
// };

// const storeGroupReceipt = async (isSend: number = 0) => {
//   let checkResult = await validGroupReceiptData();
//   if (checkResult) {
//     saveLoadingFlag.value = true;
//     disableBtn.value = true;
//     if (isSend == 1) {
//       groupReceiptFromData.value.status = 2;
//     } else if (isSend == 0) {
//       groupReceiptFromData.value.status = 1;
//     }
//     const saveData = {
//       ...groupReceiptFromData.value,
//       receiptAddVOList: receipts.value,
//     };
//     if (isEdit.value) {
//       //编辑模式下
//       GroupReceiptServiceImpl.update(saveData)
//         .then(() => {
//           // clearAllData(); 编辑模式下不清空数据
//           successAlert("保存成功!");
//         })
//         .finally(() => {
//           disableBtn.value = false;
//           saveLoadingFlag.value = false;
//         });
//     } else {
//       //新增模式下
//       GroupReceiptServiceImpl.save(saveData)
//         .then(() => {
//           clearAllData();
//           successAlert("保存成功!");
//         })
//         .finally(() => {
//           disableBtn.value = false;
//           saveLoadingFlag.value = false;
//         });
//     }
//   } else {
//     errorAlert("请正确填写发票信息！");
//   }
// };

// const validGroupReceiptData = async () => {
//   if (!groupReceiptFormRef.value) return false;
//   let result = false;
//   await groupReceiptFormRef.value.validate((valid, fields) => {
//     if (valid && receipts.value.length > 0) {
//       result = true;
//     }
//   });
//   return result;
// };

// const clearAllData = () => {
//   //清空发票组
//   if (groupReceiptFormRef.value) {
//     (groupReceiptFormRef.value as any).resetFields();
//   }
//   //清空所有发票
//   receipts.value = [];
// };

const dialogImageUrl = ref("");
const imgDialogVisible = ref(false);

const handleImgPreview = (row) => {
  dialogImageUrl.value = row.imgReceipt;
  imgDialogVisible.value = true;
};

const dialogPassVisible = ref(false);
const dialogRejectVisible = ref(false);
//当前正处理发票
const currentDealReceipt = ref({});

const receiptMsg = ref("");
const showPassDialog = (index, row) => {
  if (row.hasCodeNo == 1) {
    receiptMsg.value = `是否通过<font color="red"><b>${row.codeNoReceipt}</b></font>发票的审核`;
  } else {
    receiptMsg.value = `<font color="red"><b>无发票号发票</b></font>`;
  }

  dialogPassVisible.value = true;
  currentDealReceipt.value.receipt = row;
  currentDealReceipt.value.index = index;
};
const closePassDialog = () => {
  dialogPassVisible.value = false;
  //清空当前正处理发票
  currentDealReceipt.value = {};
  receiptMsg.value = "";
};

const rejectReceiptForm = ref({});
const showRejectDialog = (index, row) => {
  if (row.hasCodeNo == 1) {
    receiptMsg.value = `<font color="red"><b>${row.codeNoReceipt}</b></font>`;
  } else {
    receiptMsg.value = `<font color="red"><b>无发票号发票</b></font>`;
  }
  dialogRejectVisible.value = true;
  currentDealReceipt.value.receipt = row;
  currentDealReceipt.value.index = index;
};
const closeRejectDialog = () => {
  dialogRejectVisible.value = false;
  currentDealReceipt.value = {};
};
const clearDialogDataAndClose = () => {
  console.log("清空数据");
  //清空当前正处理发票
  dialogRejectVisible.value = false;
  dialogPassVisible.value = false;
  currentDealReceipt.value = {};
  receiptMsg.value = "";
  rejectReceiptForm.value = {};
};
const handleReceiptPass = () => {
  ReceiptFinanceService.review(currentDealReceipt.value.receipt.id, 1).then(
    () => {
      //更新列表数据
      receipts.value[currentDealReceipt.value.index].status = 4;
      dialogPassVisible.value = false;
      successAlert("审核成功");
    }
  );
};
const handleReceiptReject = () => {
  let remark = "";
  if (rejectReceiptForm.value.reason === "其他") {
    remark = rejectReceiptForm.value.remark;
  } else {
    remark = rejectReceiptForm.value.reason;
  }
  ReceiptFinanceService.review(
    currentDealReceipt.value.receipt.id,
    2,
    remark
  ).then(() => {
    //更新列表数据
    receipts.value[currentDealReceipt.value.index].status = 3;
    dialogRejectVisible.value = false;
    successAlert("退回成功");
  });
};


const payBtnFlag = ref(false);
const toPaid = async () => {
  payBtnFlag.value = true;
  const confirmMsg = "是否确认通过此申请单审批？";
  const confirmResult = await confirmAlert(confirmMsg, "确定");
  if (confirmResult.isConfirmed) {
    const response = await GroupReceiptFinanceService.toPaid(
      groupReceiptFromData.value.id
    );
    payBtnFlag.value = false;
    location.reload();
    console.log(response);
  } else {
    payBtnFlag.value = false;
  }
};
// @click="toPaid"
//           :loading="payBtnFlag"
//end::发票组相关

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
// 1-新增，2-编辑
const dialogOpenFrom = ref<number>(1);
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
//此页面的保存
// const saveReceipt = async () => {
//   //确认上传附件
//   if (!receiptFormData.value.imgReceipt) {
//     errorAlert("请上传发票文件！");
//     return;
//   }
//   if (!dialogFormRef.value) return;
//   await dialogFormRef.value.validate((valid, fields) => {
//     if (valid) {
//       if (dialogOpenFrom.value === 1) {
//         //排除本组发票中已经填写过的发票,此处验证只适合于新增的情况
//         if (receipts.value.length > 0) {
//           if (
//             receipts.value.find((element) => {
//               return (
//                 element.codeReceipt! + element.noReceipt ===
//                 receiptFormData.value.codeReceipt! +
//                   receiptFormData.value.noReceipt!
//               );
//             })
//           ) {
//             errorAlert("此发票组已经填写过本发票！");
//             return;
//           }
//         }
//         receipts.value.push(Object.assign({}, receiptFormData.value));
//         clearDialogFrom();
//       } else if (dialogOpenFrom.value === 2) {
//         //编辑模式打开的对话框，数据已经在receipts中了
//       }
//       dialogFormVisible.value = false;
//     }
//   });
// };

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

const handleReceiptEdit = (index, row) => {
  //从编辑模式打开
  dialogOpenFrom.value = 2;
  dialogFormVisible.value = true;
  receiptFormData.value = row;
  console.log(index, row);
};

const handleReceiptDelete = (index, row) => {
  console.log(index, row);
  receipts.value.splice(index, 1);
};

const handleUploadSuccess: UploadProps["onSuccess"] = (response) => {
  // receiptFormData.value.imgReceipt = URL.createObjectURL(uploadFile.raw!);
  receiptFormData.value.imgReceipt = response.obj;
};

// const payBtnFlag = ref(false);
// const toPaid = async () => {
//   payBtnFlag.value = true;
//   const confirmMsg = "是否确认此申请单已经打款？";
//   const confirmResult = await confirmAlert(confirmMsg, "确定");
//   if (confirmResult.isConfirmed) {
//     const response = await GroupReceiptFinanceService.toPaid(
//       groupReceiptFromData.value.id
//     );
//     payBtnFlag.value = false;
//     location.reload();
//     console.log(response);
//   } else {
//     payBtnFlag.value = false;
//   }
// };
const passGroupReceiptProcessBtn = ref(false);
const passGroupReceiptProcess = async ()=>{
  passGroupReceiptProcessBtn.value = true;
  const confirmMsg = "是否确认通过此申请单审批？";
  const confirmResult = await confirmAlert(confirmMsg, "确定");
  if (confirmResult.isConfirmed) {
    const response = await GroupReceiptFinanceService.completeMyTask(groupReceiptFromData.value.id)
  }else{
    passGroupReceiptProcessBtn.value = false;
  }
  
}

//end::发票对话框相关
</script>

<style scoped>
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
.step-div {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #fdf6ec;
  margin-bottom: 5px;
  padding: 10px 0 5px;
}
.step-div .step {
  width: 80%;
}
</style>
