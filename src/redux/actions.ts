import { Cube } from "../Cube";

export interface NullAction {
  type: TypeKeys.NULL
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppSetBoxEnabledAction
  | AppSetCubesAction
;

export enum TypeKeys {
  NULL = 'NULL',
  ERROR = 'ERROR',
  APP_SET_BOX_ENABLED = 'APP_SET_BOX_ENABLED',
  APP_SET_CUBES = 'APP_SET_CUBES'
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

export interface AppSetCubesAction {
  type: TypeKeys.APP_SET_CUBES,
  payload: Cube[];
}

export const appSetCubes = (payload: Cube[]) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_CUBES,
    payload: payload
  })
};

