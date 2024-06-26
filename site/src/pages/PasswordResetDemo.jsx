import { _devTools } from "@userfront/toolkit";
import { Link } from "react-router-dom";
import { useMachine } from "@xstate/react";
import Urlon from "urlon";
import { useState, useEffect } from "react";
import { useMockUserfront } from "../hooks.js";
import createMockUserfront from "../mockUserfront.js";

const {
  UnboundUniversalForm,
  createUniversalFormModel,
  defaultUniversalFormContext,
} = _devTools;

const config = {
  ...defaultUniversalFormContext.config,
  shouldFetchFlow: false,
  type: "reset",
};
const context = {
  ...defaultUniversalFormContext,
  config,
};

const LoginFormModel = createUniversalFormModel(context);

const mockUserfront = createMockUserfront();

mockUserfront.requireMfa = true;
mockUserfront.requireMfaSetup = true;

function App() {
  useMockUserfront(mockUserfront);
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

  const machine = LoginFormModel;
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
    mockUserfront.attachToWindow();
  }, [state]);

  const handleEvent = (event) => {
    send(event);
  };

  return (
    <div className="App">
      <div>
        <Link to="/">Home</Link>
      </div>
      <UnboundUniversalForm state={state} onEvent={handleEvent} />
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
