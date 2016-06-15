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

export default class FileItem extends Component {

  static propTypes = {
    file: PropTypes.object.isRequired,
    pathString: PropTypes.string.isRequired,
    load: PropTypes.func.isRequired
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

  render() {
    const {file, pathString, load} = this.props;
    return (
      <div className="col-sm-3 text-center">
        <p style={{'fontSize': '36px'}} onDoubleClick={() => {
          if ( file.type === 'folder' ) {
            load(pathString + '/' + file.name)
              .then(
                result => {
                  console.log(result);
                },
                error => {
                  console.log(error);
                });
          }
        }}><i className={'fa fa-' + this.getIcon( file )}/></p>
        <p>{file.name}</p>
      </div>
    );
  }
}
