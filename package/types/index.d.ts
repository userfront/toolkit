export { default as SignupForm } from "./packaged-forms/SignupForm";
export { default as LoginForm } from "./packaged-forms/LoginForm";
export { default as PasswordResetForm } from "./packaged-forms/PasswordResetForm";
export { default as LogoutButton } from "./components/LogoutButton";
export namespace _devTools {
  export { UnboundUniversalForm };
  export { createUniversalFormModel };
  export { defaultUniversalFormContext };
  export { overrideUserfrontSingleton };
}
export default Userfront;
import * as Userfront from "@userfront/core";
import { default as UnboundUniversalForm } from "./forms/UniversalForm";
import { default as createUniversalFormModel } from "./models/forms/universal";
import { defaultAuthContext as defaultUniversalFormContext } from "./models/forms/universal";
import { overrideUserfrontSingleton } from "./services/userfront";
