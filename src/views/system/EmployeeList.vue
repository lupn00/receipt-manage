<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Sidebar-->
    <div
      class="flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0"
    >
      <!--begin::Contacts-->
      <div class="card card-flush">
        <!--begin::Card header-->
        <div class="card-header pt-7" id="kt_chat_contacts_header">
          <el-input v-model="filterText" placeholder="部门名称" />
        </div>
        <!--end::Card header-->

        <!--begin::Card body-->
        <div class="card-body pt-5" id="kt_chat_contacts_body">
          <el-tree
            ref="treeRef"
            class="filter-tree"
            :data="departmentTree"
            :props="defaultProps"
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
                <el-button
                  type="primary"
                  @click="showAddEmployeeModel"
                  :icon="Plus"
                  >添加</el-button
                >
                <el-button type="info" @click="editEmployee" :icon="Edit"
                  >修改</el-button
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
            :data="pager?.list"
            stripe
            border
            highlight-current-row
            @current-change="handleTableCurrentChange"
            style="width: 100%"
          >
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="phone" label="手机号" width="180" />
            <el-table-column prop="allDepartmentName" label="部门" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column
              prop="dtLastLogin"
              label="上次登录日期"
              width="180"
            />
            <el-table-column
              prop="lastLoginIp"
              label="上次登录IP"
              width="180"
            />
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
        <div class="card-footer pt-4" id="kt_chat_messenger_footer">
          <div class="pager-footer">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :page-size="pager.limit"
              :total="pager.total"
              @current-change="handleTablePageChange"
            />
          </div>
        </div>
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
    <AddEmployeeModal
      v-if="addEmployeeModelIsShow"
      :edit-employee="editEmployeeItem"
      ref="addEmployeeModalPRef"
      @close-employee-add-dialog="handleCloseEmployeeAddDialog"
      @refresh-data="handleRefreshData"
    ></AddEmployeeModal>
  </KeepAlive>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { ElTree, ElTable } from "element-plus";
import DepartmentServiceImpl from "@/core/services/system/DepartmentService";
import EmployeeService from "@/core/services/system/EmployeeService";
import type { IEmployee } from "@/core/services/system/EmployeeService";
import {
  type IQueryCondition,
  type IPager,
  Pager,
} from "@/core/services/SystemType";
import AddEmployeeModal from "@/views/system/AddEmployeeModal.vue";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import { errorAlert } from "@/core/utils/MessageUtils";
// import {
//   type IGroupReceiptLog,
//   GroupReceiptLogServiceImpl,
// } from "@/core/services/project/GroupReceiptLogService";

const selectedEmployee = ref<IEmployee>();
const editEmployeeItem = ref<IEmployee | undefined>();
const addEmployeeModelIsShow = ref<boolean>(false);
const departmentTree = ref([]);
const checkedId = ref();
const treeRef = ref<InstanceType<typeof ElTree>>();
const currentSelectedNode = ref(null);
const clickNum = ref<number>(0);

const tableRef = ref<InstanceType<typeof ElTable>>();

// setCurrentRow
const pager = ref<IPager>({
  limit: 0,
  total: 0,
  list: [],
});

const qc = ref<IQueryCondition>({
  page: 1,
});

const getDepartmentTreeData = async () => {
  const response = await DepartmentServiceImpl.list();
  console.log("result", response.data.obj);
  departmentTree.value = response.data.obj;
  await nextTick();
  console.log("Now DOM is updated");
};

const queryEmployee = async () => {
  const response = await EmployeeService.pageQuery(qc.value);
  pager.value = new Pager(
    response.data.obj.limit,
    response.data.obj.total,
    response.data.obj.list
  );
};

const handleTablePageChange = (page: number) => {
  qc.value.page = page;
  queryEmployee();
};

getDepartmentTreeData();
queryEmployee();

const handleTableCurrentChange = (currentRow) => {
  selectedEmployee.value = currentRow;
  console.log("currentRow:", currentRow);
};

const handleTreeNodeClick = (data, node) => {
  console.log("handleNodeClick", data.label, data.id);
  if (data.id === 1) {
    delete qc.value.departmentId;
  } else {
    qc.value.departmentId = data.id;
  }
  queryEmployee();
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
const showAddEmployeeModel = () => {
  editEmployeeItem.value = undefined;
  addEmployeeModelIsShow.value = true;
};
const editEmployee = () => {
  if (!selectedEmployee.value) {
    errorAlert("请先选择要编辑的行！");
    return;
  }
  editEmployeeItem.value = selectedEmployee.value;
  addEmployeeModelIsShow.value = true;
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

const handleCloseEmployeeAddDialog = () => {
  addEmployeeModelIsShow.value = false;
  editEmployeeItem.value = undefined;
};

const handleRefreshData = () => {
  queryEmployee();
};
</script>
