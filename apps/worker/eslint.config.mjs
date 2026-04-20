import { config as baseConfig } from "@repo/eslint-config/base";
import tseslint from "typescript-eslint";

export default tseslint.config(...baseConfig, {
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  ignores: ["dist/**", "node_modules/**"],
});
