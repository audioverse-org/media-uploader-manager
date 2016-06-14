import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import { isLoaded, load as loadDir } from 'redux/modules/file';
import { FileList } from 'components';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadDir());
    }
  }
}])

export default class Home extends Component {

  render() {
    const styles = require('./Home.scss');
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className="container">
          <FileList/>
        </div>
      </div>
    );
  }
}
