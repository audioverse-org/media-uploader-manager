import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';

@connect(
  state => ({
    files: state.file.files
  })
)
export default
class UploadPanel extends Component {
  static propTypes = {
    files: PropTypes.array.isRequired
  };

  render() {
    const { files } = this.props;
    const styles = require('./UploadPanel.scss');
    return (
      <div className={'panel panel-default ' + styles.uploadPanel} style={{display: files.length ? 'block' : 'none'}}>
        <div className="panel-heading">Uploading files...</div>
        <ul className={'list-group ' + styles.listGroup}>
          {
            files.map((file) => {
              return <li key={file.id} className={'list-group-item ' + styles.listGroupItem}><i className="fa fa-cog fa-spin"/> {file.name}</li>;
            })
          }
        </ul>
      </div>
    );
  }
}
