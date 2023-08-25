<template>
  <!--begin::Basic info-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_account_profile_details"
      aria-expanded="true"
      aria-controls="kt_account_profile_details"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">基本信息</h3>
      </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <!--begin::Content-->
    <div id="kt_account_profile_details" class="collapse show">
      <!--begin::Card body-->
      <div class="card-body border-top p-9">
        <!--begin::Input group-->
        <div class="row mb-6">
          <!--begin::Label-->
          <label class="col-lg-4 col-form-label fw-semobold fs-6">头像</label>
          <!--end::Label-->

          <!--begin::Col-->
          <div class="col-lg-8">
            <!--begin::Image input-->
            <el-upload
              :headers="uploadHeaders"
              :data="uploadData"
              :action="IMG_UPLOAD_ADDRESS"
              accept="image/*"
              :before-upload="limitImgAnd5M"
              list-type="picture-card"
              :limit="1"
              :file-list="uploadFileList"
              :show-file-list="true"
              :auto-upload="true"
              :on-success="handleUploadSuccess"
              :on-preview="handleUploadImgPreview"
              :on-remove="handleUploadRemove"
              :on-change="handleUploadChange"
              ref="fileUploadRef"
            >
              <!-- <template v-if="employeeSelfInfo.employeeAvatar">
                <img
                  :src="employeeSelfInfo.employeeAvatar"
                  class="avatar w-100 h-100"
                />
              </template>
              <el-icon v-else><plus /></el-icon> -->
            </el-upload>
            <!-- <div class=" w-125px h-125px">
              <el-upload
                class="avatar-uploader"
                :headers="uploadHeaders"
                :action="IMG_UPLOAD_ADDRESS"
                :data="uploadData"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="limitImgAnd5M"
                ref="fileUploadRef"
                :on-preview="handleUploadImgPreview"
                :on-remove="handleUploadRemove"
              >
                <img 
                  v-if="employeeSelfInfo.employeeAvatar"
                  :src="employeeSelfInfo.employeeAvatar"
                  class="avatar w-125px h-125px"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </div> -->
            <!-- <embed :src="receiptFormData.imgReceipt" type="application/pdf" width=800 height=800></embed> -->
            <!--end::Image input-->

            <!--begin::Hint-->
            <div class="form-text">允许的文件类型: png, jpg, jpeg.</div>
            <!--end::Hint-->
          </div>
          <!--end::Col-->
        </div>
        <!--end::Input group-->

        <!--begin::Input group-->
        <div class="row mb-6">
          <!--begin::Label-->
          <label class="col-lg-4 col-form-label required fw-semobold fs-6"
            >姓名</label
          >
          <!--end::Label-->

          <!--begin::Col-->
          <div class="col-lg-8">
            <!--begin::Row-->
            <div class="row">
              <!--begin::Col-->
              <div class="col-lg-6 fv-row">
                <div
                  class="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                >
                  {{ employeeSelfInfo.employeeName }}
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->
          </div>
          <!--end::Col-->
        </div>
        <!--end::Input group-->

        <!--begin::Input group-->
        <div class="row mb-6">
          <!--begin::Label-->
          <label class="col-lg-4 col-form-label required fw-semobold fs-6"
            >部门</label
          >
          <!--end::Label-->

          <!--begin::Col-->
          <div class="col-lg-8 fv-row">
            <div
              class="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
            >
              {{ employeeSelfInfo.allDepartmentName }}
            </div>
          </div>
          <!--end::Col-->
        </div>
        <!--end::Input group-->

        <!--begin::Input group-->
        <div class="row mb-6">
          <!--begin::Label-->
          <label class="col-lg-4 col-form-label required fw-semobold fs-6"
            >手机号</label
          >
          <!--end::Label-->

          <!--begin::Col-->
          <div class="col-lg-8 fv-row">
            <div
              class="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
            >
              {{ employeeSelfInfo.employeePhone }}
            </div>
          </div>
          <!--end::Col-->
        </div>
        <!--end::Input group-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Basic info-->

  <!--begin::Sign-in Method-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
      role="button"
      data-bs-toggle="collapse"
      data-bs-target="#kt_account_signin_method"
    >
      <div class="card-title m-0">
        <h3 class="fw-bolder m-0">银行账户</h3>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Content-->
    <div id="kt_account_signin_method" class="collapse show">
      <!--begin::Card body-->
      <div class="card-body border-top p-9">
        <!--begin::Email Address-->
        <div class="d-flex flex-wrap align-items-center mb-8">
          <div id="kt_signin_email" :class="{ 'd-none': bankFormDisplay }">
            <div class="fs-4 fw-bolder mb-1">银行卡信息</div>
            <div class="fs-6 fw-semobold text-gray-600">
              {{ employeeAccountShowInfo }}
            </div>
          </div>

          <div
            id="kt_signin_email_edit"
            :class="{ 'd-none': !bankFormDisplay }"
            class="flex-row-fluid"
          >
            <!--begin::Form-->
            <el-form
              @submit.prevent="updateBankAccount()"
              :model="bankFormData"
              :rules="bankAccountRules"
              ref="bankFormRef"
              label-position="top"
            >
              <div class="row mb-6">
                <div class="col-lg-6 mb-4 mb-lg-0">
                  <div class="fv-row mb-0">
                    <!-- <label
                      for="bankAccountName"
                      class="form-label fs-6 fw-bold mb-3"
                      >输入银行名称</label
                    > -->
                    <el-form-item
                      label="银行名称"
                      prop="bankAccountNo"
                      class="fw-bold fs-6"
                    >
                      <el-select
                        id="bankAccountName"
                        size="large"
                        v-model="bankFormData.bankAccountName"
                        filterable
                        remote
                        placeholder="输入银行名称"
                        :remote-method="bankNameFilterMethod"
                        :loading="bankLoading"
                      >
                        <el-option
                          v-for="item in bankOptions"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="fv-row mb-0">
                    <!-- <label
                      for="bankAccountNo"
                      class="form-label fs-6 fw-bold mb-3"
                      >银行卡号</label
                    > -->

                    <el-form-item
                      label="银行卡号"
                      prop="bankAccountNo"
                      class="fw-bold fs-6"
                    >
                      <el-input
                        id="bankAccountNo"
                        size="large"
                        v-model="bankFormData.bankAccountNo"
                      />
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="d-flex">
                <button
                  id="kt_signin_submit"
                  type="submit"
                  ref="updateBankAccountBtn"
                  class="btn btn-primary me-2 px-6"
                >
                  <span class="indicator-label"> 更新银行信息 </span>
                  <span class="indicator-progress">
                    保存中...
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                </button>
                <button
                  id="kt_signin_cancel"
                  type="button"
                  class="btn btn-color-gray-400 btn-active-light-primary px-6"
                  @click="bankFormDisplay = !bankFormDisplay"
                >
                  取消
                </button>
              </div>
            </el-form>
            <!--end::Form-->
          </div>
          <div
            id="kt_signin_email_button"
            :class="{ 'd-none': bankFormDisplay }"
            class="ms-auto"
          >
            <button
              class="btn btn-light fw-bolder px-6"
              @click="beforeChangeAccount"
            >
              更改卡号
            </button>
          </div>
        </div>
        <!--end::Email Address-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Sign-in Method-->
  <el-dialog v-model="imgDialogVisible">
    <el-image :src="dialogImageUrl" fit="fill"></el-image>
  </el-dialog>
  <!--begin::确认用户登录密码-->
  <el-dialog
    v-model="dialogConfirmPwdVisible"
    title="输入登录密码"
    width="30%"
    :before-close="clearDialogDataAndClose"
    center
    :z-index="1050"
  >
    <el-form :model="confirmPwdForm" >
      <el-form-item >
        <el-input v-model="confirmPwdForm.loginPassword" type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="clearDialogDataAndClose">取消</el-button>
        <el-button type="primary" @click="confirmPwdBeforeShowAccount">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--end::确认用户登录密码-->
</template>

<script lang="ts" setup>
import { getAssetPath } from "@/core/helpers/assets";
import { banks } from "@/core/data/banks";
import { ref, onMounted, computed } from "vue";
import EmployeeService from "@/core/services/system/EmployeeService";
import { successAlert, errorAlert } from "@/core/utils/MessageUtils";
import { limitImgAnd5M } from "@/core/utils/ElementPlusUtils";
import { IMG_UPLOAD_ADDRESS } from "@/core/config/SystemConfig";
import JwtService from "@/core/services/JwtService";
import type { UploadProps } from "element-plus";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";

const uploadHeaders = { Authorization: `Bearer ${JwtService.getToken()}` };
const uploadData = ref({ type: "avatar" });
const imgDialogVisible = ref(false);
const dialogImageUrl = ref("");
const uploadFileList = ref<any>([]);
const handleUploadImgPreview: UploadProps["onPreview"] = () => {
  dialogImageUrl.value = employeeSelfInfo.value.employeeAvatar;
  imgDialogVisible.value = true;
};
const handleUploadSuccess: UploadProps["onSuccess"] = async (response) => {
  // receiptFormData.value.imgReceipt = URL.createObjectURL(uploadFile.raw!);
  employeeSelfInfo.value.employeeAvatar = response.obj;
  uploadFileList.value = [];
  uploadFileList.value.push({
    name: "",
    url: employeeSelfInfo.value.employeeAvatar,
  });
  await EmployeeService.updateAvatar(employeeSelfInfo.value.employeeAvatar);
};
const handleUploadRemove = () => {};
const handleExceed = () => {
  errorAlert("只允许1张图片!");
};
const handleUploadChange = (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  console.log("上传文件改变:", uploadFile, uploadFiles);
};

interface IEmployeeSelfInfo {
  employeeId?: number;
  employeeAvatar: string;
  employeeName: string;
  allDepartmentName: string;
  employeePhone: string;
  bankAccountName?: string;
  bankAccountNoMask?: string;
}

const bankFormData = ref({
  bankAccountName: "",
  bankAccountNo: "",
});

const bankOptions = ref<{ name: string }[]>();
const bankLoading = ref(false);
const updateBankAccountBtn = ref<HTMLElement | null>(null);
const bankFormDisplay = ref(false);
const employeeSelfInfo = ref<IEmployeeSelfInfo>({
  employeeAvatar: "/media/avatars/blank.png",
  employeeName: "",
  allDepartmentName: "",
  employeePhone: "",
  bankAccountName: "",
  bankAccountNoMask: "",
});

const bankAccountRules = ref({
  bankAccountName: [
    {
      required: true,
      message: "请输入银行名称",
      trigger: "blur",
    },
  ],
  bankAccountNo: [
    {
      required: true,
      message: "请输入银行卡号",
      trigger: "blur",
    },
    {
      min: 16,
      max: 20,
      message: "银行卡号位数不正确",
      trigger: "blur",
    },
  ],
});

onMounted(async () => {
  //初始化数据
  const response = await EmployeeService.self();
  employeeSelfInfo.value = response.data.obj;
  if (!employeeSelfInfo.value.employeeAvatar) {
    employeeSelfInfo.value.employeeAvatar = "/media/avatars/blank.png";
  }
  uploadFileList.value.push({
    name: "",
    url: employeeSelfInfo.value.employeeAvatar,
  });
});

const employeeAccountShowInfo = computed(() => {
  if (employeeSelfInfo.value.bankAccountName) {
    return (
      employeeSelfInfo.value.bankAccountName +
      " " +
      employeeSelfInfo.value.bankAccountNoMask
    );
  }
  return "";
});

const bankNameFilterMethod = (query: string) => {
  if (query) {
    bankLoading.value = true;
    setTimeout(() => {
      bankLoading.value = false;
      bankOptions.value = banks.filter((item) => {
        return item.name.includes(query.toLowerCase());
      });
    }, 200);
  } else {
    bankOptions.value = [];
  }
};

const updateBankAccount = async () => {
  updateBankAccountBtn.value!.setAttribute("data-kt-indicator", "on");
  try {
    const response = await EmployeeService.updateBankAccount(
      bankFormData.value.bankAccountName,
      bankFormData.value.bankAccountNo
    );
    employeeSelfInfo.value.bankAccountName = bankFormData.value.bankAccountName;
    employeeSelfInfo.value.bankAccountNoMask = response.data.obj;
    bankFormDisplay.value = false;
    successAlert("保存成功!");
  } finally {
    setTimeout(() => {
      updateBankAccountBtn.value?.removeAttribute("data-kt-indicator");
    }, 500);
  }
};

const changeAvatar = () => {
  console.log("更换头像");
};

const removeImage = () => {
  employeeSelfInfo.value.employeeAvatar = "/media/avatars/blank.png";
};

const beforeChangeAccount = () =>{
  dialogConfirmPwdVisible.value =true;
  
}
//::begin confirmPwd dialog
const dialogConfirmPwdVisible = ref(false);
const confirmPwdForm = ref({loginPassword:""});

const clearDialogDataAndClose = () =>{
  confirmPwdForm.value.loginPassword = "";
  dialogConfirmPwdVisible.value =false;
}
const confirmPwdBeforeShowAccount = async () =>{
  const response = await EmployeeService.confirmPwdBeforeChangeAccount(confirmPwdForm.value.loginPassword);
  bankFormData.value.bankAccountName = employeeSelfInfo.value.bankAccountName,
  bankFormData.value.bankAccountNo = response.data.obj;
  bankFormDisplay.value = true;
  clearDialogDataAndClose();
}
//::end confirmPwd dialog
</script>
