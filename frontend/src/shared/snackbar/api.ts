import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";

export const useSnackbar = createGlobalState(() => {
  const isVisible = ref(false);
  const message = ref("");
  const type = ref<Type>("success");

  let tm: NodeJS.Timeout;

  const show = (options: Options) => {
    clearTimeout(tm);

    isVisible.value = true;
    message.value = options.message;
    type.value = options.type;

    tm = setTimeout(() => hide(), options.timeout);
  };

  const hide = () => {
    isVisible.value = false;
  };

  return {
    show,
    hide,
    message,
    type,
    isVisible
  };
});

interface Options {
  message: string;
  type: Type;
  timeout?: number;
}

type Type = "success" | "danger";
