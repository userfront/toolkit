import { useEffect } from "react";
import Userfront from "@userfront/core";

export function useEnableGlobalUserfront() {
  useEffect(() => {
    window.Userfront = Userfront;
  }, []);
}

export function useDisableGlobalUserfront() {
  useEffect(() => {
    window.Userfront = undefined;
  });
}
