import * as React from 'react';
import Helmet from 'react-helmet';

interface IProps {
  title: string;
}

function HelmetSFC(props: IProps) {
  return (
    <Helmet titleTemplate='%s – "WebTouch test job"'>
      <title>{props.title}</title>
    </Helmet>
  );
}

export default HelmetSFC;
