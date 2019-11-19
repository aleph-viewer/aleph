import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./reducers";
// import logger from 'redux-logger';
// tslint:disable-next-line: no-any
const configureStore = (preloadedState) => createStore(rootReducer, preloadedState, applyMiddleware(/*logger,*/ thunk));
export { configureStore };
