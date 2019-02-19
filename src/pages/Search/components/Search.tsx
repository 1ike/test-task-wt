import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';

import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import * as queryString from 'query-string';

import {
  Forks as ForksType,
  IRepo,
  closeErrorMessage,
  fetchForks
} from '../../../ducks/forks';
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

export interface ISearchProps
  extends WithStyles<typeof styles>,
    RouteComponentProps {
  forks: ForksType;
  repository: IRepo;
  fetchForks: typeof fetchForks;
  closeErrorMessage: typeof closeErrorMessage;
}

const Search = (props: ISearchProps) => {
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
  React.useEffect(() => {
    const { repository, page } = queryString.parse(props.location.search);
    props.fetchForks({
      repository,
      page,
    });
    console.log(props.location);
  }, [props.location]);
  return (
    <main className={rootClass}>
      <HelmetWithFeathers title='Search results' />
      <Form classes={{ root: formClass }} />
      <Title classes={{ root: titleCLass }}>
        Forks for <a href={html_url}>{full_name}</a>
      </Title>
      {/* <Typography variant='subtitle1' classes={{ root: subtitleCLass }}>
            (owner: <a href={owner.html_url}>{owner.login}</a>, forks:{' '}
            <a href={`${html_url}/forks`}>{forks_count}</a>, stars:{' '}
            <a href={`${html_url}/stargazers`}>{stargazers_count}</a>)
          </Typography> */}
      <ForksTable rows={forks} />
    </main>
  );
};

// class Search extends React.Component<ISearchProps> {
//   constructor(props: ISearchProps) {
//     super(props);
//     const { repository, page } = queryString.parse(props.location.search);
//     props.fetchForks({
//       repository,
//       page,
//     });
//   }
//   public componentDidUpdate() {
//     console.log('componentDidUpdate()');
//   }

//   public render(): JSX.Element {
//     const {
//       classes: {
//         root: rootClass,
//         form: formClass,
//         title: titleCLass,
//         subtitle: subtitleCLass,
//       },
//       forks,
//       repository: { full_name, html_url, forks_count, stargazers_count, owner },
//     } = this.props;

//     return (
//       <main className={rootClass}>
//         <HelmetWithFeathers title='Search results' />
//         <Form classes={{ root: formClass }} />
//         <Title classes={{ root: titleCLass }}>
//           Forks for <a href={html_url}>{full_name}</a>
//         </Title>
//         {/* <Typography variant='subtitle1' classes={{ root: subtitleCLass }}>
//         (owner: <a href={owner.html_url}>{owner.login}</a>, forks:{' '}
//         <a href={`${html_url}/forks`}>{forks_count}</a>, stars:{' '}
//         <a href={`${html_url}/stargazers`}>{stargazers_count}</a>)
//       </Typography> */}
//         <ForksTable rows={forks} />
//       </main>
//     );
//   }
// }

const mapStateToProps = (state: IReduxState) => ({
  forks: state.forks.items,
  repository: state.forks.repository,
});

export default connect(
  mapStateToProps,
  { fetchForks, closeErrorMessage }
)(withStyles(styles)(Search));
