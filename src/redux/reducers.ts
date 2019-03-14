import { combineReducers } from 'redux';
import { ActionTypes, TypeKeys } from './actions';

interface AppState {
  boxEnabled: boolean;
  sphereEnabled: boolean;
  cylinderEnabled: boolean;
}

export const getInitialState = () => {
  return {
    boxEnabled: false,
    sphereEnabled: false,
    cylinderEnabled: false
  }
};

export const app = (state: AppState = getInitialState(), action: ActionTypes) => {

  switch (action.type) {
    case TypeKeys.APP_SET_BOX_ENABLED: {
      return {
        ...state,
        boxEnabled: action.payload
      }
    }
    case TypeKeys.APP_SET_SPHERE_ENABLED: {
      return {
        ...state,
        sphereEnabled: action.payload
      }
    }
    case TypeKeys.APP_SET_CYLINDER_ENABLED: {
      return {
        ...state,
        cylinderEnabled: action.payload
      }
    }
  }

  return state;
};

export const rootReducer = (combineReducers as any)({
  app
});
