import { useEffect } from "react";
import Userfront, { _devTools } from "@userfront/toolkit";
import createMockUserfront from "./mockUserfront.js";

export function useMockUserfront(mockUserfront) {
  useEffect(() => {
    let _mockUserfront = mockUserfront;
    if (!mockUserfront) {
      console.log("Mock userfront was null!");
      return;
    }
    _devTools.overrideUserfrontSingleton(_mockUserfront);
    return () => {
      _devTools.overrideUserfrontSingleton(Userfront);
    };
  }, []);
}
