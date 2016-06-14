import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { push } from 'react-router-redux';
import config from '../../config';
import { asyncConnect } from 'redux-connect';

import {UploadPanel} from 'components';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import spacing from 'material-ui/styles/spacing';
import {darkWhite, lightWhite, grey900} from 'material-ui/styles/colors';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import {AppNavDrawer} from 'components';

import {Toolbar} from 'material-ui/Toolbar';

const muiTheme = getMuiTheme({

}, {
  userAgent: false
});

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState: push})
class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    location: PropTypes.object,
    width: PropTypes.number.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {navDrawerOpen: false};
  }

  componentWillMount() {
    this.setState({
      muiTheme: getMuiTheme(),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  getStyles() {
    const styles = {
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: this.state.muiTheme.zIndex.appBar + 1,
        top: 0,
      },
      root: {
        paddingTop: spacing.desktopKeylineIncrement,
        minHeight: 400,
      },
      content: {
        margin: spacing.desktopGutter,
      },
      contentWhenMedium: {
        margin: `${spacing.desktopGutter * 2}px ${spacing.desktopGutter * 3}px`,
      },
      footer: {
        backgroundColor: grey900,
        textAlign: 'center',
      },
      a: {
        color: darkWhite,
      },
      p: {
        margin: '0 auto',
        padding: 0,
        color: lightWhite,
        maxWidth: 356,
      },
      browserstack: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        margin: '25px 15px 0',
        padding: 0,
        color: lightWhite,
        lineHeight: '25px',
        fontSize: 12,
      },
      browserstackLogo: {
        margin: '0 3px',
      },
      iconButton: {
        color: darkWhite,
      },
    };

    if (this.props.width === MEDIUM || this.props.width === LARGE) {
      styles.content = Object.assign(styles.content, styles.contentWhenMedium);
    }

    return styles;
  }

  handleTouchTapLeftIconButton = () => this.setState({navDrawerOpen: !this.state.navDrawerOpen});

  handleChangeRequestNavDrawer = (open) => this.setState({navDrawerOpen: open});

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    // const {user} = this.props;
    const {children, location} = this.props;
    const styles = require('./App.scss');
    let title = config.app.title;

    const stylesMaterial = this.getStyles();
    let {navDrawerOpen} = this.state;
    const {prepareStyles} = this.state.muiTheme;

    let docked = false;
    let showMenuIconButton = true;

    if (this.props.width === LARGE) {
      docked = true;
      navDrawerOpen = true;
      showMenuIconButton = false;
      title = '';

      stylesMaterial.navDrawer = {
        zIndex: stylesMaterial.appBar.zIndex - 1,
      };
      stylesMaterial.root.paddingLeft = 256;
      stylesMaterial.footer.paddingLeft = 256;
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={styles.app}>
          <Helmet {...config.app.head}/>
          <AppBar
            onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
            title={title}
            zDepth={0}
            style={stylesMaterial.appBar}
            showMenuIconButton={showMenuIconButton}
          />
          <div style={prepareStyles(stylesMaterial.root)}>
            <div style={prepareStyles(stylesMaterial.content)}>
              <Toolbar/>
              {React.cloneElement(children, {
                onChangeMuiTheme: this.handleChangeMuiTheme,
              })}
            </div>
          </div>
          <AppNavDrawer
            style={stylesMaterial.navDrawer}
            location={location}
            docked={docked}
            onRequestChangeNavDrawer={this.handleChangeRequestNavDrawer}
            open={navDrawerOpen}
          />
          <UploadPanel/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withWidth()(App);
