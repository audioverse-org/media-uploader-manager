import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { reduxForm } from 'redux-form';
import * as fileActions from 'redux/modules/file';

@connect(
  state => ({
    pathString: state.file.pathString
  }),
  dispatch => bindActionCreators(fileActions, dispatch)
)
@reduxForm({
  form: 'FileForm',
  fields: [ 'files' ]
})
export default
class FileForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
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
          console.log(error);
        });
  }

  render() {
    const { fields: { files }, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="fileinput fileinput-new input-group" data-provides="fileinput">
          <span className="btn-file">
            <span className="fileinput-new">Upload</span>
            <span className="fileinput-exists">Change</span>
            <input type="file" multiple {...files} value={''} onChange={this.handleUpload}/>
          </span>
          <span className="fileinput-filename"></span>
          <a href="#" className="close fileinput-exists" data-dismiss="fileinput" style={{float: 'none'}}>&times;</a>
        </div>
      </form>
    );
  }
}
