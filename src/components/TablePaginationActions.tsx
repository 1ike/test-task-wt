import * as React from 'react';

import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { TablePaginationActionsProps } from '@material-ui/core/TablePagination/TablePaginationActions';

import { IconButton } from '@material-ui/core';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

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
  page: number;
}

class TablePaginationActions extends React.Component<IProps> {

  public handleFirstPageButtonClick = () => {
    this.props.onChangePage(null, 1);
  }

  public handleBackButtonClick = () => {
    this.props.onChangePage(null, this.props.page);
  }

  public handleNextButtonClick = () => {
    this.props.onChangePage(null, this.props.page + 2);
  }

  public handleLastPageButtonClick = () => {
    this.props.onChangePage(null, Math.max(1, this.getMaxPage() + 1));
  }

  public render() {
    const { classes, page, theme } = this.props;

    const direction = (
      RightElem: React.ComponentType<SvgIconProps>,
      LeftElem: React.ComponentType<SvgIconProps>
    ) => (theme.direction === 'rtl' ? <RightElem /> : <LeftElem />);

    const disabledStart = page === 0;
    const disabledEnd = page >= this.getMaxPage();

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={disabledStart}
          aria-label='First Page'
        >
          {direction(LastPageIcon, FirstPageIcon)}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={disabledStart}
          aria-label='Previous Page'
        >
          {direction(KeyboardArrowRight, KeyboardArrowLeft)}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={disabledEnd}
          aria-label='Next Page'
        >
          {direction(KeyboardArrowLeft, KeyboardArrowRight)}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={disabledEnd}
          aria-label='Last Page'
        >
          {direction(FirstPageIcon, LastPageIcon)}
        </IconButton>
      </div>
    );
  }
  private getMaxPage = () =>
    Math.ceil(this.props.count / this.props.rowsPerPage) - 1
}

export default withStyles(actionsStyles, {
  withTheme: true,
})(TablePaginationActions);
