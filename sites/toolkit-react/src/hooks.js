import { useEffect } from "react";
import Userfront, {
  _devTools,
} from "../../../packages/toolkit-react/src/index.js";
import mockUserfront from "./mockUserfront";

export function useMockUserfront() {
  useEffect(() => {
    _devTools.overrideUserfrontSingleton(mockUserfront);
    return () => {
      _devTools.overrideUserfrontSingleton(Userfront);
    };
  }, []);
}
