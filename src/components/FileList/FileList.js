import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {FileItem} from 'components';

@connect(
  state => ({
    dir: state.file.dir,
    view: state.file.view
  })
)

export default class FileList extends Component {
  static propTypes = {
    dir: PropTypes.array.isRequired,
    view: PropTypes.string.isRequired
  };

  render() {
    const {dir, view} = this.props;
    const styles = require('../FileItem/FileItem.scss');
    return (
      <div className={view === 'list' ? styles.table : ''}>
        {view === 'list' &&
        <div className={styles.tableHeaderGroup}>
          <div className={styles.cell}>
            <div style={{width: '100%'}}>
              Name
            </div>
          </div>
          <div className={styles.cell}>
            <div style={{width: '100px'}}>
              Last Modified
            </div>
          </div>
          <div className={styles.cell}>
            <div style={{width: '100px'}}>
              Size
            </div>
          </div>
          <div className={styles.cell}>
            <div style={{width: '48px'}}>
              Options
            </div>
          </div>
        </div>}
        <div className={view === 'list' ? styles.tableRowGroup : 'row'}>
          {
            dir.map((file, key) => {
              return <FileItem key={key + 1} file={file}/>;
            })
          }
        </div>
      </div>
    );
  }
}
