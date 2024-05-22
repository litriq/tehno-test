// store.js
import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import { User } from "./model";
import { getUser } from "./api";

export const useUser = createGlobalState(() => {
  const user = ref<User | null>(null);

  const setUser = async () => {
    try {
      if (localStorage.getItem("access_token")) {
        const { data } = await getUser();

        user.value = data;
      }
    } catch {
      throw new Error("[user]: GET error");
    }
  };

  const reset = () => {
    user.value = null;
  };

  return { user, setUser, reset };
});
