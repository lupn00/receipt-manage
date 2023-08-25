<template>
  <div
    class="modal fade"
    id="kt_modal_change_pwd"
    ref="changePwdModalRef"
    tabindex="-1"
    aria-hidden="true"
    data-bs-backdrop="false"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_change_pwd_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">修改密码</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_change_pwd_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->
        <!--begin::Form-->
        <el-form
          @submit.prevent="submit()"
          :model="formData"
          :rules="rules"
          ref="formRef"
        >
          <!--begin::Modal body-->
          <div class="modal-body py-10 px-lg-17">
            <!--begin::Scroll-->
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_change_pwd_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_change_pwd_header"
              data-kt-scroll-wrappers="#kt_modal_change_pwd_scroll"
              data-kt-scroll-offset="300px"
            >
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-bold mb-2">当前密码</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="nowPwd">
                  <el-input
                    v-model="formData.nowPwd"
                    type="password"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-bold mb-2">新密码</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="newPwd">
                  <el-input
                    v-model="formData.newPwd"
                    type="password"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-bold mb-2">确认新密码</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="newPwdConfirm">
                  <el-input
                    v-model="formData.newPwdConfirm"
                    type="password"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->
            </div>
            <!--end::Scroll-->
          </div>
          <!--end::Modal body-->

          <!--begin::Modal footer-->
          <div class="modal-footer flex-center">
            <button
              @click="closeFrom"
              type="button"
              id="kt_modal_change_pwd_cancel"
              class="btn btn-secondary me-3"
            >
              关闭
            </button>
            <!--end::Button-->

            <!--begin::Button-->
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary"
              type="submit"
              ref="submitButton"
            >
              <span v-if="!loading" class="indicator-label">
                保存
                <span class="svg-icon svg-icon-3 ms-2 me-0">
                  <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
                </span>
              </span>
              <span v-if="loading" class="indicator-progress">
                保存中...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
            <!--end::Button-->
          </div>
          <!--end::Modal footer-->
        </el-form>
        <!--end::Form-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { hideModal } from "@/core/helpers/dom";
import { errorAlert, successAlert } from "@/core/utils/MessageUtils";

import EmployeeService from "@/core/services/system/EmployeeService";

export default defineComponent({
  name: "change-pwd-modal",
  setup() {
    const formData = ref({
      nowPwd: "",
      newPwd: "",
      newPwdConfirm: "",
    });

    const formRef = ref<null | HTMLFormElement>(null);
    const changePwdModalRef = ref<null | HTMLElement>(null);
    const submitButton = ref<HTMLButtonElement | null>(null);
    const loading = ref<boolean>(false);

    const rules = ref({
      nowPwd: [
        {
          required: true,
          message: "原密码必填",
          trigger: "change",
        },
      ],
      newPwd: [
        {
          required: true,
          message: "新密码必填",
          trigger: "blur",
        },
        {
          min: 6,
          message: "密码不能少于6位",
          trigger: "blur",
        },
      ],
      newPwdConfirm: [
        {
          required: true,
          message: "确认新密码必填",
          trigger: "blur",
        },
      ],
    });

    onMounted(() => {
      if (changePwdModalRef.value) {
        changePwdModalRef.value.addEventListener("hide.bs.modal", () => {
          clearFrom();
        });
      }
    });

    const closeFrom = () => {
      hideModal(changePwdModalRef.value);
    };

    const clearFrom = () => {
      if (formData.value) {
        formData.value = {
          nowPwd: "",
          newPwd: "",
          newPwdConfirm: "",
        };
      }
      if (formRef.value) {
        (formRef.value as any).resetFields();
      }
    };

    const submit = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate((valid) => {
        if (valid) {
          if (formData.value.newPwd != formData.value.newPwdConfirm) {
            errorAlert("两次输入密码不一致!");
            return;
          }
          loading.value = true;
          // eslint-disable-next-line
          submitButton.value!.disabled = true;
          //新增模式下
          EmployeeService.changePwd(formData.value)
            .then((response) => {
              successAlert(response.data.message);
              console.log(response);
              hideModal(changePwdModalRef.value);
            })
            .finally(() => {
              // formData.value.name = "";
              loading.value = false;
              // eslint-disable-next-line
              submitButton.value!.disabled = false;
            });
        } else {
          errorAlert("请正确填写员工信息");
          return false;
        }
      });
    };

    return {
      formData,
      rules,
      submitButton,
      submit,
      closeFrom,
      clearFrom,
      formRef,
      loading,
      changePwdModalRef,
    };
  },
});
</script>
<style scoped>
.modal-backdrop {
  z-index: auto !important;
}
</style>
