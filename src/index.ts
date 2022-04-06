import { notify } from "./notify";

declare const global: {
  [x: string]: unknown;
};

global.notify = notify;
