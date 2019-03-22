import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

import {
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
  WithStyles
} from '@material-ui/core';

import {
  Drafts as DraftsIcon,
  FavoriteBorder as FavoriteIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  MoveToInbox as InboxIcon
} from '@material-ui/icons';

import { IReduxState } from '../services/store';
import { RouteName } from '../constants';

const styles = (theme: Theme) => {
  const activeBackgroundColor = {
    backgroundColor: theme.palette.primary.main,
  };

  const paddingV = 11;
  const paddingH = 16;

  return {
    menuItem: {
      padding: 0,
      height: 'auto',
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    menuLink: {
      display: 'flex',
      flex: 1,
      textDecoration: 'none',
      paddingLeft: paddingH,
      paddingRight: paddingH,
      paddingTop: paddingV,
      paddingBottom: paddingV,
    },
    primary: {},
    icon: {},
    active: {
      ...activeBackgroundColor,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
      '&:hover': activeBackgroundColor,
      '&:focus': {
        backgroundColor: theme.palette.action.hover,
        '& $icon': {
          color: theme.palette.text.secondary,
        },
        '& $primary': {
          color: theme.palette.text.primary,
        },
      },
    },
    divider: {
      marginBottom: 20,
    },
    title: {
      margin: '10px 25px',
      'text-align': 'center',
    },
  };
};

interface IState {
  readonly open: boolean;
}

interface IProps extends WithStyles<typeof styles> {
  readonly appName: string;
}

interface ILink {
  path: string;
  title: string;
  icon(): JSX.Element;
}

class SlideMenu extends React.Component<IProps, IState> {
  public readonly state: Readonly<IState> = {
    open: false,
  };

  private links: ILink[] = [
    { path: RouteName.Home, title: 'Home', icon: () => <HomeIcon /> },
    {
      path: RouteName.Favourites,
      title: 'Favourites',
      icon: () => <FavoriteIcon />,
    },
    { path: '/mail/sent', title: 'NotFound', icon: () => <InboxIcon /> },
  ];

  public render(): JSX.Element {
    const { open } = this.state;
    const { classes, appName } = this.props;

    return (
      <React.Fragment>
        <IconButton
          className={classes.menuButton}
          color='inherit'
          aria-label='Menu'
          aria-owns={open ? 'slide-menu' : undefined}
          aria-haspopup='true'
          onClick={this.handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Drawer id='slide-menu' open={open} onClose={this.handleClose}>
          <Typography variant='h6' color='inherit' className={classes.title}>
            {appName}
          </Typography>
          <Divider className={classes.divider} />
          {this.links.map((link, index: number) => {
            const Item = withRouter((props: RouteComponentProps) => (
              <MenuItem className={classes.menuItem} disableGutters={true}>
                <NavLink
                  to={link.path}
                  className={classNames(classes.menuLink, {
                    [classes.active]: props.location.pathname === link.path,
                  })}
                  onClick={this.handleClose}
                >
                  <ListItemIcon className={classes.icon}>
                    {link.icon()}
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.primary }}
                    inset={true}
                    primary={link.title}
                  />
                </NavLink>
              </MenuItem>
            ));

            return <Item key={index} />;
          })}
        </Drawer>
      </React.Fragment>
    );
  }

  private handleClick = () => {
    this.setState({ open: true });
  }

  private handleClose = () => {
    this.setState({ open: false });
  }
}

const mapStateToProps = (state: IReduxState) => ({
  appName: state.appName,
});

export default connect(mapStateToProps)(withStyles(styles)(SlideMenu));
