import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as fileActions from 'redux/modules/file';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import ImageIcon from 'material-ui/svg-icons/image/image';
import MusicNoteIcon from 'material-ui/svg-icons/image/music-note';
import InsertDriveFileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import Paper from 'material-ui/Paper';

@connect(
  state => ({
    pathString: state.file.pathString,
    view: state.file.view
  }),
  dispatch => bindActionCreators(fileActions, dispatch)
)

export default class FileItem extends Component {

  static propTypes = {
    file: PropTypes.object.isRequired,
    pathString: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    load: PropTypes.func.isRequired,
    renameFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    toggleSelect: PropTypes.func.isRequired
  };

  state = {
    openRename: false,
    openDelete: false,
    newName: this.props.file.name
  };

  getFileType = (file) => {
    let type = null;
    const extensions = {
      'image': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'],
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
        return <FolderIcon/>;
      case 'image':
        return <ImageIcon/>;
      case 'audio':
        return <MusicNoteIcon/>;
      default:
        return <InsertDriveFileIcon/>;
    }
  }

  convertSize = (file) => {
    if ( file.type === 'folder' ) return '';
    const base = 1024;
    if ( file.size < 999 ) return (file.size).toFixed(2) + ' b';
    else if ( file.size < 999999 ) return (file.size / base).toFixed(2) + ' KB';
    else if ( file.size < 999999999 ) return (file.size / (base * base)).toFixed(2) + ' MB';
    else if ( file.size < 999999999999 ) return (file.size / (base * base * base)).toFixed(2) + ' GB';
  }

  formatDate = (strDate) => {
    const date = new Date(strDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return months[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
  }

  handleClick = () => {
    if ( this.props.file.type !== 'folder' ) {
      this.props.toggleSelect( this.props.file.id );
    }
  };

  handleDoubleClick = () => {
    if ( this.props.file.type === 'folder' ) {
      this.props.load(this.props.pathString + '/' + this.props.file.name)
        .then(
          result => {
            console.log(result);
          },
          error => {
            alert(error.message);
          });
    }
  };

  handleDeleteFile = () => {
    this.handleCloseDelete();
    this.props.deleteFile(this.props.pathString, this.props.file)
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
  };

  handleRenameFile = () => {
    this.props.renameFile(this.props.pathString, this.props.file, this.state.newName)
      .then(
        result => {
          console.log(result);
          if (result && typeof result.error === 'object') {
            return Promise.reject(result.error);
          }
          this.handleCloseRename();
        },
        error => {
          alert(error.message);
        });
  };

  handleTouchPadOpenRename = () => {
    this.setState({openRename: true});
  };

  handleCloseRename = () => {
    this.setState({openRename: false});
  };

  handleTouchPadOpenDelete = () => {
    this.setState({openDelete: true});
  };

  handleCloseDelete = () => {
    this.setState({openDelete: false});
  };

  handleChangeNewName = (event) => {
    this.setState({
      newName: event.target.value
    });
  };

  render() {
    const {file, view} = this.props;
    const {openRename, openDelete, newName} = this.state;
    const styles = require('./FileItem.scss');
    const actionsRename = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleCloseRename}
      />,
      <FlatButton
        label="Confirm"
        primary
        keyboardFocused
        onTouchTap={this.handleRenameFile}
      />,
    ];
    const actionsDelete = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleCloseDelete}
      />,
      <FlatButton
        label="Confirm"
        primary
        keyboardFocused
        onTouchTap={this.handleDeleteFile}
      />,
    ];
    const options = (<IconMenu
      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      className={styles.iconMenu}
    >
      <MenuItem primaryText="Rename" onTouchTap={this.handleTouchPadOpenRename}/>
      <MenuItem primaryText="Delete" onTouchTap={this.handleTouchPadOpenDelete}/>
    </IconMenu>);
    return (
      <div className={[view === 'list' ? styles.tableRow : 'col-sm-3', file.selected ? styles.selected : ''].join(' ')} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>
        {view === 'list' ?
        <div>
          <div className={styles.cell}>
            <div style={{width: '100%'}}>
              <span className={styles.icon + ' ' + styles.lineHeight}>
                {this.getIcon( file )}
              </span>
              <span className={styles.text}>{file.name}</span>
            </div>
          </div>
          <div className={styles.cell}>
            <div style={{width: '100px'}}>
              {this.formatDate(file.mtime)}
            </div>
          </div>
          <div className={styles.cell}>
            <div style={{width: '100px'}}>
              {this.convertSize(file)}
            </div>
          </div>
          <div className={styles.cell}>
            <div style={{width: '48px'}}>
              {options}
            </div>
          </div>
        </div> :
        <Paper className={styles.item} zDepth={1} onDoubleClick={this.handleDoubleClick}>
          <span className={styles.icon}>
            {this.getIcon( file )}
          </span>
          <span className={styles.text}>{file.name}</span>
          {options}
        </Paper>}
        <Dialog
          title="Rename"
          actions={actionsRename}
          modal={false}
          open={openRename}
          onRequestClose={this.handleCloseRename}
          contentStyle={{width: '350px'}}
        >
          <TextField
            id="newName-field"
            value={newName}
            onChange={this.handleChangeNewName}
          />
        </Dialog>
        <Dialog
          title="Delete"
          actions={actionsDelete}
          modal={false}
          open={openDelete}
          onRequestClose={this.handleCloseDelete}
          contentStyle={{width: '350px'}}
        >
          Are you sure?
        </Dialog>
      </div>
    );
  }
}
