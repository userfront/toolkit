export function factorToLogoAndText(factor: Factor): FactorDisplayInfo;
export default IconButton;
export type Factor = {
  channel: string;
  strategy: string;
};
export type FactorDisplayInfo = {
  icon: React.Component;
  text: string;
};
/**
 * A button with an icon for the given Userfront factor.
 * Text is chosen based on the factor.
 *
 * @param {object} props
 * @param {object} props.factor - a Userfront factor { strategy, channel }
 * @returns
 */
declare function IconButton({
  factor,
  children,
  ...props
}: {
  factor: object;
}): JSX.Element;
