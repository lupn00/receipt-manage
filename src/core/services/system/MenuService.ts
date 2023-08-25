import ApiService from "@/core/services/ApiService";
import RestfulService from "@/core/services/RestfulService";

class MenuService extends RestfulService{
  constructor() {
    super("/menu");
  }
  currentMenu() {
    return ApiService.get(this.moduleUrl, "current");
  }
  listInUse() {
    return ApiService.get(this.moduleUrl, "in-use");
  }
}

const MenuServiceImpl = new MenuService();

export default MenuServiceImpl;
