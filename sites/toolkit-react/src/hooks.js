import { useEffect } from "react";
import Userfront from "../../../packages/toolkit-react/src/index.js";

export function useDisableGlobalUserfront() {
  useEffect(() => {
    const tenantId = Userfront.store.tenantId;
    Userfront.store.tenantId = undefined;
    return () => {
      Userfront.store.tenantId = tenantId;
    };
  }, []);
}
