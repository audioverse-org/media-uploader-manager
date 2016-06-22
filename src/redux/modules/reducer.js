import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';

import file from './file';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  file
});
