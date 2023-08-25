<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="角色信息"
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="saveRole" :loading="loadingFlag">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: "add-role-modal",
};
</script>

<script lang="ts" setup>
import { onMounted, ref, onActivated, onDeactivated } from "vue";
import JwtService from "@/core/services/JwtService";
import { limitImgAnd5M } from "@/core/utils/ElementPlusUtils";
import { errorAlert, successAlert } from "@/core/utils/MessageUtils";

import DepartmentService from "@/core/services/system/DepartmentService";
import RoleService from "@/core/services/system/RoleService";
import {
  type IRole,
  initRole,
  RoleValidRules,
} from "@/core/services/system/RoleService";

const props = defineProps<{
  editRole?: IRole;
}>();
const emit = defineEmits(["close-role-add-dialog", "refresh-data"]);

const dialogFormVisible = ref<boolean>(true);
let formData = ref<IRole>(initRole());

const formRules = ref(RoleValidRules);
const formLabelWidth = "140px";
const loadingFlag = ref(false);

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

const saveRole = async () => {
  if (!dialogFormRef.value) {
    return;
  }

  const validResult = await dialogFormRef.value.validate(() => {});
  console.log(validResult);
  if (validResult) {
    loadingFlag.value = true;
    if (!isEdit.value) {
      //新增模式下
      RoleService.save(formData.value)
        .then((response) => {
          successAlert("保存成功!");
          // 保留部门信息方便继续填写 formData.value = initEmployeeVal();
          dialogFormRef.value!.resetFields();
          emit("refresh-data");
          console.log(response);
        })
        .finally(() => {
          loadingFlag.value = false;
        });
    } else {
      //编辑模式下
      RoleService.update(formData.value)
        .then(() => {
          handleClose();
          successAlert("保存成功!");
          emit("refresh-data");
        })
        .finally(() => {
          loadingFlag.value = false;
        });
    }
  }
};

const handleClose = () => {
  formData.value = initRole();
  dialogFormRef.value!.resetFields();
  console.log("handleClose");
  dialogFormVisible.value = false;
  emit("close-role-add-dialog");
};

onActivated(() => {
  if (props.editRole) {
    // props.editEmployee.name = "哈哈哈哈";
    isEdit.value = true;
    console.log("接收到的employee对象：", props.editRole);

    formData.value = Object.assign({}, props.editRole);
    // formData.value = props.editEmployee;
  } else {
    isEdit.value = false;
    formData.value = initRole();
  }
  loadingFlag.value = false;
  dialogFormVisible.value = true;
  console.log("onActivated");
});
onDeactivated(() => {
  console.log("onDeactivated");
});
</script>
