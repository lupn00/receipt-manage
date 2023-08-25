/**
 * 1级标题-直接可点击的左侧菜单。
 * 
 * 分组标题-将几个菜单项分为一组的标识
 * 2级标题-分组标题下面的菜单
 * 3级子节点-可点击的最终节点
 * 
 * 1级标题节点: pages:[heading,route,bootstrapIcon]
 * 分组节点：heading,pages
 *  2级标题节点 分组节点的pages数组内部{sectionTitle，route，bootstrapIcon，sub}
 *    3级最终叶子节点2级标题的sub节点内部，包含{heading,route}
 * 
 * 特殊的2级直接可点击节点{heading,route,bootstrapIcon}
 */
export interface MenuItem {
  heading?: string; // 1级标题、分组标题、2级标题
  sectionTitle?: string; //2级标题sub标签下
  route?: string; //路由地址
  pages?: Array<MenuItem>; // 菜单分组 
  keenthemesIcon?: string; // icon
  bootstrapIcon?: string; // icon
  sub?: Array<MenuItem>;  // 二级以下菜单
}

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "首页",
        route: "/dashboard",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "报销管理",
    route: "/request",
    pages: [
      {
        sectionTitle: "报销申请",
        route: "/my-request",
        bootstrapIcon: "bi-pip-fill",
        sub: [
          {
            heading: "申请报销",
            // route: "/project/receipt/apply",
            route: "/request/my-request/apply",
          },
          {
            heading: "未提交",
            // route: "/project/receipt/my-receipts/new",
            route: "/request/my-request/new",
          },
          {
            heading: "审批中",
            // route: "/project/receipt/my-receipts/review",
            route: "/request/my-request/review",
          },
          {
            heading: "已驳回",
            // route: "/project/receipt/my-receipts/reject",
            route: "/request/my-request/reject",
          },
          {
            heading: "审批通过",
            // route: "/project/receipt/my-receipts/review-pass",
            route: "/request/my-request/review-pass",
          },
          {
            heading: "已完成",
            // route: "/project/receipt/my-receipts/finish",
            route: "/request/my-request/finish",
          },
        ],
      },
      {
        sectionTitle: "发票列表",
        route: "/receipt-list",
        keenthemesIcon: "element-7",
        bootstrapIcon: "bi-database",
        sub: [
          {
            heading: "发票查询",
            route: "/receipt-list/query",
          },
        ]
      },
      {
        sectionTitle: "报销审核",
        route: "/widgets",
        keenthemesIcon: "element-7",
        bootstrapIcon: "bi-receipt",
        sub: [
          {
            heading: "待审核",
            route: "/crafted/widgets/lists",
          },
          {
            heading: "已审核",
            route: "/crafted/widgets/statistics",
          },
          {
            heading: "已报销",
            route: "/crafted/widgets/charts",
          },
        ],
      },
    ],
  },
  {
    heading: "系统管理",
    route: "/system",
    pages: [
      {
        sectionTitle: "部门管理",
        route: "/department",
        bootstrapIcon: "bi-diagram-3",
        sub: [
          {
            heading: "部门列表",
            // route: "/system/department-list",
            route: "/system/department/department-list",
          }
        ]
      },
      {
        sectionTitle: "员工管理",
        route: "/employee",
        bootstrapIcon: "bi-person",
        sub: [
          {
            heading: "员工列表",
            // route: "/system/employee-list",
            route: "/system/employee/employee-list",
          }
        ]
      },
      {
        sectionTitle: "系统设置",
        route: "/setting",
        bootstrapIcon: "bi-gear",
        sub: [
          {
            heading: "角色管理",
            // route: "/system/setting-role",
            route: "/system/setting/setting-role",
          }
        ]
      }
    ]
  },
  {
    heading: "测试",
    pages: [
      {
        sectionTitle: "功能测试",
        route: "/test",
        bootstrapIcon: "bi-diagram-3",
        sub: [
          {
            heading: "选择树测试",
            route: "/test/select-tree",
          }
        ]
      },
    ]
  }

];

export default MainMenuConfig;
