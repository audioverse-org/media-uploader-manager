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

export default
class FileForm extends Component {
  static propTypes = {
    upload: PropTypes.func.isRequired,
    pathString: PropTypes.string.isRequired
  };

  handleUpload = (event) => {
    if (!event.target.files.length) return;
    this.props.upload(this.props.pathString, event.target.files)
      .then(
        result => {
          console.log(result);
          if (result && typeof result.error === 'object') {
            return Promise.reject(result.error);
          }
        },
        error => {
          alert(error.message);
        });
  }

  render() {
    const styles = require('./FileForm.scss');
    return (
      <form>
        <span className={styles.btnFile}>
          <span>Upload</span>
          <input type="file" multiple value={''} onChange={this.handleUpload}/>
        </span>
      </form>
    );
  }
}
