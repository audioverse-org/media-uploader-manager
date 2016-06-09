import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {Panel, ListGroup, ListGroupItem } from 'react-bootstrap/lib';

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
        <ListGroup fill className={styles.listGroup}>
          {
            files.map((file) => {
              return <ListGroupItem key={file.id} className={styles.listGroupItem}><i className="fa fa-cog fa-spin"/> {file.name}</ListGroupItem>;
            })
          }
        </ListGroup>
      </Panel>
    );
  }
}
