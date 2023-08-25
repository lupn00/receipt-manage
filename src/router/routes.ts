import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home/common-employee",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: "/home/common-employee",
        name: "home-common-employee",
        component: () => import("@/views/project/home/EmployeeHome.vue"),
        meta: {},
      },
      {
        path: "/home/all-info",
        name: "home-all-info",
        component: () => import("@/views/project/home/ALLInfoHome.vue"),
        meta: {
          pageTitle: "首页",
          breadcrumbs: ["首页"],
        },
      },
      {
        path: "/request/my-request/apply/:id(\\d+)?",
        name: "receipt-apply",
        component: () => import("@/views/project/receipt/Apply.vue"),
        meta: {
          pageTitle: "报销申请",
          breadcrumbs: ["报销管理", "报销申请"],
        },
      },
      {
        // path: "/project/receipt/view/:id(\\d+)",
        path: "/request/my-request/view/:id(\\d+)",
        name: "employee-receipt-view",
        component: () =>
          import("@/views/project/receipt/EmployeeReceiptView.vue"),
        meta: {
          pageTitle: "查看申请单",
          breadcrumbs: ["报销管理", "报销申请"],
        },
      },
      {
        path: "/request/my-request/new",
        name: "receipt-new",
        component: () =>
          import("@/views/project/receipt/EmployeeReceiptList.vue"),
        meta: {
          pageTitle: "未提交报销单",
          breadcrumbs: ["报销管理", "未提交"],
        },
      },
      {
        path: "/request/my-request/review",
        name: "receipt-review",
        component: () =>
          import("@/views/project/receipt/EmployeeReceiptList.vue"),
        meta: {
          pageTitle: "财务审核中",
          breadcrumbs: ["报销管理", "审核中"],
        },
      },
      {
        path: "/request/my-request/reject",
        name: "receipt-reject",
        component: () =>
          import("@/views/project/receipt/EmployeeReceiptList.vue"),
        meta: {
          pageTitle: "财务退回",
          breadcrumbs: ["报销管理", "财务退回"],
        },
      },
      {
        path: "/request/my-request/review-pass",
        name: "receipt-review-pass",
        component: () =>
          import("@/views/project/receipt/EmployeeReceiptList.vue"),
        meta: {
          pageTitle: "审批通过",
          breadcrumbs: ["报销管理", "审批通过"],
        },
      },
      {
        path: "/request/my-request/finish",
        name: "receipt-finish",
        component: () =>
          import("@/views/project/receipt/EmployeeReceiptList.vue"),
        meta: {
          pageTitle: "已完成",
          breadcrumbs: ["报销管理", "已完成"],
        },
      },
      {
        path: "/finance/wait-verify",
        name: "finance-wait-verify",
        component: () =>
          import("@/views/project/receipt/finance/FinanceReceiptList.vue"),
        meta: {
          pageTitle: "待审批",
          breadcrumbs: ["报销审批", "待审批"],
        },
      },
      {
        path: "/finance/rejected",
        name: "finance-rejected",
        component: () =>
          import("@/views/project/receipt/finance/FinanceReceiptList.vue"),
        meta: {
          pageTitle: "已驳回",
          breadcrumbs: ["报销审批", "已驳回"],
        },
      },
      {
        path: "/finance/passed",
        name: "finance-passed",
        component: () =>
          import("@/views/project/receipt/finance/FinanceReceiptList.vue"),
        meta: {
          pageTitle: "审批通过",
          breadcrumbs: ["报销审批", "审批通过"],
        },
      },
      {
        path: "/finance/finish",
        name: "finance-finish",
        component: () =>
          import("@/views/project/receipt/finance/FinanceReceiptList.vue"),
        meta: {
          pageTitle: "已报销",
          breadcrumbs: ["报销审批", "已报销"],
        },
      },
      {
        // path: "/project/receipt/view/:id(\\d+)",
        path: "/finance/receipt/view/:id(\\d+)",
        name: "finance-receipt-view",
        component: () =>
          import("@/views/project/receipt/finance/FinanceReceiptView.vue"),
        meta: {
          pageTitle: "查看申请单",
          breadcrumbs: ["报销管理", "报销审批"],
        },
      },
      {
        path: "/receipt-list/query",
        name: "receipt-finish-query",
        component: () => import("@/views/project/receipt/Query.vue"),
        meta: {
          pageTitle: "发票查询",
          breadcrumbs: ["报销管理", "发票列表"],
        },
      },
      {
        path: "/system/department/department-list",
        name: "system-department-list",
        component: () => import("@/views/system/DepartmentTree.vue"),
        meta: {
          pageTitle: "部门管理",
          breadcrumbs: ["系统管理", "部门管理"],
        },
      },
      {
        path: "/system/employee/employee-list",
        name: "system-employee-list",
        component: () => import("@/views/system/EmployeeList.vue"),
        meta: {
          pageTitle: "员工管理",
          breadcrumbs: ["系统管理", "员工管理"],
        },
      },
      {
        path: "/system/setting/setting-role",
        name: "system-setting-role",
        component: () => import("@/views/system/RoleList.vue"),
        meta: {
          pageTitle: "角色管理",
          breadcrumbs: ["系统管理", "系统设置"],
        },
      },
      {
        path: "/system/setting/test",
        name: "system-setting-test",
        component: () => import("@/views/project/receipt/Test.vue"),
        meta: {
          pageTitle: "选择树测试",
          breadcrumbs: ["系统管理", "测试"],
        },
      },
      {
        path: "/self-setting/self/info",
        name: "self-setting-self-info",
        component: () => import("@/views/project/self/SelfInfo.vue"),
        meta: {
          pageTitle: "个人信息",
          breadcrumbs: ["系统管理", "个人信息"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

export default routes;
