interface Store {
  tenantId?: string;
}
declare module "@userfront/core" {
  const store: Store;
}
declare let singleton: any;
/**
 * Override the Userfront singleton imported from @userfront/core with an object of your choice.
 *
 * @param newSingleton object to use in place of the Userfront singleton
 */
export declare const overrideUserfrontSingleton: (newSingleton: any) => void;
type Functions<Type> = {
  [Key in keyof Type]-?: Type[Key] extends Function ? Key : never;
}[keyof Type];
export interface CallUserfront {
  method: Functions<typeof singleton>;
  args: Array<Object>;
}
/**
 * Get a property by key from the Userfront singleton, wrapped in a Promise
 * so that this can be invoked as an XState service.
 * The key may be a path ("path.to.value" -> Userfront.path.to.value)
 * The target singleton can be changed with overrideUserfrontSingleton.
 *
 * @param key key of the property to get from Userfront
 * @returns value of Userfront[key]
 */
export declare const getUserfrontProperty: (key: string) => Promise<any>;
/**
 * Get a property by key from the Userfront singleton without wrapping in a Promise.
 * The key may be a path ("path.to.value" -> Userfront.path.to.value)
 * The target singleton can be changed with overrideUserfrontSingleton.
 *
 * @param key key to retrieve
 * @returns value of Userfront[key]
 */
export declare const getUserfrontPropertySync: (key: string) => any;
/**
 * Call a method on the Userfront singleton, ensuring that a Promise is returned so that this can be
 * invoked as a service in XState models.
 * The target singleton can be changed with overrideUserfrontSingleton.
 *
 * @param {object} config
 * @param {string} config.method method name to call; may be a path ("path.to.method" -> Userfront.path.to.method())
 * @param {Array} config.args arguments to pass to the method
 * @returns {Promise} result of the call, wrapped in a Promise even if the method is sync
 */
export declare const callUserfront: ({
  method,
  args,
}: CallUserfront) => Promise<any>;
/**
 * Call a method on the Userfront singleton, immediately returning the result (which may be a Promise).
 * The target singleton can be changed with overrideUserfrontSingleton.
 * @param {object} config
 * @param {string} config.method method name to call; may be a path ("path.to.method" -> Userfront.path.to.method())
 * @param {Array} config.args arguments to pass to the method
 * @returns result of the call, which may be a Promise if the method is async
 */
export declare const callUserfrontSync: ({
  method,
  args,
}: CallUserfront) => any;
export {};
