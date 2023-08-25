<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <el-form
          :inline="true"
          :model="queryCondition"
          class="demo-form-inline"
        >
          <el-form-item label="发票代码">
            <el-input
              v-model="queryCondition.codeReceipt"
              placeholder="发票代码"
            />
          </el-form-item>
          <el-form-item label="发票号码">
            <el-input
              v-model="queryCondition.noReceipt"
              placeholder="发票号码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="resetQC">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
          </el-form-item>
        </el-form>
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
        <el-table-column prop="groupName" label="申请单名称" width="180">
          <template #default="scope">
            <el-link
              type="primary"
              @click="toGroupReceipt(scope.row.groupId)"
              >{{ scope.row.groupName }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="codeReceipt" label="发票代码" width="180" />
        <el-table-column prop="noReceipt" label="发票号码" width="180" />
        <el-table-column
          prop="category"
          :formatter="receiptCategory2StrEP"
          label="发票类别"
          width="130"
        />
        <el-table-column
          prop="ddReceipt"
          :formatter="formatDateEP"
          label="开票日期"
          width="150"
        />
        <el-table-column prop="status" align="center" label="状态" width="150">
          <template #default="scope">
            <el-tag
              disable-transitions
              :type="receiptStatus2Tag(scope.row.status)"
              effect="dark"
              >{{ receiptStatus2Str(scope.row.status) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          property="financeEmployeeName"
          label="审核人"
          width="130"
        />
        <el-table-column
          prop="imgReceipt"
          label="附件"
          width="100"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="info"
              :icon="Link"
              circle
              @click.prevent="handleImgPreview(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="bdMoney"
          label="金额"
          :formatter="formatMoneyEP"
          align="right"
          width="180"
        />
        <el-table-column property="remark" label="备注" />
      </el-table>
      <!--显示图片对话框-->
      <el-dialog v-model="imgDialogVisible">
        <el-image :src="dialogImageUrl" fit="fill"></el-image>
      </el-dialog>
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
import { ref, onMounted } from "vue";
import {
  type IReceipt,
  receiptCategory2StrEP,
  receiptStatus2Str,
  receiptStatus2Tag,
} from "@/core/services/project/ReceiptCommon";
import { ReceiptFinanceServiceImpl as ReceiptFinanceService } from "@/core/services/project/ReceiptFinanceService";
import type { IQueryCondition } from "@/core/services/SystemType";
import { formatDateEP, formatMoneyEP } from "@/core/utils/ElementPlusFormatter";
import { Link } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const status = ref(1);

const toGroupReceipt = (groupId) => {
  // router.push({ name: "receipt-apply", params: { id: `${row.id}` } });
  router.push({ name: "finance-receipt-view", params: { id: groupId } });
};

const tableData = ref<IReceipt[]>([]);
const queryCondition = ref<IQueryCondition>({
  page: 1,
  codeReceipt: "",
  noReceipt: "",
});
const pager = ref({});

onMounted(() => {
  queryTableData(queryCondition.value);
});

const resetQC = () => {
  queryCondition.value = {
    page: 1,
    codeReceipt: "",
    noReceipt: "",
  };
  query();
};

const query = () => {
  queryTableData(queryCondition.value);
};

const queryTableData = async (qc: IQueryCondition) => {
  const response = await ReceiptFinanceService.pageQuery(qc);
  const { limit, total } = response.data.obj;
  pager.value = { limit, total };
  tableData.value = response.data.obj.list;
};

const handleTableCurrentChange = (page: number) => {
  queryCondition.value.page = page;
  queryTableData(queryCondition.value);
};

const dialogImageUrl = ref("");
const imgDialogVisible = ref(false);

const handleImgPreview = (row) => {
  dialogImageUrl.value = row.imgReceipt;
  imgDialogVisible.value = true;
};
</script>

<style scoped>
.pager {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
