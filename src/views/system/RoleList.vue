<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Sidebar-->
    <div class="flex-column flex-lg-row-auto w-50 mb-10 mb-lg-0">
      <!--begin::Contacts-->
      <div class="card card-flush">
        <!--begin::Card header-->
        <div class="card-header pt-7" id="kt_chat_contacts_header">
          <el-input v-model="filterText" placeholder="菜单名称" />
        </div>
        <!--end::Card header-->

        <!--begin::Card body-->
        <div class="card-body pt-5" id="kt_chat_contacts_body">
          <el-tree
            ref="treeRef"
            node-key="id"
            class="filter-tree"
            :data="menuTree"
            :props="defaultProps"
            show-checkbox
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="handleTreeNodeClick"
          />
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Contacts-->
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
              <el-row>
                <el-button type="primary" @click="showAddRoleModel" :icon="Plus"
                  >添加</el-button
                >
                <el-button type="info" @click="editRole" :icon="Edit"
                  >修改</el-button
                >
                <el-button type="danger" @click="deleteRole" :icon="Delete"
                  >删除</el-button
                >
                <el-button
                  type="success"
                  @click="saveRoleMenus"
                  :loading="roleMenusLoadingFlag"
                  >保存角色对应权限</el-button
                >
                <!-- <el-button
                  type="danger"
                  @click="showAddEmployeeModel"
                  :icon="Delete"
                  >删除</el-button
                > -->
                <!-- <el-icon><Plus /></el-icon> -->
                <!-- <el-button
                  type="warning"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_add_department"
                  data-bs-editMode="true"
                  >编辑</el-button
                >
                <el-button type="danger" @click="deleteNode">删除</el-button> -->
              </el-row>
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

        <!--begin::Card body @current-change="handleTableCurrentChange" -->
        <div class="card-body" id="kt_chat_messenger_body">
          <el-table
            ref="tableRef"
            :data="tableData"
            stripe
            border
            highlight-current-row
            @current-change="handleTableCurrentChange"
            style="width: 100%"
          >
            <el-table-column prop="name" label="名称" width="150" />
            <el-table-column
              prop="status"
              label="状态"
              align="center"
              width="100"
            />
            <el-table-column
              prop="dtCreate"
              :formatter="formatDateTimeEP"
              label="创建时间"
              width="180"
            />
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
  <!--end::Layout-->

  <!-- <AddEmployeeModal
    v-if="addEmployeeModelIsShow"
    ref="addEmployeeModalPRef"
    :selected-employee="selectedEmployee"
    @clear-selected-employee="handleClearSelectedEmployee"
    @refresh-data="handleRefreshData"
  ></AddEmployeeModal> -->

  <KeepAlive>
    <AddRoleModal
      v-if="addRoleModelIsShow"
      :edit-role="editRoleItem"
      @close-role-add-dialog="handleCloseRoleAddDialog"
      @refresh-data="handleRefreshData"
    ></AddRoleModal>
  </KeepAlive>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { ElTree, ElTable } from "element-plus";
import MenuService from "@/core/services/system/MenuService";
import RoleService from "@/core/services/system/RoleService";
import type { IRole, IRoleMenus } from "@/core/services/system/RoleService";
import AddRoleModal from "@/views/system/AddRoleModal.vue";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import {
  confirmAlert,
  errorAlert,
  successAlert,
} from "@/core/utils/MessageUtils";
import { formatDateTimeEP } from "@/core/utils/ElementPlusFormatter";
// import {
//   type IGroupReceiptLog,
//   GroupReceiptLogServiceImpl,
// } from "@/core/services/project/GroupReceiptLogService";

const treeRef = ref<InstanceType<typeof ElTree>>();
const selectedRole = ref<IRole>();
const editRoleItem = ref<IRole | undefined>();
const addRoleModelIsShow = ref<boolean>(false);
const menuTree = ref([]);
const checkedId = ref();
const currentSelectedNode = ref(null);
const clickNum = ref<number>(0);
const roleMenusLoadingFlag = ref(false);

const tableRef = ref<InstanceType<typeof ElTable>>();

const tableData = ref<IRole[]>();

const getMenuTreeData = async () => {
  const response = await MenuService.listInUse();
  console.log("result", response.data.obj);
  menuTree.value = response.data.obj;
  await nextTick();
  console.log("Now DOM is updated");
};

const listRole = async () => {
  const response = await RoleService.listAll();
  tableData.value = response.data.obj;
};

getMenuTreeData();
listRole();

const handleTableCurrentChange = async (currentRow) => {
  selectedRole.value = currentRow;
  console.log("currentRow:", currentRow);

  //获取当前行的菜单权限并显示
  //先清空选中数据
  treeRef.value!.setCheckedKeys([], false);
  if (currentRow) {
    const response = await RoleService.listMenuIdByRoleId(currentRow.id);
    const selectMenuIds = response.data.obj;
    if (
      selectMenuIds &&
      selectMenuIds instanceof Array &&
      selectMenuIds.length > 0
    ) {
      // treeRef.value!.setCheckedKeys(selectMenuIds, false);
      selectMenuIds.forEach((key) => {
        treeRef.value!.setChecked(key, true, false);
      });
    }
  }
};

const handleTreeNodeClick = (data, node) => {
  // console.log("handleNodeClick", data.label, data.id);
  // if (data.id === 1) {
  //   delete qc.value.departmentId;
  // } else {
  //   qc.value.departmentId = data.id;
  // }
};
// const clickRow = (row, column, event) => {
//   selectedEmployee.value = row;
// };
// watch(
//   () => pager.value.list,
//   (newVal, oldVal) => {
//     console.log("selectedEmployee-newVal", newVal);
//     console.log("selectedEmployee-oldVal", oldVal);
//   },
//   { deep: true }
// );
//begin::添加修改员工
const showAddRoleModel = () => {
  editRoleItem.value = undefined;
  addRoleModelIsShow.value = true;
};
const editRole = () => {
  if (!selectedRole.value) {
    errorAlert("请先选择要编辑的行！");
    return;
  }
  editRoleItem.value = selectedRole.value;
  addRoleModelIsShow.value = true;
};

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}

const filterText = ref("");

const defaultProps = {
  children: "children",
  label: "label",
};

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};

const handleCloseRoleAddDialog = () => {
  addRoleModelIsShow.value = false;
  editRoleItem.value = undefined;
};

const handleRefreshData = () => {
  listRole();
};

const saveRoleMenus = () => {
  if (!selectedRole.value) {
    errorAlert("请先选择要选中相应的角色！");
    return;
  }
  console.log(treeRef.value!.getCheckedNodes(false, true));
  const selectTreeNodes = treeRef.value!.getCheckedNodes(false, true);
  let roleMenus: IRoleMenus = {
    roleId: selectedRole.value.id!,
    menuIds: [],
  };
  selectTreeNodes.forEach((item) => {
    roleMenus.menuIds.push(item.id);
  });
  console.log(roleMenus);
  roleMenusLoadingFlag.value = true;
  RoleService.saveRoleMenu(roleMenus)
    .then((response) => {
      successAlert(response.data.message);
      // setTimeout(() => {
      // roleMenusLoadingFlag.value = false;
      // }, 500);
    })
    .finally(() => {
      roleMenusLoadingFlag.value = false;
    });
  // roleMenus.roleId = selectedRole.value.id!;
};

const deleteRole = async () => {
  if (!selectedRole.value) {
    errorAlert("请先选择要删除的角色！");
    return;
  }
  const confirmResult = await confirmAlert(
    `确认要删除 ${selectedRole.value.name} 吗？`
  );
  if (confirmResult.isConfirmed) {
    const response = await RoleService.delete(selectedRole.value.id!);
    handleRefreshData();
    successAlert(response.data.message);
  }
};
</script>
