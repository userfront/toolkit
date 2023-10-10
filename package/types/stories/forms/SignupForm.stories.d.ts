declare namespace _default {
  export const title: string;
  export { UniversalForm as component };
  export namespace argTypes {
    namespace width {
      const name: string;
      namespace type {
        const name_1: string;
        export { name_1 as name };
        export const required: boolean;
      }
      const description: string;
      const control: string;
    }
  }
  export namespace parameters {
    const passStyle: boolean;
  }
}
export default _default;
export function Default(args: any): import("react").JSX.Element;
export namespace Default {
  namespace args {
    const width_1: number;
    export { width_1 as width };
  }
  const storyName: string;
}
import UniversalForm from "../../forms/UniversalForm";
