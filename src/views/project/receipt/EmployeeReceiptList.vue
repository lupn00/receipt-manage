<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <!-- <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            type="text"
            v-model="search"
            @input="searchItems()"
            class="form-control form-control-solid w-250px ps-15"
            placeholder="Search Customers"
          />
        </div> -->
        <!--end::Search-->
      </div>
      <!--begin::Card title-->
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->

        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <!-- <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewCustomers()"
          >
            Delete Selected
          </button>
        </div> -->
        <!--end::Group actions-->
        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-customer-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-customer-table-select="delete_selected"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <div class="card-body pt-0">
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <!-- <el-table-column label="Date" width="120">
          <template #default="scope">{{ scope.row.date }}</template>
        </el-table-column> -->
        <el-table-column property="name" label="报销单名称" />
        <el-table-column
          property="dtCreate"
          label="创建日期"
          width="150"
          :formatter="formatDateEP"
        />
        <el-table-column property="numReceipt" label="发票数量" width="130" />
        <el-table-column property="remark" label="备注" />
        <!-- <el-table-column
          property="status"
          label="状态"
          align="center"
          width="150"
          :formatter="receiptStatus2StrEP"
        /> -->
        <!-- <el-table-column prop="status" align="center" label="状态" width="150">
          <template #default="scope">
            <el-tag
              disable-transitions
              :type="receiptStatus2Tag(scope.row.status)"
              effect="dark"
              >{{ receiptStatus2Str(scope.row.status) }}</el-tag
            >
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          property="financeEmployeeName"
          label="审核人"
          width="130"
        /> -->
        <el-table-column
          property="bdTotal"
          label="总金额"
          :formatter="formatMoneyEP"
          align="right"
          width="130"
        />
        <el-table-column align="center" width="180">
          <template #default="scope">
            <!-- <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)"
                    >Edit</el-button /project/receipt/view
                  > -->
            <el-button
              v-show="status === 1"
              size="small"
              type="info"
              :icon="Edit"
              @click="editGroupReceipt(scope.$index, scope.row)"
            />
            <el-button
              v-show="status != 1"
              size="small"
              type="warning"
              :icon="View"
              @click="viewGroupReceipt(scope.$index, scope.row)"
            />

            <el-button
              v-show="status === 1"
              size="small"
              type="danger"
              :icon="Delete"
              @click="handleGroupReceiptDelete(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="pager">
        <el-pagination
          small
          background
          layout="prev, pager, next"
          :page-size="pager.limit"
          :total="parseInt(pager.total)"
          @current-change="handleTableCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { type IGroupReceipt } from "@/core/services/project/ReceiptCommon";

import { GroupReceiptSelfServiceImpl as GroupReceiptSelfService } from "@/core/services/project/ReceiptSelfService";

import type { IQueryCondition } from "@/core/services/SystemType";
import { formatDateEP, formatMoneyEP } from "@/core/utils/ElementPlusFormatter";
import { Delete, Edit, View } from "@element-plus/icons-vue";
import { confirmAlert } from "@/core/utils/MessageUtils";
import { useRouter } from "vue-router";
const router = useRouter();

const status = ref(1);

// onBeforeRouteLeave((to, from, next) => {
//   console.log("我是onBeforeRouteLeave，可以在此获取数据", status);
//   next();
// });

console.log("router.currentRoute.value.path", router.currentRoute.value.path);

const tableData = ref<IGroupReceipt[]>([]);
const queryCondition: IQueryCondition = {
  status: status.value,
  page: 1,
};
const pager = ref({});
// onMounted(async () => {
// queryTableData(queryCondition);
// const response = await GroupReceiptServiceImpl.pageQuery(queryCondition);
// const { limit, total } = response.data.obj;
// pager.value = { limit, total };
// tableData.value = response.data.obj.list;
// });

watch(
  () => router.currentRoute.value.path,
  (newVal) => {
    const statusStr = newVal.substring(newVal.lastIndexOf("/") + 1);
    switch (statusStr) {
      case "new":
        //可以修改和删除
        status.value = 1;
        break;
      case "review":
        //查询审批中报销单，不可修改，不可删除
        nextTick(() => {
          queryTableFromProcess();
        });
        status.value = 2;
        break;
      case "reject":
        //只可修改审核不通过的报销单内容，不可删除，不可新增报销单
        status.value = 3;
        break;
      case "review-pass":
        //不可修改，不可删除
        status.value = 4;
        break;
      case "finish":
        //不可修改，不可删除
        status.value = 9;
        break;
    }
    // nextTick(() => {
    //   queryCondition.status = status.value;
    //   queryTableData(queryCondition);
    // });
  },
  { immediate: true }
);

const queryTableFromProcess = async () => {
  const response = await GroupReceiptSelfService.listMyStartInProcess();
  tableData.value = response.data.obj;
  // const { limit, total } = response.data.obj;
  // pager.value = { limit, total };
  // tableData.value = response.data.obj.list;
};
const queryTableData = async (qc: IQueryCondition) => {
  const response = await GroupReceiptSelfService.pageQuery(qc);
  const { limit, total } = response.data.obj;
  pager.value = { limit, total };
  tableData.value = response.data.obj.list;
};

const editGroupReceipt = (index, row) => {
  router.push({ name: "receipt-apply", params: { id: `${row.id}` } });
};
const viewGroupReceipt = (index, row) => {
  router.push({ name: "employee-receipt-view", params: { id: `${row.id}` } });
};
const handleGroupReceiptDelete = async (index, row) => {
  const confirmResult = await confirmAlert(`确定要删除记录吗？`);
  if (confirmResult.isConfirmed) {
    const response = await GroupReceiptSelfService.delete(row.id);
    console.log(response);
  }
};
const handleTableCurrentChange = (page: number) => {
  queryCondition.page = page;
  queryTableData(queryCondition);
};
</script>

<style scoped>
.pager {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
