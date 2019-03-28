import { AlNodeSerial } from "../interfaces/AlNodeSerial";
import { DisplayMode } from "../enums/DisplayMode";
import { Orientation } from "../enums/Orientation";

export interface NullAction {
  type: TypeKeys.NULL;
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppSetSrcAction
  | AppSetSrcLoadedAction
  | AppAddNodeAction
  | AppRemoveNodeAction
  | AppSelectNodeAction
  | AppUpdateNodeAction
  | AppLoadNodesAction
  | AppSetDisplayModeAction
  | AppSetOrientationAction
  | AppSetNodesVisibleAction
  | AppSetNodesEnabledAction
  | AppSetOptionsVisibleAction
  | AppSetOptionsEnabledAction
  | AppSetBoundingBoxVisibleAction
  | AppSetSlicesIndexAction
  | AppSetSlicesWindowWidthAction
  | AppSetSlicesWindowCenterAction
  | AppSetVolumeStepsAction
  | AppSetVolumeWindowWidthAction
  | AppSetVolumeWindowCenterAction
  | AppSetCameraAnimatingAction;

export enum TypeKeys {
  NULL = "NULL",
  ERROR = "ERROR",
  APP_SET_SRC = "APP_SET_SRC",
  APP_SET_SRC_LOADED = "APP_SET_SRC_LOADED",
  APP_ADD_NODE = "APP_ADD_NODE",
  APP_REMOVE_NODE = "APP_REMOVE_NODE",
  APP_SELECT_NODE = "APP_SELECT_NODE",
  APP_UPDATE_NODE = "APP_UPDATE_NODE",
  APP_LOAD_NODES = "APP_LOAD_NODES",
  APP_SET_DISPLAY_MODE = "APP_SET_DISPLAY_MODE",
  APP_SET_ORIENTATION = "APP_SET_ORIENTATION",
  APP_SET_NODES_VISIBLE = "APP_SET_NODES_VISIBLE",
  APP_SET_NODES_ENABLED = "APP_SET_NODES_ENABLED",
  APP_SET_OPTIONS_VISIBLE = "APP_SET_OPTIONS_VISIBLE",
  APP_SET_OPTIONS_ENABLED = "APP_SET_OPTIONS_ENABLED",
  APP_SET_BOUNDINGBOX_VISIBLE = "APP_SET_BOUNDINGBOX_VISIBLE",
  APP_SET_SLICES_INDEX = "APP_SET_SLICES_INDEX",
  APP_SET_SLICES_WINDOW_WIDTH = "APP_SET_SLICES_WINDOW_WIDTH",
  APP_SET_SLICES_WINDOW_CENTER = "APP_SET_SLICES_WINDOW_CENTER",
  APP_SET_VOLUME_STEPS = "APP_SET_VOLUME_STEPS",
  APP_SET_VOLUME_WINDOW_WIDTH = "APP_SET_VOLUME_WINDOW_WIDTH",
  APP_SET_VOLUME_WINDOW_CENTER = "APP_SET_VOLUME_WINDOW_CENTER",
  APP_SET_CAMERA_ANIMATING = "APP_SET_CAMERA_ANIMATING"
}

export interface AppSetSrcAction {
  type: TypeKeys.APP_SET_SRC;
  payload: string;
}

export const appSetSrc = (payload: string) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_SRC,
    payload: payload
  });
};

export interface AppSetSrcLoadedAction {
  type: TypeKeys.APP_SET_SRC_LOADED;
  payload: boolean;
}

export const appSetSrcLoaded = (payload: boolean) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_SRC_LOADED,
    payload: payload
  });
};

export interface AppAddNodeAction {
  type: TypeKeys.APP_ADD_NODE;
  payload: AlNodeSerial;
}

export const appAddNode = (payload: AlNodeSerial) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_ADD_NODE,
    payload: payload
  });
};

export interface AppRemoveNodeAction {
  type: TypeKeys.APP_REMOVE_NODE;
  payload: string | null;
}

export const appRemoveNode = (payload: number) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_REMOVE_NODE,
    payload: payload
  });
};

export interface AppSelectNodeAction {
  type: TypeKeys.APP_SELECT_NODE;
  payload: number;
}

export const appSelectNode = (payload: number) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SELECT_NODE,
    payload: payload
  });
};

export interface AppUpdateNodeAction {
  type: TypeKeys.APP_UPDATE_NODE;
  payload: AlNodeSerial;
}

export const appUpdateNode = (payload: AlNodeSerial) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_UPDATE_NODE,
    payload: payload
  });
};

export interface AppLoadNodesAction {
  type: TypeKeys.APP_LOAD_NODES;
  payload: any;
}

export const appLoadNodes = (payload: void) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_LOAD_NODES,
    payload: payload
  });
};

export interface AppSetDisplayModeAction {
  type: TypeKeys.APP_SET_DISPLAY_MODE;
  payload: DisplayMode;
}

export const appSetDisplayMode = (payload: DisplayMode) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_DISPLAY_MODE,
    payload: payload
  });
};

export interface AppSetOrientationAction {
  type: TypeKeys.APP_SET_ORIENTATION;
  payload: Orientation;
}

export const appSetOrientation = (payload: Orientation) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_ORIENTATION,
    payload: payload
  });
};

export interface AppSetNodesVisibleAction {
  type: TypeKeys.APP_SET_NODES_VISIBLE;
  payload: boolean;
}

export const appSetNodesVisible = (payload: boolean) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_NODES_VISIBLE,
    payload: payload
  });
};

export interface AppSetNodesEnabledAction {
  type: TypeKeys.APP_SET_NODES_ENABLED;
  payload: boolean;
}

export const appSetNodesEnabled = (payload: boolean) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_NODES_ENABLED,
    payload: payload
  });
};

export interface AppSetOptionsVisibleAction {
  type: TypeKeys.APP_SET_OPTIONS_VISIBLE;
  payload: boolean;
}

export const appSetOptionsVisible = (payload: boolean) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_OPTIONS_VISIBLE,
    payload: payload
  });
};

export interface AppSetOptionsEnabledAction {
  type: TypeKeys.APP_SET_OPTIONS_ENABLED;
  payload: boolean;
}

export const appSetOptionsEnabled = (payload: boolean) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_OPTIONS_ENABLED,
    payload: payload
  });
};

export interface AppSetBoundingBoxVisibleAction {
  type: TypeKeys.APP_SET_BOUNDINGBOX_VISIBLE;
  payload: boolean;
}

export const appSetBoundingBoxVisible = (payload: boolean) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_BOUNDINGBOX_VISIBLE,
    payload: payload
  });
};

export interface AppSetSlicesIndexAction {
  type: TypeKeys.APP_SET_SLICES_INDEX;
  payload: number;
}

export const appSetSlicesIndex = (payload: number) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_SLICES_INDEX,
    payload: payload
  });
};

export interface AppSetSlicesWindowWidthAction {
  type: TypeKeys.APP_SET_SLICES_WINDOW_WIDTH;
  payload: number;
}

export const appSetSlicesWindowWidth = (payload: number) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_SLICES_WINDOW_WIDTH,
    payload: payload
  });
};

export interface AppSetSlicesWindowCenterAction {
  type: TypeKeys.APP_SET_SLICES_WINDOW_CENTER;
  payload: number;
}

export const appSetSlicesWindowCenter = (payload: number) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_SLICES_WINDOW_CENTER,
    payload: payload
  });
};

export interface AppSetVolumeStepsAction {
  type: TypeKeys.APP_SET_VOLUME_STEPS;
  payload: number;
}

export const appSetVolumeSteps = (payload: number) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_VOLUME_STEPS,
    payload: payload
  });
};

export interface AppSetVolumeWindowWidthAction {
  type: TypeKeys.APP_SET_VOLUME_WINDOW_WIDTH;
  payload: number;
}

export const appSetVolumeWindowWidth = (payload: number) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_VOLUME_WINDOW_WIDTH,
    payload: payload
  });
};

export interface AppSetVolumeWindowCenterAction {
  type: TypeKeys.APP_SET_VOLUME_WINDOW_CENTER;
  payload: number;
}

export const appSetVolumeWindowCenter = (payload: number) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_VOLUME_WINDOW_CENTER,
    payload: payload
  });
};

export interface AppSetCameraAnimatingAction {
  type: TypeKeys.APP_SET_CAMERA_ANIMATING;
  payload: boolean;
}

export const appSetCameraAnimating = (payload: boolean) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_CAMERA_ANIMATING,
    payload: payload
  });
};
