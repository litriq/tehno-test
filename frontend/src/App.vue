<script setup lang="ts">
import tContainer from "./shared/ui/layouts/t-container";
import tLogout from "./shared/ui/icons/t-logout.vue";
import tDoc from "./shared/ui/icons/t-doc.vue";
import tColor from "./shared/ui/icons/t-color.vue";
import tFullLogo from "./shared/ui/icons/t-full-logo.vue";
import tSnackbar from "./shared/snackbar";

import { exportDocx } from "./features/export-docx";
import { ROLES } from "@/shared/constants/roles";
import { useUser } from "@/entities/user";
import { useRouter } from "vue-router";
import { themes, themeNames } from "./themes";
import { onMounted, ref, watch, computed } from "vue";
import { useSnackbar } from "./shared/snackbar";

const snackbar = useSnackbar();
const router = useRouter();
const theme = ref(themeNames.LIGHT);
const { user, reset } = useUser();
const isDocVisible = computed(() => user.value?.roles.includes(ROLES.ADMIN));

const onSignOut = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  reset();

  router.push({
    name: "login"
  });
};

const onExportDocx = async () => {
  try {
    const { data } = await exportDocx();

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Отчет_за_${new Date().toLocaleDateString()}.docx`
    ); // указываем имя файла для скачивания
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);

    snackbar.show({
      type: "success",
      message: "Отчет сформирован успешно!",
      timeout: 2000
    });
  } catch {
    snackbar.show({
      type: "danger",
      message: "Ошибка формирования отчета! Повторите попытку позже.",
      timeout: 2000
    });
  }
};

const toggleTheme = () => {
  if (theme.value == themeNames.LIGHT) {
    theme.value = themeNames.DARK;
  } else {
    theme.value = themeNames.LIGHT;
  }

  snackbar.show({
    type: "success",
    message: "Тема изменена успешно!",
    timeout: 2000
  });
};

const setTheme = (value: string) => {
  Object.entries(themes[value]).forEach(([key, value]) => {
    document.body.style.setProperty(key, value);
  });
};

watch(theme, value => setTheme(value));

onMounted(() => {
  setTheme(theme.value);
});
</script>

<template>
  <div class="nav">
    <t-container class="nav-container">
      <div class="wrap">
        <button v-if="user" class="btn" @click="onSignOut">
          <t-logout />
        </button>
        <button v-if="user && isDocVisible" class="btn" @click="onExportDocx">
          <t-doc />
        </button>
        <button class="btn" @click="toggleTheme">
          <t-color />
        </button>
      </div>

      <div>
        <t-full-logo />
      </div>
    </t-container>
  </div>

  <t-container>
    <router-view></router-view>
  </t-container>

  <t-snackbar />
</template>

<style lang="scss" scoped>
.logo {
  color: var(--t-primary);
}

.nav {
  padding: 1rem 0;
  background-color: var(--t-surface);
  box-shadow: 0px 6px 33px -3px rgba(75, 75, 75, 0.096);
  .nav-container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
  }

  .wrap {
    display: flex;
    gap: 0 0.5rem;
    .btn {
      border-radius: 8px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #00000000;
      transition: all 0.3s ease;
      outline: 1px solid color-mix(in srgb, var(--t-secondary) 10%, transparent);
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--t-secondary) 10%,
          transparent
        );
      }
    }
  }
}
</style>
