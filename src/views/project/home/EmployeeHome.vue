<template>
  <div class="d-flex flex-column flex-lg-row">
    <div class="flex-column flex-lg-row-auto w-60 calendar-div mb-10 mb-lg-0">
      <!--begin::Card-->
      <div class="card">
        <!--begin::Card header-->
        <div class="card-header">
          <h4 class="card-title fw-bold">
            欢迎，{{ user.username }}，祝你开心每一天！
          </h4>
        </div>
        <div class="card-body">
          <EmployeeCalendar></EmployeeCalendar>
        </div>
      </div>
    </div>
    <div class="flex-lg-row-fluid ms-lg-5 ms-xl-5">
      <div class="card">
        <div class="card-title p-3">
          <!-- <div class="d-flex justify-content-center flex-column me-3"> -->
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            range-separator="到"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="default"
            format="YYYY-MM-DD"
            :shortcuts="shortcuts"
          />
          <!-- </div> -->

          <!-- <el-button type="primary" @click="dateRangeChange">查询</el-button> -->
        </div>
        <div class="card-body">
          <div id="pieChart" style="height: 400px"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EmployeeCalendar from "@/views/project/home/EmployeeCalendar.vue";
import { useAuthStore } from "@/stores/auth";
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import HomeService from "@/core/services/project/HomeService";

const store = useAuthStore();
const user = ref(store.user);
const rangeDate = ref<[Date, Date]>();
const allStatusCount = ref();

type EChartsOption = echarts.EChartsOption;
var pieChartOption: EChartsOption;
var pieChart;

const shortcuts = [
  {
    text: "上周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "上个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
];

watch(rangeDate, (newVal) => {
  console.log("watch:---------", newVal);
  dateRangeChange();
});

const dateRangeChange = async () => {
  console.log("#####", rangeDate.value);
  if (!rangeDate.value || !rangeDate.value[0] || !rangeDate.value[1]) {
    return;
  }
  console.log("$$$$$", rangeDate.value[0], rangeDate.value[1]);
  const response = await HomeService.employee(
    rangeDate.value[0],
    rangeDate.value[1]
  );
  allStatusCount.value = response.data.obj;

  let dataArr: Array<any> = [];
  dataArr.push({
    value: allStatusCount.value.countNew,
    name: "未提交",
  });
  dataArr.push({
    value: allStatusCount.value.countWaitFinanceVerify,
    name: "审批中",
  });
  dataArr.push({
    value: allStatusCount.value.countFinanceReject,
    name: "驳回",
  });
  dataArr.push({
    value: allStatusCount.value.countFinancePass,
    name: "已审核",
  });
  dataArr.push({
    value: allStatusCount.value.countFinish,
    name: "已报销",
  });
  var existOption = pieChart.getOption();
  existOption.series[0].data = dataArr;
  // chart.clear()；
  pieChart.setOption(existOption);
};

//::begin统计图

pieChartOption = {
  title: {
    text: "报销单",
    subtext: "审批状态",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "申请单数量",
      type: "pie",
      radius: "50%",
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

onMounted(() => {
  var chartDom = document.getElementById("pieChart")!;
  pieChart = echarts.init(chartDom);
  pieChart.setOption(pieChartOption);
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
  rangeDate.value = [start, end];

  // dateRangeChange();
});
</script>

<style scoped>
.w-60 {
  width: 60%;
}
.calendar-div {
  min-width: 800px;
}
</style>
