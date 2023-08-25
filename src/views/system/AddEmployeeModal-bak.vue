<template>
  <div
    class="modal fade"
    id="kt_modal_add_employee"
    ref="addEmployeeModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_employee_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">{{ isEdit ? "编辑员工" : "添加员工" }}</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_add_employee_close"
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
              id="kt_modal_add_employee_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_employee_header"
              data-kt-scroll-wrappers="#kt_modal_add_employee_scroll"
              data-kt-scroll-offset="300px"
            >
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">部门</label>
                <a-tree-select
                  v-model:value="formData.departmentId"
                  show-search
                  style="width: 100%"
                  :dropdown-style="{
                    maxHeight: '400px',
                    overflow: 'auto',
                    zIndex: 10000,
                  }"
                  placeholder="Please select"
                  allow-clear
                  tree-default-expand-all
                  :tree-data="departments"
                  :field-names="{
                    children: 'children',
                    label: 'label',
                    key: 'id',
                    value: 'id',
                  }"
                >
                  <!-- <template #title="{ value: val, title }">
                    <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
                    <template v-else>{{ title }}</template>
                  </template> -->
                </a-tree-select>
              </div>
              <!-- :replace-fields="{
                    children: 'children',
                    label: 'label',
                    key: 'id',
                    value: 'id',
                  }" -->
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-bold mb-2">姓名</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="name">
                  <el-input
                    v-model="formData.name"
                    type="text"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="fs-6 fw-bold mb-2">
                  <span class="required">手机号</span>

                  <i
                    class="fas fa-exclamation-circle ms-1 fs-7"
                    data-bs-toggle="tooltip"
                    title="请输入11位手机号码"
                  ></i>
                </label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="phone">
                  <el-input v-model="formData.phone" />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="fs-6 fw-bold mb-2">出生日期</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="ddBirthday">
                  <el-date-picker
                    v-model="formData.ddBirthday"
                    type="date"
                    placeholder="选择日期"
                    value-format="YYYY-MM-DD"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="fs-6 fw-bold mb-2">照片</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="avatar">
                  <el-upload
                    :headers="headers"
                    :data="data"
                    :action="IMG_UPLOAD_ADDRESS"
                    accept="image/*"
                    :before-upload="limitImgAnd5M"
                    list-type="picture-card"
                    :on-remove="handleRemove"
                    :limit="1"
                    :file-list="fileList"
                    :auto-upload="true"
                    :on-success="handelImgUpSuccess"
                    :on-exceed="handleExceed"
                    ref="fileUploadRef"
                  >
                    <el-icon><plus /></el-icon>
                  </el-upload>
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="fs-6 fw-bold mb-2">
                  <span class="">驾驶证类别</span>

                  <!-- <i
                      class="fas fa-exclamation-circle ms-1 fs-7"
                      data-bs-toggle="tooltip"
                      title="Country of origination"
                    ></i> -->
                </label>
                <!--end::Label-->
                <!--begin::Input-->
                <el-form-item prop="categoryDl">
                  <el-select v-model="formData.categoryDl" style="width: 100%">
                    <el-option value="">选择一种驾驶证...</el-option>
                    <el-option :value="1" label="A1" />
                    <el-option :value="2" label="A2" />
                    <el-option :value="3" label="B1" />
                    <el-option :value="4" label="B2" />
                    <el-option :value="5" label="C1" />
                  </el-select>
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="fs-6 fw-bold mb-2">驾驶证</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="imgDl">
                  <el-upload
                    :headers="headers"
                    :data="dataDl"
                    :action="IMG_UPLOAD_ADDRESS"
                    accept="image/*"
                    :before-upload="limitImgAnd5M"
                    list-type="picture-card"
                    :on-remove="handleDlRemove"
                    :limit="1"
                    :file-list="fileDlList"
                    :auto-upload="true"
                    :on-success="handelDlImgUpSuccess"
                    :on-exceed="handleDlExceed"
                    ref="fileDlUploadRef"
                  >
                    <el-icon><plus /></el-icon>
                  </el-upload>
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="fs-6 fw-bold mb-2">
                  <span class="required">用户角色</span>
                </label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="roleId">
                  <div class="d-flex align-items-start">
                    <label
                      class="flex-fill form-check form-check-custom form-check-solid"
                      ><input
                        class="form-check-input h-20px w-20px"
                        type="radio"
                        name="roleId"
                        value="0"
                        v-model="formData.roleId"
                      /><span class="form-check-label fw-bold">
                        员工
                      </span></label
                    ><label
                      class="flex-fill form-check form-check-custom form-check-solid"
                      ><input
                        class="form-check-input h-20px w-20px"
                        type="radio"
                        name="roleId"
                        value="1"
                        v-model="formData.roleId"
                      /><span class="form-check-label fw-bold">
                        司机
                      </span></label
                    >
                    <label
                      class="flex-fill form-check form-check-custom form-check-solid"
                      ><input
                        class="form-check-input h-20px w-20px"
                        type="radio"
                        name="roleId"
                        value="2"
                        v-model="formData.roleId"
                      /><span class="form-check-label fw-bold">
                        部门领导
                      </span></label
                    >
                    <label
                      class="flex-fill form-check form-check-custom form-check-solid"
                      ><input
                        class="form-check-input h-20px w-20px"
                        type="radio"
                        name="roleId"
                        value="3"
                        v-model="formData.roleId"
                      /><span class="form-check-label fw-bold">
                        分管领导
                      </span></label
                    >
                    <label
                      class="flex-fill form-check form-check-custom form-check-solid"
                      ><input
                        class="form-check-input h-20px w-20px"
                        type="radio"
                        name="roleId"
                        value="4"
                        v-model="formData.roleId"
                      /><span class="form-check-label fw-bold">
                        车辆管理员
                      </span></label
                    >
                  </div>
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="fs-6 fw-bold mb-2">
                  <span class="">管理后台角色</span>
                </label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="roleId">
                  <div class="d-flex align-items-start">
                    <label
                      class="flex-fill form-check form-check-custom form-check-solid"
                      ><input
                        class="form-check-input h-20px w-20px"
                        type="checkbox"
                        value="101"
                        v-model="formData.adminRoles"
                      /><span class="form-check-label fw-bold">
                        加油
                      </span></label
                    ><label
                      class="flex-fill form-check form-check-custom form-check-solid"
                      ><input
                        class="form-check-input h-20px w-20px"
                        type="checkbox"
                        value="102"
                        v-model="formData.adminRoles"
                      /><span class="form-check-label fw-bold">
                        保险
                      </span></label
                    >
                    <label
                      class="flex-fill form-check form-check-custom form-check-solid"
                      ><input
                        class="form-check-input h-20px w-20px"
                        type="checkbox"
                        value="103"
                        v-model="formData.adminRoles"
                      /><span class="form-check-label fw-bold">
                        ETC
                      </span></label
                    >
                    <label
                      class="flex-fill form-check form-check-custom form-check-solid"
                      ><input
                        class="form-check-input h-20px w-20px"
                        type="checkbox"
                        value="104"
                        v-model="formData.adminRoles"
                      /><span class="form-check-label fw-bold">
                        维修
                      </span></label
                    >
                  </div>
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="d-flex align-items-center mt-10">
                <!--begin::Switch-->
                <label
                  class="form-check form-switch form-check-custom form-check-solid"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="formData.status"
                  />
                  <span class="form-check-label"> 启用 </span>
                </label>
                <!--end::Switch-->
              </div>
              <!--end::Input group-->
            </div>
            <!--end::Scroll-->
          </div>
          <!--end::Modal body-->

          <!--begin::Modal footer-->
          <div class="modal-footer flex-center">
            <!--begin::Button-->
            <button
              v-if="!isEdit"
              @click="clearFrom"
              type="button"
              id="kt_modal_add_employee_cancel"
              class="btn btn-light me-3"
            >
              清空
            </button>
            <button
              v-else
              @click="closeFrom"
              type="button"
              id="kt_modal_add_employee_cancel"
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
import { defineComponent, onMounted, ref, watch, nextTick } from "vue";
import { hideModal } from "@/core/helpers/dom";
import JwtService from "@/core/services/JwtService";
import { limitImgAnd5M } from "@/core/utils/ElementPlusUtils";
import { errorAlert, successAlert } from "@/core/utils/MessageUtils";
import { IMG_UPLOAD_ADDRESS } from "@/core/config/SystemConfig";
import type { TreeSelectProps } from "ant-design-vue";

import DepartmentService from "@/core/services/system/DepartmentService";
import EmployeeService from "@/core/services/system/EmployeeService";
import {
  type IEmployee,
  initEmployeeVal,
  EmployeeValidRules,
} from "@/core/services/system/EmployeeService";
import { formatDate } from "@/core/utils/CommonUtils";

export default defineComponent({
  name: "add-employee-modal-bak",
  components: {},
  emits: ["clear-selected-employee", "refresh-data"],
  props: {
    selectedEmployee: {
      type: Object,
      required: false,
    },
  },
  setup(props, context) {
    const formData = ref<IEmployee>(initEmployeeVal());

    //文件上传相关begin
    const headers = ref({ Authorization: `Token ${JwtService.getToken()}` });
    //头像上传组件begin
    const data = ref({ type: "employeeAvatar" });
    const fileUploadRef = ref(null);
    const fileList = ref<any>([]);

    const setAvatarImg = () => {
      let files = (fileUploadRef.value as any).uploadFiles;
      let imgUrls: string[] = [];

      if (!files.length || files.length == 0) {
        formData.value.avatar = "";
      } else {
        files.forEach((item) => {
          if (item.response) {
            //上传完后 会有这个属性
            imgUrls.push(item.response.obj);
          } else {
            //初始化默认获取以前上传的图片时,没有response属性,这是获取默认显示图片的 fileList 里面的 url
            imgUrls.push(item.url);
          }
        });
        formData.value.avatar = imgUrls[0];
      }
    };

    const handleRemove = (file) => {
      // 防止是文件格式不正确时,自动触发的此事件
      if (file && file.status === "success") {
        setAvatarImg();
      }
    };
    const handelImgUpSuccess = () => {
      setAvatarImg();
    };
    const handleExceed = () => {
      errorAlert("照片只允许传1张图片!");
    };
    //头像上传组件end

    //驾驶证上传组件begin
    const dataDl = ref({ type: "driverDl" });
    const fileDlUploadRef = ref(null);
    const fileDlList = ref<any>([]);

    const setDlImg = () => {
      let files = (fileDlUploadRef.value as any).uploadFiles;
      let imgUrls: string[] = [];

      if (!files.length || files.length == 0) {
        formData.value.imgDl = "";
      } else {
        files.forEach((item) => {
          if (item.response) {
            //上传完后 会有这个属性
            imgUrls.push(item.response.obj);
          } else {
            //初始化默认获取以前上传的图片时,没有response属性,这是获取默认显示图片的 fileList 里面的 url
            imgUrls.push(item.url);
          }
        });
        formData.value.imgDl = imgUrls[0];
      }
    };
    const handleDlRemove = (file) => {
      // 防止是文件格式不正确时,自动触发的此事件
      if (file && file.status === "success") {
        setDlImg();
      }
    };

    const handelDlImgUpSuccess = () => {
      setDlImg();
    };
    const handleDlExceed = () => {
      errorAlert("驾驶证只允许传1张图片!");
    };
    //驾驶证上传组件end

    //文件上传相关end

    const isEdit = ref<boolean>(false);
    const formRef = ref<null | HTMLFormElement>(null);
    const addEmployeeModalRef = ref<null | HTMLElement>(null);
    const submitButton = ref<HTMLButtonElement | null>(null);
    const loading = ref<boolean>(false);

    const departments = ref([]);

    const listDepartment = async () => {
      const response = await DepartmentService.inUse();
      let treeList = response.data.obj;
      departments.value = treeList;
      console.log(departments.value);
    };
    listDepartment();

    const rules = ref(EmployeeValidRules);

    watch(
      () => props.selectedEmployee,
      (newValue) => {
        console.log("props.selectedEmployee", newValue);
        if (isEdit.value && newValue) {
          nextTick(() => {
            Object.assign(formData.value, newValue);
            formData.value.status = newValue.status == 1;
            formData.value.ddBirthday = formatDate(newValue.ddBirthday);
            if (newValue.adminRoles) {
              formData.value.adminRoles = newValue.adminRoles.split(",");
            } else {
              formData.value.adminRoles = [];
            }
            if (newValue.avatar) {
              fileList.value = [];
              const arr: string[] = newValue.avatar.split(",");
              arr.forEach((item) => {
                fileList.value.push({ name: "", url: item });
              });
            }
            if (newValue.imgDl) {
              fileDlList.value = [];
              const arr: string[] = newValue.imgDl.split(",");
              arr.forEach((item) => {
                fileDlList.value.push({ name: "", url: item });
              });
            }
          });
        }
      }
    );

    onMounted(() => {
      if (addEmployeeModalRef.value) {
        addEmployeeModalRef.value.addEventListener(
          "show.bs.modal",
          function (event) {
            //打开对话框时重置校验结果
            // (formRef.value as any).clearValidate();

            const button = (event as any).relatedTarget;
            var editMode = button.getAttribute("data-bs-editMode");
            isEdit.value = editMode === "true" ? true : false;
            if (isEdit.value) {
              console.log("编辑模式", props.selectedEmployee);
            } else {
              console.log("新增模式");
            }
          }
        );
        addEmployeeModalRef.value.addEventListener("hide.bs.modal", () => {
          console.log("hide.bs.modal");
          isEdit.value = false;
          clearFrom();
          if (formRef.value) {
            (formRef.value as any).clearValidate();
          }
          context.emit("clear-selected-employee");
        });
      }
    });

    const closeFrom = () => {
      hideModal(addEmployeeModalRef.value);
    };

    const clearFrom = () => {
      if (formData.value) {
        formData.value = initEmployeeAddVal();
      }
      if (formRef.value) {
        (formRef.value as any).resetFields();
      }
      if (fileUploadRef.value) {
        (fileUploadRef.value as any).clearFiles();
      }
      if (fileDlUploadRef.value) {
        (fileDlUploadRef.value as any).clearFiles();
      }
    };

    const submit = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate((valid) => {
        if (valid) {
          loading.value = true;
          // eslint-disable-next-line
          submitButton.value!.disabled = true;
          if (!isEdit.value) {
            //新增模式下
            EmployeeService.save(formData.value)
              .then((response) => {
                successAlert("保存成功!");
                context.emit("refresh-data");
                console.log(response);
              })
              .finally(() => {
                // formData.value.name = "";
                loading.value = false;
                // eslint-disable-next-line
                submitButton.value!.disabled = false;
                // hideModal(addEmployeeModalRef.value);
              });
          } else {
            //编辑模式下
            EmployeeService.update(formData.value)
              .then(() => {
                successAlert("保存成功!");
                context.emit("refresh-data");
              })
              .finally(() => {
                // (formRef.value as any).resetFields();
                // formData.value.name = "";
                loading.value = false;
                // eslint-disable-next-line
                submitButton.value!.disabled = false;
                hideModal(addEmployeeModalRef.value);
              });
          }
        } else {
          errorAlert("请正确填写员工信息");
          return false;
        }
      });
    };

    return {
      isEdit,
      departments,
      formData,
      rules,
      submitButton,
      submit,
      closeFrom,
      clearFrom,
      formRef,
      loading,
      addEmployeeModalRef,

      limitImgAnd5M,
      IMG_UPLOAD_ADDRESS,
      headers,

      data,
      fileUploadRef,
      handleExceed,
      handelImgUpSuccess,
      handleRemove,
      fileList,

      dataDl,
      fileDlUploadRef,
      handleDlExceed,
      handelDlImgUpSuccess,
      handleDlRemove,
      fileDlList,
    };
  },
});
</script>
