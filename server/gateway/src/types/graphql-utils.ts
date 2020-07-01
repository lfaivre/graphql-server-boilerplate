export interface ResolverMap {
  [key: string]: {
    // eslint-disable-next-line
    [key: string]: (parent: any, args: any, context: any, info: any) => any;
  };
}
