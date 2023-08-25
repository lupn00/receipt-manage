<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semobold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <img alt="Logo" :src="getAssetPath('media/avatars/blank.png')" />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold d-flex align-items-center fs-5">
            {{ user.username }}
            <span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2"
              >Pro</span
            >
          </div>
          <a href="#" class="fw-semobold text-muted text-hover-primary fs-7">{{
            user.phone
          }}</a>
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <!-- <div class="menu-item px-5 my-1">
      <router-link to="/pages/profile/overview" class="menu-link px-5">
        Account Settings
      </router-link>
    </div> -->
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a class="menu-link px-5" @click="changePwd($event)"> 修改密码 </a>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5"> 退出 </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
  <ChangePwdModal ref="changePwdModalPRef"></ChangePwdModal>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import ChangePwdModal from "@/views/system/ChangePwdModal.vue";
import { Modal } from "bootstrap";

export default defineComponent({
  name: "kt-user-menu",
  components: {
    ChangePwdModal,
  },
  setup() {
    let myModal;
    const changePwdModalPRef = ref<null | HTMLFormElement>(null);
    const router = useRouter();
    const i18n = useI18n();
    const store = useAuthStore();
    const user = ref(store.user);
    console.log("~~~~~~~~~~~~~~~store.user", store.user.username);

    i18n.locale.value = localStorage.getItem("lang")
      ? (localStorage.getItem("lang") as string)
      : "en";

    onMounted(() => {
      // myModal = Modal.getInstance(addEmployeeModalPRef.value); 得出来是null
      if (changePwdModalPRef.value) {
        console.log(changePwdModalPRef.value.$el);
        myModal = new Modal(changePwdModalPRef.value.$el);
      }
      if (user.value.isChangePwd == 0) {
        myModal.show();
      }

      console.log(changePwdModalPRef);
    });
    const changePwd = (event) => {
      myModal.show(event.currentTarget);
    };

    const signOut = () => {
      store.logout();
      router.push({ name: "sign-in" });
    };

    const setLang = (lang: string) => {
      localStorage.setItem("lang", lang);
      i18n.locale.value = lang;
    };

    const currentLanguage = computed(() => {
      return i18n.locale.value;
    });

    return {
      user,
      changePwdModalPRef,
      changePwd,
      signOut,
      setLang,
      currentLanguage,
      getAssetPath,
    };
  },
});
</script>
