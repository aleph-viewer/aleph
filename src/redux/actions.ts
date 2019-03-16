import { Tool } from "../Tool";

export interface NullAction {
  type: TypeKeys.NULL
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppAddToolAction
  | AppRemoveToolAction
  | AppSelectToolAction
  | AppUpdateToolAction
  | AppSaveToolsAction
;

export enum TypeKeys {
  NULL = 'NULL',
  ERROR = 'ERROR',
  APP_ADD_TOOL = 'APP_ADD_TOOL',
  APP_REMOVE_TOOL = 'APP_REMOVE_TOOL',
  APP_SELECT_TOOL = 'APP_SELECT_TOOL',
  APP_UPDATE_TOOL = 'APP_UPDATE_TOOL',
  APP_SAVE_TOOLS = 'APP_SAVE_TOOLS'
};

export interface AppAddToolAction {
  type: TypeKeys.APP_ADD_TOOL,
  payload: Tool;
}

export const appAddTool = (payload: Tool) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_ADD_TOOL,
    payload: payload
  })
};

export interface AppRemoveToolAction {
  type: TypeKeys.APP_REMOVE_TOOL,
  payload: number;
}

export const appRemoveTool = (payload: number) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_REMOVE_TOOL,
    payload: payload
  })
};

export interface AppSelectToolAction {
  type: TypeKeys.APP_SELECT_TOOL,
  payload: number;
}

export const appSelectTool = (payload: number) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SELECT_TOOL,
    payload: payload
  })
};

export interface AppUpdateToolAction {
  type: TypeKeys.APP_UPDATE_TOOL,
  payload: Tool;
}

export const appUpdateTool = (payload: Tool) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_UPDATE_TOOL,
    payload: payload
  })
};

export interface AppSaveToolsAction {
  type: TypeKeys.APP_SAVE_TOOLS,
  payload: void;
}

export const appSaveTools = (payload: void) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SAVE_TOOLS,
    payload: payload
  })
};
