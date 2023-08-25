<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="员工信息"
    :before-close="handleClose"
    :z-index="1050"
  >
    <el-form
      :model="formData"
      :label-width="formLabelWidth"
      :rules="formRules"
      ref="dialogFormRef"
      status-icon
    >
      <el-form-item label="部门">
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
        </a-tree-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="saveEmployee" :loading="loadingFlag">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: "add-employee-modal",
};
</script>

<script lang="ts" setup>
import { onMounted, ref, onActivated, onDeactivated } from "vue";
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

const props = defineProps<{
  editEmployee?: IEmployee;
}>();
const emit = defineEmits(["close-employee-add-dialog", "refresh-data"]);

const dialogFormVisible = ref<boolean>(true);
let formData = ref<IEmployee>(initEmployeeVal());

const formRules = ref(EmployeeValidRules);
const formLabelWidth = "140px";
const loadingFlag = ref(false);

//文件上传相关begin
const headers = ref({ Authorization: `Token ${JwtService.getToken()}` });
const data = ref({ type: "employeeAvatar" });
const fileUploadRef = ref(null);
//头像上传组件begin

const isEdit = ref<boolean>(false);
const dialogFormRef = ref<null | HTMLFormElement>(null);

const departments = ref([]);

const listDepartment = async () => {
  console.log("加载list数据！");
  const response = await DepartmentService.inUse();
  let treeList = response.data.obj;
  departments.value = treeList;
  console.log(departments.value);
};
listDepartment();

onMounted(() => {
  console.log("onMounted");
});

const cancelDialog = () => {
  dialogFormVisible.value = false;
  handleClose();
};

const saveEmployee = async () => {
  if (!dialogFormRef.value) {
    return;
  }

  const validResult = await dialogFormRef.value.validate(() => {});
  console.log(validResult);
  if (validResult) {
    loadingFlag.value = true;
    if (!isEdit.value) {
      //新增模式下
      EmployeeService.save(formData.value)
        .then((response) => {
          successAlert("保存成功!");
          // 保留部门信息方便继续填写 formData.value = initEmployeeVal();
          dialogFormRef.value!.resetFields();
          // emit("close-employee-add-dialog");
          emit("refresh-data");
          console.log(response);
        })
        .finally(() => {
          loadingFlag.value = false;
        });
    } else {
      //编辑模式下
      EmployeeService.update(formData.value)
        .then(() => {
          dialogFormVisible.value = false;
          successAlert("保存成功!");
          emit("close-employee-add-dialog");
          emit("refresh-data");
        })
        .finally(() => {
          loadingFlag.value = false;
        });
    }
  }
};

const handleClose = () => {
  formData.value = initEmployeeVal();
  dialogFormRef.value!.resetFields();
  console.log("handleClose");
  dialogFormVisible.value = false;
  emit("close-employee-add-dialog");
};

onActivated(() => {
  if (props.editEmployee) {
    // props.editEmployee.name = "哈哈哈哈";
    isEdit.value = true;
    console.log("接收到的employee对象：", props.editEmployee);

    formData.value = Object.assign({}, props.editEmployee);
    // formData.value = props.editEmployee;
  } else {
    isEdit.value = false;
    formData.value = initEmployeeVal();
  }
  loadingFlag.value = false;
  dialogFormVisible.value = true;
  console.log("onActivated");
});
onDeactivated(() => {
  console.log("onDeactivated");
});
</script>
