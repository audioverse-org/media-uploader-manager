import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';

import auth from './auth';
import file from './file';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  file
});
