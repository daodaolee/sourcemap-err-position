/// <reference types="vite/client" />

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare global {
  interface window {
      sourceMap: any;
  }
}