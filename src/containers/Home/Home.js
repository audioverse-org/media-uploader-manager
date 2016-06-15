import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import { isLoaded, load as loadDir } from 'redux/modules/file';
import { FileList } from 'components';
import {Toolbar} from 'material-ui/Toolbar';
import {connect} from 'react-redux';

@connect(
  state => ({
    pathArray: state.file.pathArray
  })
)

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadDir(''));
    }
  }
}])

export default class Home extends Component {
  static propTypes = {
    pathArray: PropTypes.array.isRequired
  };

  render() {
    const { pathArray } = this.props;
    return (
      <div>
        <Helmet title="Home"/>
        <Toolbar>
          <ul>
            {
              pathArray.map((dir, key) => {
                return <li key={key + 1}>{dir}</li>;
              })
            }
          </ul>
        </Toolbar>
        <FileList/>
      </div>
    );
  }
}
