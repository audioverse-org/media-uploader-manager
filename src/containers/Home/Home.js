import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import { isLoaded, load as loadDir } from 'redux/modules/file';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as fileActions from 'redux/modules/file';
import { FileList, Breadcrumbs } from 'components';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ViewModuleIcon from 'material-ui/svg-icons/action/view-module';
import ViewListIcon from 'material-ui/svg-icons/action/view-list';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import SortByAlphaIcon from 'material-ui/svg-icons/av/sort-by-alpha';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadDir(''));
    }
  }
}])

@connect(
  state => ({
    view: state.file.view
  }),
  dispatch => bindActionCreators(fileActions, dispatch)
)

export default class Home extends Component {
  static propTypes = {
    toggleView: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
    orderBy: PropTypes.func.isRequired
  };

  componentDidMount = () => {
    fetch('https://admin.audioverse.net/ajax/islogged', {
      method: 'GET',
    })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));
  }

  handleTouchTapToggleView = () => this.props.toggleView();

  handleTouchTapOrderBy = (field) => this.props.orderBy(field);

  render() {
    const {view} = this.props;
    return (
      <div style={{position: 'relative', height: '100%'}}>
        <Helmet title="Home"/>
        <Toolbar>
          <ToolbarGroup firstChild>
            <Breadcrumbs/>
          </ToolbarGroup>
          <ToolbarGroup>
            <IconButton style={{height: '100%'}} onTouchTap={this.handleTouchTapToggleView}>
              {view === 'list' ? <ViewModuleIcon/> : <ViewListIcon/>}
            </IconButton>
            <IconMenu
              iconButtonElement={<IconButton style={{height: '100%'}}><SortByAlphaIcon/></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem primaryText="Name" onTouchTap={() => this.handleTouchTapOrderBy('name')}/>
              <MenuItem primaryText="Size" onTouchTap={() => this.handleTouchTapOrderBy('size')}/>
              <MenuItem primaryText="Last modified" onTouchTap={() => this.handleTouchTapOrderBy('mtime')}/>
              <MenuItem primaryText="File type" onTouchTap={() => this.handleTouchTapOrderBy('extension')}/>
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
        <div style={{position: 'absolute', top: '107px', left: 0, right: 0, bottom: '48px'}}>
          <div style={{height: '100%', overflowX: 'hidden', overflowY: 'scroll'}}>
            <FileList/>
          </div>
        </div>
      </div>
    );
  }
}
