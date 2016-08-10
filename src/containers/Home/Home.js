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
import RaisedButton from 'material-ui/RaisedButton';
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
    view: state.file.view,
    dir: state.file.dir,
    pathString: state.file.pathString
  }),
  dispatch => bindActionCreators(fileActions, dispatch)
)

export default class Home extends Component {
  static propTypes = {
    view: PropTypes.string.isRequired,
    dir: PropTypes.array.isRequired,
    toggleView: PropTypes.func.isRequired,
    orderBy: PropTypes.func.isRequired,
    pathString: PropTypes.string.isRequired
  };

  componentDidMount = () => {
    // fetch('https://admin.audioverse.net/ajax/islogged', {
    //   method: 'GET',
    //   credentials: 'include'
    // })
    // .then(res => res.json())
    // .then(res => {
    //   if (!res) {
    //     location.href = 'https://admin.audioverse.net/';
    //   }
    // })
    // .catch(() => location.href = 'https://admin.audioverse.net/');
  }
  handleTouchTapDone = () => {
    const selected = this.props.dir.filter((file) => {
      return file.selected;
    });

    let htmlSelectedElements = '';
    const path = this.props.pathString !== '' ? this.props.pathString.substr(1, this.props.pathString.length) + '/' : '';
    selected.map((file) => {
      htmlSelectedElements += '<strong>' + path + file.name + '</strong><br/>';
    });
    window.opener.postMessage(htmlSelectedElements, '*');
    window.close();
  };

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
            <RaisedButton label="Done" primary onTouchTap={this.handleTouchTapDone}/>
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
