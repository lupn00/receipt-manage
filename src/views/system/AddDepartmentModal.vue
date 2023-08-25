<template>
  <div
    class="modal fade"
    id="kt_modal_add_department"
    ref="addDepartmentModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_department_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">{{ isEdit ? "编辑部门" : "添加部门" }}</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_add_department_close"
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
              id="kt_modal_add_department_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_department_header"
              data-kt-scroll-wrappers="#kt_modal_add_department_scroll"
              data-kt-scroll-offset="300px"
            >
              <div v-show="!isEdit">
                <div class="d-flex justify-content-start mb-7">
                  <!--begin::Nav group-->
                  <div
                    class="nav-group nav-group-outline"
                    data-kt-buttons="true"
                  >
                    <button
                      type="button"
                      @click="formData.relationship = 'sibling'"
                      :class="[formData.relationship === 'sibling' && 'active']"
                      class="btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 me-2"
                    >
                      同级节点
                    </button>
                    <button
                      type="button"
                      @click="formData.relationship = 'child'"
                      :class="[formData.relationship === 'child' && 'active']"
                      class="btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3"
                    >
                      子节点
                    </button>
                  </div>
                  <!--end::Nav group-->
                </div>
              </div>

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-bold mb-2">部门名称</label>
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
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              关闭
            </button>

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
                请稍后...
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
import { defineComponent, ref, onMounted } from "vue";
import { hideModal } from "@/core/helpers/dom";
import DepartmentServiceImpl from "@/core/services/system/DepartmentService";
import { errorAlert, successAlert } from "@/core/utils/MessageUtils";

export default defineComponent({
  name: "add-department-modal",
  props: {
    departmentNode: {
      type: Object,
      // required: true,
    },
  },
  components: {},
  setup(props, context) {
    console.log("departmentNode", props.departmentNode);
    // const current = ref<"sibling" | "child">("sibling");
    const submitButton = ref<HTMLButtonElement | null>(null);
    const formRef = ref<null | HTMLFormElement>(null);
    const addDepartmentModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    const isEdit = ref<boolean>(false);

    const formData = ref({
      id: 0,
      relativeId: 0,
      name: "",
      status: true,
      relationship: "child",
    });

    // var myModalEl = document.getElementById("myModal");
    // myModalEl.addEventListener("hidden.bs.modal", function (event) {
    //   // do something...
    // });
    onMounted(() => {
      console.log("DepartmentTree----onMounted");
      // var myModalEl = document.getElementById("myModal");
      if (addDepartmentModalRef.value) {
        addDepartmentModalRef.value.addEventListener(
          "show.bs.modal",
          function (event) {
            var button = (event as any).relatedTarget;
            // Extract info from data-bs-* attributes
            var editMode = button.getAttribute("data-bs-editMode");
            isEdit.value = editMode === "true" ? true : false;

            console.log("editMode", editMode);
            console.log("show.bs.modal执行", event, props);
            if (editMode === "true") {
              console.log(
                "编辑模式",
                event,
                props.departmentNode!.id,
                props.departmentNode!.label,
                props.departmentNode!.disabled
              );
              //编辑模式下初始化页面值为选中树节点
              formData.value.id = props.departmentNode!.id;
              formData.value.name = props.departmentNode!.label;
              formData.value.status = !props.departmentNode!.disabled;
              // formData.value.name = selection.label;
            } else {
              console.log("新增模式", event, props.departmentNode!.id);
              //新增模式下设置关联节点信息
              formData.value.relativeId = props.departmentNode!.id;
              formData.value.name = "";
              formData.value.status = true;
              (formRef.value as any).resetFields();
            }
          }
        );
      }
    });

    const rules = ref({
      name: [
        {
          required: true,
          message: "部门名称必填",
          trigger: "change",
        },
      ],
    });
    const submit = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate((valid) => {
        if (valid) {
          loading.value = true;
          if (submitButton.value) {
            // eslint-disable-next-line
            submitButton.value!.disabled = true;
          }
          console.log("!isEdit.value", !isEdit.value);
          //保存部门信息
          if (!isEdit.value) {
            DepartmentServiceImpl.save(formData.value)
              .then((response) => {
                successAlert("保存成功!");
                context.emit("refreshTreeData");
                console.log(response);
              })
              .finally(() => {
                (formRef.value as any).resetFields();
                // formData.value.name = "";
                loading.value = false;
                // eslint-disable-next-line
                submitButton.value!.disabled = false;
                hideModal(addDepartmentModalRef.value);
              });
          } else {
            DepartmentServiceImpl.update(formData.value)
              .then((response) => {
                successAlert("修改成功!");
                context.emit("refreshTreeData");
                console.log(response);
              })
              .finally(() => {
                (formRef.value as any).resetFields();
                // formData.value.name = "";
                loading.value = false;
                // eslint-disable-next-line
                submitButton.value!.disabled = false;
                hideModal(addDepartmentModalRef.value);
              });
          }
        } else {
          errorAlert("请正确填写部门信息.");
          return false;
        }
      });
    };

    return {
      isEdit,
      formData,
      rules,
      submit,
      submitButton,
      formRef,
      loading,
      addDepartmentModalRef,
    };
  },
});
</script>
