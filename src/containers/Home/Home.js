import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import { isLoaded, load as loadDir } from 'redux/modules/file';
import { FileList, Breadcrumbs } from 'components';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadDir(''));
    }
  }
}])

export default class Home extends Component {

  render() {
    return (
      <div style={{position: 'absolute', top: '49px', left: 0, right: 0, bottom: '48px'}}>
        <div style={{height: '100%', overflowX: 'hidden', overflowY: 'scroll'}}>
          <Helmet title="Home"/>
          <Breadcrumbs/>
          <FileList/>
        </div>
      </div>
    );
  }
}
