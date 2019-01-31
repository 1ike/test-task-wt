import * as React from 'react';
import { connect } from 'react-redux';

import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { Forks as ForksType, IRepo } from '../../../ducks/forks';
import { IReduxState } from '../../../store/configureStore';
import HelmetWithFeathers from '../../../components/HelmetWithFeathers';
import Title from '../../../components/Title';
import Form from '../../../components/Form';
import ForksTable from './ForksTable';

const styles = (theme: Theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as 'column',
    paddingBottom: 50,
  },
  form: {
    marginTop: '3em',
    marginBottom: '4em',
    color: 'red',
  },
  title: {
    marginBottom: '0.5em',
  },
  subtitle: {
    marginBottom: '1em',
  },
});

export interface IForksProps extends WithStyles<typeof styles> {
  forks: ForksType;
  repository: IRepo;
}

const Forks = (props: IForksProps) => {
  const {
    classes: {
      root: rootClass,
      form: formClass,
      title: titleCLass,
      subtitle: subtitleCLass,
    },
    forks,
    repository: { full_name, html_url, forks_count, stargazers_count, owner },
  } = props;

  return (
    <main className={rootClass}>
      <HelmetWithFeathers title='Forks' />
      <Form classes={{ root: formClass }} />
      <Title classes={{ root: titleCLass }}>
        Forks for <a href={html_url}>{full_name}</a>
      </Title>
      <Typography variant='subtitle1' classes={{ root: subtitleCLass }}>
        (owner: <a href={owner.html_url}>{owner.login}</a>, forks:{' '}
        <a href={`${html_url}/forks`}>{forks_count}</a>, stars:{' '}
        <a href={`${html_url}/stargazers`}>{stargazers_count}</a>)
      </Typography>
      <ForksTable rows={forks} />
    </main>
  );
};

const mapStateToProps = (state: IReduxState) => ({
  forks: state.forks.items,
  repository: state.forks.repository,
});

export default connect(mapStateToProps)(withStyles(styles)(Forks));
