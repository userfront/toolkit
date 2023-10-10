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
    namespace shouldConfirmPassword {
      const name_2: string;
      export { name_2 as name };
      export namespace type_1 {
        const name_3: string;
        export { name_3 as name };
        const required_1: boolean;
        export { required_1 as required };
      }
      export { type_1 as type };
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
