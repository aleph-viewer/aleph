import { Cube } from "../Cube";

export interface NullAction {
  type: TypeKeys.NULL
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppSetBoxEnabledAction
  | AppAddCubesAction
  | AppRemoveCubesAction
;

export enum TypeKeys {
  NULL = 'NULL',
  ERROR = 'ERROR',
  APP_SET_BOX_ENABLED = 'APP_SET_BOX_ENABLED',
  APP_ADD_CUBES = 'APP_ADD_CUBES',
  APP_REMOVE_CUBES = 'APP_REMOVE_CUBES'
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

export interface AppAddCubesAction {
  type: TypeKeys.APP_ADD_CUBES,
  payload: Cube[];
}

export const appAddCubes = (payload: Cube[]) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_ADD_CUBES,
    payload: payload
  })
};

export interface AppRemoveCubesAction {
  type: TypeKeys.APP_REMOVE_CUBES,
  payload: number;
}

export const appRemoveCubes = (payload: number) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_REMOVE_CUBES,
    payload: payload
  })
};
