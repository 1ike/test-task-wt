import * as React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { initialState } from '../services/store';

interface IProps {
  title: string;
  appName: string;
}

const HelmetWithFeathers = (props: IProps) => (
  <Helmet titleTemplate='%s – "WebTouch test job"'>
    {props.appName}
    <title>{props.title}</title>
  </Helmet>
);

const mapStateToProps = (state: typeof initialState) => ({
  appName: state.appName,
});

export default connect(mapStateToProps)(HelmetWithFeathers);
