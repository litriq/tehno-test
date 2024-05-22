export const themeNames = {
    LIGHT: "light",
    DARK: "dark",
};

export const themes = {
    [themeNames.LIGHT]: {
        "--t-primary": "#fbb040",
        "--t-primary-h": "#ffbc58",
        "--t-secondary": "#57585a",
        "--t-tertiary": "#38393a",
        "--t-background": "#f8f8f8",
        "--t-surface": "#ffffff",
    },
    [themeNames.DARK]: {
        "--t-primary": "#bb86fc",
        "--t-primary-h": "#cba6ff",
        "--t-secondary": "#a9b1d6",
        "--t-tertiary": "#4f5b62",
        "--t-background": "#121212",
        "--t-surface": "#1f1f1f",
    },
};
