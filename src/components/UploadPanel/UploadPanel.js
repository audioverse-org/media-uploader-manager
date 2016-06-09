import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import Panel from 'react-bootstrap/lib/Panel';

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
      <Panel collapsible defaultExpanded header="Uploading files..." bsStyle="primary" className={styles.uploadPanel} style={{display: files.length ? 'block' : 'none'}}>
        {
          files.map((file) => {
            return <p key={file.id}><i className="fa fa-cog fa-spin"/>{file.name}</p>;
          })
        }
      </Panel>
    );
  }
}
