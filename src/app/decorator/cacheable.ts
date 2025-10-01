/**
 * Cache the value of the decorated function in a dictionary with the param at the given index as key
 * - The decorated function must return a promise (otherwise the function will throw an error
 * @param keyIndex specify the index of the function parameter that will be used as key in the cache dictionary
 * @example
 * @cacheable(1)
 * function getNumberOfResource(showLeftResource, buildingId) {...}
 *
 * in this exemple, the cacheable will index the number of resource by building id as the index is 1.
 */
export function cacheable(keyIndex: number = 0) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const cache = {};
    const originalMethods = descriptor.value;
    descriptor.value = function(...args: any[]) {
      if(args && args[keyIndex] && cache[args[keyIndex]]) {
        return Promise.resolve(cache[args[keyIndex]]);
      }
      const res: Promise<boolean> = originalMethods.apply(this, args);
      if (!(res instanceof Promise)) {
        throw new Error(`Function ${propertyKey} must return a Promise`);
      }
      return res.then(res => {
        cache[args[keyIndex]] = res;
        return res;
      });
    };
    return descriptor;
  }
}
