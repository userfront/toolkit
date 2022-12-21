import { getUserfrontProperty } from "../services/userfront";
import { useState, useEffect } from "react";

const TestModeNotice = ({ mode }) => {
  const [testModeReason, setTestModeReason] = useState("");
  const isTestMode = mode === "test";
  useEffect(() => {
    const perform = async () => {
      const result = await getUserfrontProperty("mode");
      setTestModeReason(result?.reason || "");
    };
    if (isTestMode) {
      perform();
    }
  }, [isTestMode]);
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
