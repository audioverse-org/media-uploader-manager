import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as fileActions from 'redux/modules/file';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

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
    load: PropTypes.func.isRequired,
    renameFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired
  };

  state = {
    openRename: false,
    openDelete: false,
    newName: this.props.file.name
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

  handleOpenRename = () => {
    this.setState({openRename: true});
  };

  handleCloseRename = () => {
    this.setState({openRename: false});
  };

  handleOpenDelete = () => {
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
    const {file, pathString, load, renameFile, deleteFile} = this.props;
    const {openRename, openDelete, newName} = this.state;
    const styles = {
      item: {
        height: '60px',
        width: '100%',
        margin: '10px 0',
        display: 'flex',
        lineHeight: '60px',
        justifyContent: 'space-between'
      },
      icon: {
        fontSize: '24px',
        display: 'inline-block',
        background: '#eee',
        padding: '0 10px',
        marginRight: '10px'
      },
      text: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      },
      iconMenu: {
        display: 'flex'
      }
    };
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
        onTouchTap={() => {
          renameFile(pathString, file, newName)
            .then(
              result => {
                console.log(result);
                if (result && typeof result.error === 'object') {
                  return Promise.reject(result.error);
                }
                this.handleCloseRename();
              },
              error => {
                console.log(error);
              });
        }}
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
        onTouchTap={() => {
          deleteFile(pathString, file)
            .then(
              result => {
                console.log(result);
                if (result && typeof result.error === 'object') {
                  return Promise.reject(result.error);
                }
                this.handleCloseDelete();
              },
              error => {
                console.log(error);
              });
        }}
      />,
    ];
    return (
      <div className="col-sm-3">
        <Paper style={styles.item} zDepth={1} onDoubleClick={() => {
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
        }}>
          <span style={styles.icon}>
            <i className={'fa fa-' + this.getIcon( file )}/>
          </span>
          <span style={styles.text}>{file.name}</span>
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            style={styles.iconMenu}
          >
            <MenuItem primaryText="Rename" onTouchTap={this.handleOpenRename}/>
            <MenuItem primaryText="Delete" onTouchTap={this.handleOpenDelete}/>
          </IconMenu>
        </Paper>
        <Dialog
          title="Rename"
          actions={actionsRename}
          modal={false}
          open={openRename}
          onRequestClose={this.handleClose}
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
