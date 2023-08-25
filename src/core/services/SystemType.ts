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
interface IMenuItem {
  heading?: string; // 1级标题、分组标题、2级标题
  sectionTitle?: string; //2级标题sub标签下
  route?: string; //路由地址
  pages?: Array<IMenuItem>; // 菜单分组 
  keenthemesIcon?: string; // icon
  bootstrapIcon?: string; // icon
  sub?: Array<IMenuItem>;  // 二级以下菜单
}

interface IQueryCondition {
  page: number,
  pageSize?: number,
  [propName: string]: any,
}

interface IPager {
  limit: number,
  total: number,
  list: any[],
}

class Pager implements IPager {

  constructor(public limit: number, public total: number, public list: any[]) {
    this.limit = limit;
    this.total = total;
    this.list = list;
  }
}
export { type IQueryCondition, type IPager, type IMenuItem, Pager };