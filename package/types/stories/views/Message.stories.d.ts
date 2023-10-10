declare namespace _default {
  export const title: string;
  export { Message as component };
  export const argTypes: any;
  export namespace parameters {
    const passStyle: boolean;
  }
}
export default _default;
export function Default(
  args: any,
  {
    style,
  }: {
    style: any;
  }
): import("react").JSX.Element;
export namespace Default {
  const args: any;
  const storyName: string;
}
import Message from "../../views/Message";
