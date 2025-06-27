declare module 'topojson-client' {
  export function feature(
    topology: any,
    object: any
  ): { type: string; features: any[] };

  export function mesh(
    topology: any,
    object: any,
    filter?: (a: any, b: any) => boolean
  ): any;
}