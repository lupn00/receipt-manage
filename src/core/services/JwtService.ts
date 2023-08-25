import type { IMenuItem } from "@/core/services/SystemType";
const ID_TOKEN_KEY = "token" as string;
const ID_MENU_KEY = "menu" as string;

/**
 * @description get token form sessionStorage
 */
export const getToken = (): string | null => {
  return window.sessionStorage.getItem(ID_TOKEN_KEY);
};

/**
 * @description save token into sessionStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  window.sessionStorage.setItem(ID_TOKEN_KEY, token);
};

/**
 * @description remove token form sessionStorage
 */
export const destroyToken = (): void => {
  window.sessionStorage.removeItem(ID_TOKEN_KEY);
};

export const saveUserMenu = (menu: string): void => {
  window.sessionStorage.setItem(ID_MENU_KEY, menu);
};

export const getUserMenu = (): string | null => {
  return window.sessionStorage.getItem(ID_MENU_KEY);
};

export const destroyUserMenu = (): void => {
  window.sessionStorage.removeItem(ID_MENU_KEY);
};

export default {
  getToken,
  saveToken,
  destroyToken,
  saveUserMenu,
  getUserMenu,
  destroyUserMenu,
};
