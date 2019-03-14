import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';
//import logger from 'redux-logger';

const configureStore = (preloadedState: any) =>
  createStore(rootReducer, preloadedState, applyMiddleware(/*logger,*/ thunk));

export { configureStore };
