/// <reference types="react-scripts" />
declare module '*.module.less' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.less' //app.less不报错 该行可以不配
