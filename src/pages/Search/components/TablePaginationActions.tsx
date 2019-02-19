import * as React from 'react';

import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { TablePaginationActionsProps } from '@material-ui/core/TablePagination/TablePaginationActions';

import { IconButton } from '@material-ui/core';

import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon
} from '@material-ui/icons';

const actionsStyles = (theme: Theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

interface IProps
  extends WithStyles<typeof actionsStyles>,
    TablePaginationActionsProps {
  theme: Theme;
  rowsPerPage: number;
  count: number;
  page: number;
}

class TablePaginationActions extends React.Component<IProps> {
  public handleFirstPageButtonClick = () => {
    // this.props.onChangePage(event, 0);
  }

  public handleBackButtonClick = () => {
    // this.props.onChangePage(event, this.props.page - 1);
  }

  public handleNextButtonClick = () => {
    // this.props.onChangePage(event, this.props.page + 1);
  }

  public handleLastPageButtonClick = () => {
    // this.props.onChangePage(
    //   event,
    //   Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    // );
  }

  public render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          // onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label='First Page'
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label='Previous Page'
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Next Page'
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Last Page'
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

export default withStyles(actionsStyles, {
  withTheme: true,
})(TablePaginationActions);
