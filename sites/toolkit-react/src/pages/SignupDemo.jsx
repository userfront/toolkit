import {
  SignupForm,
  createSignupFormModel,
  defaultSignupFormContext,
} from "../../../../packages/toolkit-react/src/index.js";
import { Link } from "react-router-dom";
import { useMachine } from "@xstate/react";
import Urlon from "urlon";
import { useState, useEffect } from "react";

const signupFormModel = createSignupFormModel(defaultSignupFormContext);

const childIdForStep = (stepName) => {
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
  const [hasSetInitialState, setHasSetInitialState] = useState(false);
  const [initialState, setInitialState] = useState({});
  if (!hasSetInitialState) {
    if (window.location.search) {
      try {
        const stateObj = Urlon.parse(window.location.search.slice(1));
        setInitialState(stateObj);
        console.log("created machine from state", stateObj);
      } catch (e) {
        console.log(
          "could not parse state query string",
          window.location.search.slice(1)
        );
      }
    }
    setHasSetInitialState(true);
  }

  const machineOptions = {};
  if (hasSetInitialState && Object.keys(initialState).length > 0) {
    machineOptions.state = initialState;
  }

  const machine = signupFormModel;
  const [stateJson, setStateJson] = useState({});
  const [stateUrlon, setStateUrlon] = useState("");
  const [state, send] = useMachine(machine, machineOptions);

  useEffect(() => {
    const stateObj = {
      ...state.context.config,
      user: state.context.user,
      view: state.context.view,
      isSecondFactor: state.context.isSecondFactor,
      allowBack: state.context.allowBack,
      error: state.context.error,
      state: state.value,
    };
    setStateJson(stateObj);
    const newUrlon = Urlon.stringify(JSON.parse(JSON.stringify(state)));
    setStateUrlon(newUrlon);
  }, [state]);

  console.log("state", state);

  const handleEvent = (event) => {
    console.log("event", event);
    send(event);
  };

  return (
    <div className="App">
      <div>
        <Link to="/">Home</Link>
      </div>
      <SignupForm state={state} onEvent={handleEvent} />
      <hr />
      <div>
        <h2>State JSON:</h2>
        <pre>
          <code>{JSON.stringify(stateJson, null, 2)}</code>
        </pre>
        <br />
        <br />
        <h2>State URL:</h2>
        <pre>
          <code>
            {window.location.toString().split("?")[0].concat(`?${stateUrlon}`)}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default App;
