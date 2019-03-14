export interface NullAction {
  type: TypeKeys.NULL
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppSetBoxEnabledAction
  | AppSetSphereEnabledAction
  | AppSetCylinderEnabledAction
;

export enum TypeKeys {
  NULL = 'NULL',
  ERROR = 'ERROR',
  APP_SET_BOX_ENABLED = 'APP_SET_BOX_ENABLED',
  APP_SET_SPHERE_ENABLED = 'APP_SET_SPHERE_ENABLED',
  APP_SET_CYLINDER_ENABLED = 'APP_SET_CYLINDER_ENABLED'
};

export interface AppSetBoxEnabledAction {
  type: TypeKeys.APP_SET_BOX_ENABLED,
  payload: boolean;
}

export const appSetBoxEnabled = (payload: boolean) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_BOX_ENABLED,
    payload: payload
  })
};

export interface AppSetSphereEnabledAction {
  type: TypeKeys.APP_SET_SPHERE_ENABLED,
  payload: boolean;
}

export const appSetSphereEnabled = (payload: boolean) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_SPHERE_ENABLED,
    payload: payload
  })
};

export interface AppSetCylinderEnabledAction {
  type: TypeKeys.APP_SET_CYLINDER_ENABLED,
  payload: boolean;
}

export const appSetCylinderEnabled = (payload: boolean) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_CYLINDER_ENABLED,
    payload: payload
  })
};
