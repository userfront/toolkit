import callUserfront, { READ } from "../services/userfront";
import { useState, useEffect } from "react";

const TestModeNotice = () => {
  const [isTestMode, setIsTestMode] = useState(false);
  const [testModeReason, setTestModeReason] = useState("");

  useEffect(() => {
    const perform = async () => {
      const result = await callUserfront({
        method: READ,
        args: { key: "mode" },
      });
      if (result?.mode?.value === "test") {
        setIsTestMode(true);
        setTestModeReason(mode.reason);
      }
    };
    perform();
  }, []);
  if (!isTestMode) {
    return null;
  }
  return (
    <div className="uf-toolkit-test-mode-notice">
      <span className="uf-toolkit-test-mode-text">
        Test Mode: {testModeReason}
      </span>
    </div>
  );
};

export default TestModeNotice;
