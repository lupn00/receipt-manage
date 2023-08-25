<template>
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Sidebar-->
    <div class="flex-column flex-lg-row-auto w-50 mb-10 mb-lg-0">
      <div class="card card-flush">
        <div class="card-header pt-7">

        </div>
        <div class="card-body pt-5" id="kt_chat_contacts_body">
          
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <el-row>
        <el-button
          type="primary"
          data-bs-toggle="modal"
          data-bs-target="#kt_modal_add_department"
          data-bs-editMode="false"
          >添加</el-button
        >
        <el-button
          type="info"
          data-bs-toggle="modal"
          data-bs-target="#kt_modal_add_department"
          data-bs-editMode="true"
          >编辑</el-button
        >
        <el-button type="danger" @click="deleteNode">删除</el-button>
      </el-row>
    </div>
    <div class="card-body pt-0">
      <!-- <h5 class="card-title">{{ departmentTree }}</h5> -->
      <div class="scroll-y mh-500px">
        <div class="tree-radio">
          <el-tree
            ref="treeRef"
            :data="departmentTree"
            :props="defaultProps"
            show-checkbox
            check-on-click-node
            default-expand-all
            node-key="id"
            highlight-current
            check-strictly
            @check-change="handleCheckChange"
            @node-click="handleNodeClick"
            @check="handleCheck"
          />
        </div>
      </div>
    </div>
  </div>

  <AddDepartmentModal
    :departmentNode="currentSelectedNode"
    @refreshTreeData="refreshTreeData"
  ></AddDepartmentModal>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from "vue"; 
import DepartmentServiceImpl from "@/core/services/system/DepartmentService";
import AddDepartmentModal from "@/views/system/AddDepartmentModal.vue";
import {
  errorAlert,
  successAlert,
  confirmAlert,
} from "@/core/utils/MessageUtils";

const departmentTree = ref([]);
const checkedId = ref();
const treeRef = ref<null | HTMLElement>(null);
const currentSelectedNode = ref(null);
const clickNum = ref<number>(0);

const getDepartmentTreeData = async () => {
  const response = await DepartmentServiceImpl.list();
  console.log("result", response.data.obj);
  departmentTree.value = response.data.obj;
  await nextTick();
  // (treeRef.value as any).setCheckedKeys([2]);
  console.log("Now DOM is updated");
  const treeNode = (treeRef.value as any).getNode(2);
  // checkedId.value = treeNode.data.id;
  currentSelectedNode.value = treeNode.data;
  (treeRef.value as any).setCheckedKeys([2]);
};
getDepartmentTreeData();

const refreshTreeData = () => {
  getDepartmentTreeData();
};
const customNodeClass = (data) => {
  if (data.isPenultimate) {
    return "no-checkbox-node";
  }
  return null;
};

// DepartmentService.search().then((response) => {
//   departmentTree.value = response.data.obj;
// });

const defaultProps = reactive({
  children: "children",
  label: "label",
  disabled: "disabled",
  class: customNodeClass,
});

// const filterNode = (value, data) => {
//   if (!value) return true;
//   return data.label.indexOf(value) !== -1;
// };
// 单选操作
const handleCheckChange = (data, checked) => {
  console.log("handleCheckChange", data.label, checked);
  if (checked) {
    currentSelectedNode.value = data;
    checkedId.value = data.id;
    // if (treeRef.value) {
    (treeRef.value as any).setCheckedKeys([data.id]);
    // treeRef.value.setCheckedKeys([data.id]);
    // }
  } else {
    // (treeRef.value as any).setCheckedKeys([]);
    if (checkedId.value === data.id) {
      (treeRef.value as any).setCheckedKeys([data.id]);
    }
  }
};
const handleCheck = (data) => {
  console.log("handleCheck", data);
};
const handleNodeClick = (data, node) => {
  console.log("handleNodeClick", data.label);
  if (node.disabled) {
    checkedId.value = data.id;
    console.log("handleNodeClick", node);
    (treeRef.value as any).setCheckedKeys([data.id]);
  }
  // console.log("handleNodeClick", node);
  // (treeRef.value as any).setCheckedKeys([data.id]);
  // checkedId.value = data.id;
  // currentSelectedNode.value = data;
};

// 获取单选选中的结果
const getCheckedTree = () => {
  alert(`当前选中的节点为：${checkedId.value}`);
};

const deleteNode = async () => {
  const confirmResult = await confirmAlert("确定要删除吗？");
  if (confirmResult.isConfirmed) {
    const selectedKey = (treeRef.value as any).getCheckedKeys()[0];
    const delResult = await DepartmentServiceImpl.delete(selectedKey);
    if (delResult.data.status === 1) {
      successAlert("删除成功!");
      getDepartmentTreeData();
    }
  }
};
</script>
<style lang="scss" >
// 样式重置，记得把 scoped 属性去掉才能生效
.tree-radio {
  // border: 1px solid #ddd;
  // padding: 20px;
  // border-radius: 5px;
  // h3 {
  //   font-weight: 300;
  //   color: #ff9b61;
  //   font-size: 18px;
  // }
  // width: 500px;
  // margin: 100px auto;
  .no-checkbox-node {
    & > .el-tree-node__content {
      .el-checkbox {
        display: none;
      }
    }
  }
  .el-checkbox__inner {
    border-radius: 50%;
  }
}
</style>