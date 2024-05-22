// Component.vue

export const getImage = (src: string) => {
  return import.meta.env.VITE_API_PROXY_TARGET + "/api" + src;
};
