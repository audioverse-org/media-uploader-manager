import React, { Component, PropTypes } from 'react';
import { load as loadDir } from 'redux/modules/file';

export default class FileItem extends Component {

  static propTypes = {
    file: PropTypes.object.isRequired
  };

  getFileType = (file) => {
    let type = null;
    const extensions = {
      'image': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'audio': ['.mp3', '.ogg', '.wma']
    };
    if ( file.type === 'folder' ) return 'folder';
    for (const key in extensions) {
      if ( extensions[key].indexOf(file.extension) !== -1 ) {
        type = key;
        break;
      }
    }
    return type;
  }

  getIcon = (file) => {
    switch ( this.getFileType(file) ) {
      case 'folder':
        return 'folder-open';
      case 'image':
        return 'picture';
      case 'audio':
        return 'music';
      default:
        return 'file';
    }
  }

  handleDblClick = (file) => {
    if ( file.type === 'folder' ) {
      loadDir( file.name );
      console.log('hi');
    }
  }

  render() {
    const {file} = this.props;
    return (
      <div className="col-sm-3 text-center">
        <p style={{'fontSize': '36px'}} onDoubleClick={() => this.handleDblClick(file)}><i className={'fa fa-' + this.getIcon( file )}/></p>
        <p>{file.name}</p>
      </div>
    );
  }
}
