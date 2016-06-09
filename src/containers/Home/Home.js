import React, { Component, PropTypes } from 'react';
// import { Link } from 'react-router';
// import config from '../../config';
import Helmet from 'react-helmet';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import {connect} from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import { isLoaded, load as loadDir } from 'redux/modules/file';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadDir());
    }
  }
}])
@connect(
  state => ({
    dir: state.file.dir
  })
)

export default class Home extends Component {
  static propTypes = {
    dir: PropTypes.array.isRequired
  };

  render() {
    const { dir } = this.props;
    const styles = require('./Home.scss');
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>

        <div className="container">
          <Grid>
            <Row className="show-grid">
              {
                dir.map((file, key) => {
                  return (
                    <Col xs={6} md={3} key={key + 1} className="text-center">
                      <p style={{'fontSize': '24px'}}><i className="fa fa-file"/></p>
                      <p>{file}</p>
                    </Col>
                  );
                })
              }
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}
