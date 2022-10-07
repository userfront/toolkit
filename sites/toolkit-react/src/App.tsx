import {
  SignupForm,
  createSignupFormModel,
  defaultSignupFormContext,
} from "toolkit-react";
import "./App.css";
import "toolkit-react/style.css";
import { useMachine } from "@xstate/react";

const signupFormModel = createSignupFormModel(defaultSignupFormContext);

function App() {
  const [state, send, service] = useMachine(signupFormModel);
  console.log("state", JSON.parse(JSON.stringify(state)));

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
