import {
  SignupForm,
  createSignupFormModel,
  defaultSignupFormContext,
} from "toolkit-react";
import "./App.css";
import "toolkit-react/style.css";
import { useMachine } from "@xstate/react";

const signupFormModel = createSignupFormModel(defaultSignupFormContext);

const childIdForStep = (stepName?: string) => {
  switch (stepName) {
    case "smsCodeSecondFactor":
      return "smsCode";
    case null:
    case undefined:
      return null;
    default:
      return stepName;
  }
};

function App() {
  const [state, send, service] = useMachine(signupFormModel);
  console.log("state", state);
  console.log("service", service);

  const handleEvent = (event: any) => {
    console.log("event", event);
    send(event);
  };

  return (
    <div className="App">
      <SignupForm state={state} onEvent={handleEvent} />
    </div>
  );
}

export default App;
