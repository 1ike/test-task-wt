import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

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

const styles = (theme: Theme) => ({
  menuItem: {
    '&:focus': {
      "backgroundColor": theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  menuLink: {
    display: 'flex',
    textDecoration: 'none',
  },
  primary: {},
  icon: {},
});

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
          {this.links.map((link, index: number) => (
            <MenuItem key={index} className={classes.menuItem}>
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
          ))}
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
