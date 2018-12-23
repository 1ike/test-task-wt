import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import classNames from 'classnames';

import { createStyles, WithStyles } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import DraftsIcon from '@material-ui/icons/Drafts';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';

const styles = (theme: Theme) => {
  const childs = '& $primary, & $icon';
  const activeBackgroundColor = {
    backgroundColor: theme.palette.primary.main,
  };
  const active = {
    ...activeBackgroundColor,
    [childs]: {
      color: theme.palette.common.white,
    },
  };
  const paddingV = 11;
  const paddingH = 16;

  return {
    menuItem: {
      '&:focus': {
        backgroundColor: theme.palette.action.hover,
        [childs]: {
          color: theme.palette.common.black,
        },
      },
      '&:focus:hover': {
        backgroundColor: theme.palette.action.hover,
        [childs]: {
          color: theme.palette.common.black,
        },
      },
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
      ...active,
      '&:hover': activeBackgroundColor,
    },
  };
};

interface IState {
  readonly anchorEl: HTMLElement;
}

interface IProps extends WithStyles<typeof styles> {}

interface ILink {
  path: string;
  title: string;
  icon(): JSX.Element;
}

// @withStyles(styles)
class SlideMenu extends React.Component<IProps, IState> {
  public readonly state: Readonly<IState> = {
    anchorEl: null,
  };

  private links: ILink[] = [
    { path: '/', title: 'Home', icon: () => <HomeIcon /> },
    { path: '/forks', title: 'Forks', icon: () => <DraftsIcon /> },
    { path: '/mail/sent', title: 'NotFound', icon: () => <InboxIcon /> },
  ];

  public render(): JSX.Element {
    const { anchorEl } = this.state;
    const { classes } = this.props;
    const open = Boolean(anchorEl);

    return (
      <React.Fragment>
        <IconButton
          className={classes.menuButton}
          color='inherit'
          aria-label='Menu'
          aria-owns={open ? 'fade-menu' : undefined}
          aria-haspopup='true'
          onClick={this.handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id='fade-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Fade}
          disableAutoFocusItem={true}
        >
          {this.links.map((link, index: number) => {
            const Item = withRouter((props: any) => (
              <MenuItem
                className={classNames(classes.menuItem, {
                  [classes.active]: props.location.pathname === link.path,
                })}
                disableGutters={true}
                tabIndex={0}
              >
                <NavLink
                  to={link.path}
                  className={classes.menuLink}
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
        </Menu>
      </React.Fragment>
    );
  }

  private handleClick = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  private handleClose = () => {
    this.setState({ anchorEl: null });
  }
}

export default withStyles(styles)(SlideMenu);
