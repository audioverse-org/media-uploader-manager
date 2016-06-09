import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { reduxForm } from 'redux-form';
import * as fileActions from 'redux/modules/file';

@connect(() => ({}),
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
    save: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired
  };

  render() {
    const { fields: { files }, handleSubmit, save, load } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="fileinput fileinput-new input-group" data-provides="fileinput">
          <span className="btn btn-default btn-file">
            <span className="fileinput-new">Select file</span>
            <span className="fileinput-exists">Change</span>
            <input type="file" multiple {...files} value={null} onChange={event => {
              console.log('event', event.target.files);
              if (!event.target.files.length) return;
              save(event.target.files)
                .then(
                  result => {
                    console.log('finish uploading', result);
                    if (result && typeof result.error === 'object') {
                      return Promise.reject(result.error);
                    }

                    return load()
                      .then(
                        result => { // eslint-disable-line no-shadow,no-unused-vars
                          console.log('finish load');
                        },
                        error => {
                          console.log('error to load files', error);
                        });
                  },
                  error => {
                    console.log('error to save files', error);
                  });
            }}/>
          </span>
          <span className="fileinput-filename"></span>
          <a href="#" className="close fileinput-exists" data-dismiss="fileinput" style={{float: 'none'}}>&times;</a>
        </div>
      </form>
    );
  }
}
