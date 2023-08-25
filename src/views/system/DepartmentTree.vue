<template>
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Sidebar-->
    <div class="flex-column flex-lg-row-auto w-50 mb-10 mb-lg-0">
      <div class="card card-flush">
        <div class="card-header pt-7">
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
            <el-button
              type="success"
              @click="saveDepartmentRole"
              :loading="departmentRoleLoadingFlag"
              >保存部门对应角色</el-button
            >
          </el-row>
        </div>
        <div class="card-body pt-5">
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
    <!--end::Sidebar-->
    <!--begin::Content-->
    <div class="flex-lg-row-fluid ms-lg-7 ms-xl-10">
      <!--begin::Messenger-->
      <div class="card" id="kt_chat_messenger">
        <!--begin::Card header-->
        <div class="card-header" id="kt_chat_messenger_header">
          <!--begin::Title-->
          <div class="card-title">
            <!--begin::User-->
            <div class="d-flex justify-content-center flex-column me-3">
              <h3 class="fw-bold m-0">角色列表</h3>
            </div>
            <!--end::User-->
          </div>
          <!--end::Title-->

          <!--begin::Card toolbar-->
          <div class="card-toolbar">
            <!--begin::Menu-->
            <div class="me-n3">
              <button
                class="btn btn-sm btn-icon btn-active-light-primary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
                data-kt-menu-flip="top-end"
              >
                <i class="bi bi-three-dots fs-2"></i>
              </button>
            </div>
            <!--end::Menu-->
          </div>
          <!--end::Card toolbar-->
        </div>
        <!--end::Card header-->

        <!--begin::Card body -->
        <div class="card-body" id="kt_chat_messenger_body">
          <el-table
            ref="tableRef"
            :data="tableData"
            stripe
            border
            @selection-change="handleTableSelectChange"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="名称" width="150" />
            <el-table-column prop="remark" label="备注" />
            <!-- <el-table-column
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
            </el-table-column> -->
          </el-table>
        </div>
        <!--end::Card body-->

        <!--begin::Card footer-->
        <div class="card-footer pt-4"></div>
        <!--end::Card footer-->
      </div>
      <!--end::Messenger-->
    </div>
    <!--end::Content-->
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
import type { IRole } from "@/core/services/system/RoleService";
import RoleService from "@/core/services/system/RoleService";
import { ElTable } from "element-plus";
import type { IDepartmentRoles } from "@/core/services/system/DepartmentService";

const departmentTree = ref([]);
const checkedId = ref();
const treeRef = ref<null | HTMLElement>(null);
const currentSelectedNode = ref(null);
const clickNum = ref<number>(0);

const tableData = ref<IRole[]>();
const departmentRoleLoadingFlag = ref(false);
const tableRef = ref<InstanceType<typeof ElTable>>();

const listRoleInUse = async () => {
  const response = await RoleService.listInUse();
  tableData.value = response.data.obj;
};
listRoleInUse();

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
const handleCheckChange = async (data, checked) => {
  console.log("handleCheckChange", data.label, checked);
  if (checked) {
    currentSelectedNode.value = data;
    checkedId.value = data.id;
    // if (treeRef.value) {
    (treeRef.value as any).setCheckedKeys([data.id]);
    // treeRef.value.setCheckedKeys([data.id]);
    // }
    //显示部门对应的角色
    //获取当前行的菜单权限并显示
    //先清空选中数据
    tableRef.value!.clearSelection();
    const response = await DepartmentServiceImpl.listRoleIdByDepartmentId(
      data.id
    );
    const selectRoleIds = response.data.obj;
    if (selectRoleIds && selectRoleIds.length > 0) {
      tableData.value?.forEach((row) => {
        selectRoleIds.forEach((selectRoleId) => {
          if (row.id == selectRoleId) {
            tableRef.value!.toggleRowSelection(row, true);
          }
        });
      });
    }
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
const handleNodeClick = async (data, node) => {
  // const response = await RoleService.listMenuIdByRoleId(currentRow.id);
  // const selectMenuIds = response.data.obj;
  // if (
  //   selectMenuIds &&
  //   selectMenuIds instanceof Array &&
  //   selectMenuIds.length > 0
  // ) {
  //   // treeRef.value!.setCheckedKeys(selectMenuIds, false);
  //   selectMenuIds.forEach((key) => {
  //     treeRef.value!.setChecked(key, true, false);
  //   });
  // }

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
const handleTableSelectChange = (selection) => {
  console.log(selection, selection.id);
};
const saveDepartmentRole = () => {
  const selectedKey = (treeRef.value as any).getCheckedKeys()[0];
  let departmentRoles: IDepartmentRoles = {
    departmentId: selectedKey!,
    roleIds: [],
  };
  const selectRows = tableRef.value!.getSelectionRows();
  if (selectRows instanceof Array && selectRows.length > 0) {
    selectRows.forEach((item) => {
      departmentRoles.roleIds.push(item.id);
      console.log(item, item.id);
    });
  }
  departmentRoleLoadingFlag.value = true;
  DepartmentServiceImpl.saveDepartmentRole(departmentRoles)
    .then((response) => {
      successAlert(response.data.message);
    })
    .finally(() => {
      departmentRoleLoadingFlag.value = false;
    });
};
</script>

<style lang="scss">
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
