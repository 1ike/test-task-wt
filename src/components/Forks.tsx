import * as React from 'react';

export interface IHelloProps {
  compiler: string;
  framework: string;
}

const Hello = (props: IHelloProps) => (
  <h1>
    Hello from {props.compiler} and {props.framework}!
  </h1>
);

export default Hello;
