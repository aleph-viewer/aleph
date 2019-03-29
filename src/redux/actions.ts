import { AlNodeSerial } from "../interfaces/AlNodeSerial";
import { DisplayMode } from "../enums/DisplayMode";
import { Orientation } from "../enums/Orientation";
import { AlEdgeSerial } from "../interfaces";
import { AlAngleSerial } from "../interfaces/AlAngleSerial";

export interface NullAction {
  type: TypeKeys.NULL;
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppSetSrcAction
  | AppSetSrcLoadedAction
  | AppSetNodeAction
  | AppDeleteNodeAction
  | AppSelectNodeAction
  | AppClearNodesAction
  | AppSetEdgeAction
  | AppDeleteEdgeAction
  | AppSelectEdgeAction
  | AppClearEdgesAction
  | AppSetAngleAction
  | AppDeleteAngleAction
  | AppSelectAngleAction
  | AppClearAnglesAction
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
  APP_SET_NODE = "APP_SET_NODE",
  APP_DELETE_NODE = "APP_DELETE_NODE",
  APP_SELECT_NODE = "APP_SELECT_NODE",
  APP_CLEAR_NODES = "APP_LOAD_NODES",
  APP_SET_EDGE = "APP_SET_EDGE",
  APP_DELETE_EDGE = "APP_DELETE_EDGE",
  APP_SELECT_EDGE = "APP_SELECT_EDGE",
  APP_CLEAR_EDGES = "APP_LOAD_EDGES",
  APP_SET_ANGLE = "APP_SET_ANGLE",
  APP_DELETE_ANGLE = "APP_DELETE_ANGLE",
  APP_SELECT_ANGLE = "APP_SELECT_ANGLE",
  APP_CLEAR_ANGLES = "APP_LOAD_ANGLES",
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

//#region src

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

//#endregion

//#region nodes

export interface AppSetNodeAction {
  type: TypeKeys.APP_SET_NODE;
  payload: [string, AlNodeSerial];
}

export const appSetNode = (payload: [string, AlNodeSerial]) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_NODE,
    payload: payload
  });
};

export interface AppDeleteNodeAction {
  type: TypeKeys.APP_DELETE_NODE;
  payload: string;
}

export const appDeleteNode = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_DELETE_NODE,
    payload: payload
  });
};

export interface AppSelectNodeAction {
  type: TypeKeys.APP_SELECT_NODE;
  payload: string;
}

export const appSelectNode = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SELECT_NODE,
    payload: payload
  });
};

export interface AppClearNodesAction {
  type: TypeKeys.APP_CLEAR_NODES;
  payload: void;
}

export const appClearNodes = (payload: void) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_CLEAR_NODES,
    payload: payload
  });
};

//#endregion

//#region edges

export interface AppSetEdgeAction {
  type: TypeKeys.APP_SET_EDGE;
  payload: [string, AlEdgeSerial];
}

export const appSetEdge = (payload: [string, AlEdgeSerial]) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_EDGE,
    payload: payload
  });
};

export interface AppDeleteEdgeAction {
  type: TypeKeys.APP_DELETE_EDGE;
  payload: string;
}

export const appDeleteEdge = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_DELETE_EDGE,
    payload: payload
  });
};

export interface AppSelectEdgeAction {
  type: TypeKeys.APP_SELECT_EDGE;
  payload: string;
}

export const appSelectEdge = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SELECT_EDGE,
    payload: payload
  });
};

export interface AppClearEdgesAction {
  type: TypeKeys.APP_CLEAR_EDGES;
  payload: void;
}

export const appClearEdges = (payload: void) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_CLEAR_EDGES,
    payload: payload
  });
};

//#endregion

//#region angles

export interface AppSetAngleAction {
  type: TypeKeys.APP_SET_ANGLE;
  payload: [string, AlAngleSerial];
}

export const appSetAngle = (payload: [string, AlAngleSerial]) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_ANGLE,
    payload: payload
  });
};

export interface AppDeleteAngleAction {
  type: TypeKeys.APP_DELETE_ANGLE;
  payload: string;
}

export const appDeleteAngle = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_DELETE_ANGLE,
    payload: payload
  });
};

export interface AppSelectAngleAction {
  type: TypeKeys.APP_SELECT_ANGLE;
  payload: string;
}

export const appSelectAngle = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SELECT_ANGLE,
    payload: payload
  });
};

export interface AppClearAnglesAction {
  type: TypeKeys.APP_CLEAR_ANGLES;
  payload: void;
}

export const appClearAngles = (payload: void) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_CLEAR_ANGLES,
    payload: payload
  });
};

//#endregion

//#region control panel
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

//#endregion

//#region volumes

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

//#endregion

//#region animation

export const appSetCameraAnimating = (payload: boolean) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_CAMERA_ANIMATING,
    payload: payload
  });
};

//#endregion
