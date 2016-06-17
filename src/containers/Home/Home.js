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
      <div>
        <Helmet title="Home"/>
        <Breadcrumbs/>
        <FileList/>
      </div>
    );
  }
}
