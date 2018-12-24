import * as React from 'react';

import HelmetWithFeathers from './HelmetWithFeathers';

export interface IHelloProps {
  compiler: string;
  framework: string;
}

const Hello = (props: IHelloProps) => (
  <React.Fragment>
    <HelmetWithFeathers title='Forks' />
    <h1>
      Hello from {props.compiler} and {props.framework}!
    </h1>
  </React.Fragment>
);

export default Hello;
