import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as fileActions from 'redux/modules/file';

@connect(
  state => ({
    pathString: state.file.pathString
  }),
  dispatch => bindActionCreators(fileActions, dispatch)
)

export default class Breadcrumb extends Component {
  static propTypes = {
    pathString: PropTypes.string.isRequired,
    load: PropTypes.func.isRequired
  };

  render() {
    const { pathString, load } = this.props;
    const pathArray = pathString.split('/');
    return (
      <ol className="breadcrumb">
        {
          pathArray.map((dir, key) => {
            return (
              <li key={key + 1} className={pathArray.length === (key + 1) ? 'active' : ''}>
                <a href="#" onClick={() => {
                  load( pathArray.slice(0, key + 1).join('/') );
                }}>
                  {dir === '' ? 'Home' : dir}
                </a>
              </li>
            );
          })
        }
      </ol>
    );
  }
}
