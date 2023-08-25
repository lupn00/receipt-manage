import MenuService from "@/core/services/system/MenuService";
import JwtService from "@/core/services/JwtService";
import type { IMenuItem } from "@/core/services/SystemType";
let userMenus: IMenuItem[] | null;


const getUserMenu = async () =>{
  if (!JwtService.getUserMenu()) {
    const response = await MenuService.currentMenu();
    userMenus = JSON.parse(response.data.obj);
    JwtService.saveUserMenu(response.data.obj);
  } else {
    userMenus = JSON.parse(JwtService.getUserMenu()!);
  }
  return userMenus;
}

export default getUserMenu;
