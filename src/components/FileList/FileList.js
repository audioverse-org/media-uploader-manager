import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {FileItem} from 'components';

@connect(
  state => ({
    dir: state.file.dir
  })
)

export default class FileList extends Component {
  static propTypes = {
    dir: PropTypes.array.isRequired
  };

  render() {
    const { dir } = this.props;
    return (
      <div className="row">
        {
          dir.map((file, key) => {
            return <FileItem key={key + 1} file={file}/>;
          })
        }
      </div>
    );
  }
}
