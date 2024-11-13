import { atom } from "recoil";
import { localPersistEffect } from "./atom-effects";

export interface User {
  id: string;
  fullname: string;
  email: string;
}

export const isAuthenticatedAtom = atom<boolean>({
  key: "isAuthenticatedAtom",
  default: false,
  effects_UNSTABLE: [localPersistEffect],
});

export const userDetailsAtom = atom<User>({
  key: "userDetailsAtom",
  default: {
    id: "",
    fullname: "",
    email: "",
  },
  effects_UNSTABLE: [localPersistEffect],
});
