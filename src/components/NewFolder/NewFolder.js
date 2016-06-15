import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as fileActions from 'redux/modules/file';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

@connect(
  state => ({
    pathString: state.file.pathString
  }),
  dispatch => bindActionCreators(fileActions, dispatch)
)

export default
class NewFolder extends Component {
  static propTypes = {
    newFolder: PropTypes.func.isRequired,
    pathString: PropTypes.string.isRequired
  };

  state = {
    open: false,
    folder: ''
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleChangeFolder = (event) => {
    this.setState({
      folder: event.target.value
    });
  };

  render() {
    const { newFolder, pathString } = this.props;
    const { open, folder } = this.state;
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onTouchTap={() => {
          newFolder(pathString + '/' + folder)
            .then(
              result => {
                console.log(result);
                if (result && typeof result.error === 'object') {
                  return Promise.reject(result.error);
                }
                this.handleClose();
              },
              error => {
                console.log(error);
              });
        }}
      />,
    ];

    return (
      <div onTouchTap={this.handleOpen}>
        New folder
        <Dialog
          title="New folder"
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={this.handleClose}
          contentStyle={{width: '350px'}}
        >
          <TextField
            id="folder-field"
            value={folder}
            onChange={this.handleChangeFolder}
          />
        </Dialog>
      </div>
    );
  }
}
