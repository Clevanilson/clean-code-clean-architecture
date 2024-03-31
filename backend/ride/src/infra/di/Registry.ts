export class Registry {
  private dependencies: { [name: string]: any };
  private static instance?: Registry;

  private constructor() {
    this.dependencies = {};
  }

  register(name: string, dependency: any): void {
    this.dependencies[name] = dependency;
  }

  inject(name: string): any {
    return this.dependencies[name];
  }

  static getInstance(): Registry {
    if (!Registry.instance) Registry.instance = new Registry();
    return Registry.instance as Registry;
  }
}

export function inject(dependencyKey: string) {
  return (target: any, propertyKey: string): void => {
    target[propertyKey] = new Proxy(
      {},
      {
        get: (_: any, proxyPropertyKey: string) => {
          const dependency = Registry.getInstance().inject(dependencyKey);
          return dependency[proxyPropertyKey];
        }
      }
    );
  };
}
