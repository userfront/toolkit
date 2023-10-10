export default TestModeNotice;
/**
 * A small banner, visible if in test mode, showing the reason why we're in test mode.
 * Hidden if not in test mode.
 *
 * @param {object} props
 * @param {string} mode - the mode, "test" or "live"
 */
declare function TestModeNotice({ mode }: object): import("react").JSX.Element;
