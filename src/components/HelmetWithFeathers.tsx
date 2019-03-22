import * as React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { IReduxState } from '../services/store';

interface IProps {
  title: string;
  appName: string;
}

const HelmetWithFeathers = (props: IProps) => (
  <Helmet
    titleTemplate={`%s – "${props.appName}"`}
    // defaultTitle={`${props.appName}`}
  >
    <title>{props.title}</title>
  </Helmet>
);

const mapStateToProps = (state: IReduxState) => ({
  appName: state.appName,
});

export default connect(mapStateToProps)(HelmetWithFeathers);
