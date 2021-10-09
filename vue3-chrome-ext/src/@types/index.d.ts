/// <reference types="node" />
/// <reference types="vue" />
/// <reference types="chrome" />
declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
declare module '*.scss';
/*
declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
*/
declare module '*.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}
declare module '*.less' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.png';
