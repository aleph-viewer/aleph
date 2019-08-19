import { AlAngle } from "../interfaces/AlAngle";
import { AlCamera, AlEdge } from "../interfaces";
import { AlNode } from "../interfaces/AlNode";
import { DisplayMode } from "../enums/DisplayMode";
import { Material } from "../enums/Material";
import { Orientation } from "../enums/Orientation";
import { Units } from "../enums/Units";
import { ControlsType } from "../enums/ControlsType";

export interface NullAction {
  type: TypeKeys.NULL;
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppClearAnglesAction
  | AppClearEdgesAction
  | AppClearNodesAction
  | AppDeleteAngleAction
  | AppDeleteEdgeAction
  | AppDeleteNodeAction
  | AppSelectAngleAction
  | AppSelectEdgeAction
  | AppSelectNodeAction
  | AppSetAngleAction
  | AppSetBoundingBoxEnabledAction
  | AppSetCameraAction
  | AppSetControlsEnabledAction
  | AppSetControlsTypeAction
  | AppSetDisplayModeAction
  | AppSetEdgeAction
  | AppSetGraphEnabledAction
  | AppSetMaterialAction
  | AppSetNodeAction
  | AppSetOrientationAction
  | AppSetSlicesIndexAction
  | AppSetSlicesWindowCenterAction
  | AppSetSlicesWindowWidthAction
  | AppSetSrcAction
  | AppSetSrcLoadedAction
  | AppSetUnitsAction
  | AppSetVolumeStepsAction
  | AppSetVolumeWindowCenterAction
  | AppSetVolumeWindowWidthAction;

export enum TypeKeys {
  NULL = "NULL",
  ERROR = "ERROR",
  APP_CLEAR_ANGLES = "APP_LOAD_ANGLES",
  APP_CLEAR_EDGES = "APP_LOAD_EDGES",
  APP_CLEAR_NODES = "APP_LOAD_NODES",
  APP_DELETE_ANGLE = "APP_DELETE_ANGLE",
  APP_DELETE_EDGE = "APP_DELETE_EDGE",
  APP_DELETE_NODE = "APP_DELETE_NODE",
  APP_SELECT_ANGLE = "APP_SELECT_ANGLE",
  APP_SELECT_EDGE = "APP_SELECT_EDGE",
  APP_SELECT_NODE = "APP_SELECT_NODE",
  APP_SET_ANGLE = "APP_SET_ANGLE",
  APP_SET_BOUNDINGBOX_VISIBLE = "APP_SET_BOUNDINGBOX_VISIBLE",
  APP_SET_CAMERA = "APP_SET_CAMERA",
  APP_SET_CONTROLS_ENABLED = "APP_SET_CONTROLS_ENABLED",
  APP_SET_CONTROLS_TYPE = "APP_SET_CONTROLS_TYPE",
  APP_SET_DISPLAY_MODE = "APP_SET_DISPLAY_MODE",
  APP_SET_EDGE = "APP_SET_EDGE",
  APP_SET_MATERIAL = "APP_SET_MATERIAL",
  APP_SET_NODE = "APP_SET_NODE",
  APP_SET_NODES_ENABLED = "APP_SET_NODES_ENABLED",
  APP_SET_ORIENTATION = "APP_SET_ORIENTATION",
  APP_SET_SLICES_INDEX = "APP_SET_SLICES_INDEX",
  APP_SET_SLICES_WINDOW_CENTER = "APP_SET_SLICES_WINDOW_CENTER",
  APP_SET_SLICES_WINDOW_WIDTH = "APP_SET_SLICES_WINDOW_WIDTH",
  APP_SET_SRC = "APP_SET_SRC",
  APP_SET_SRC_LOADED = "APP_SET_SRC_LOADED",
  APP_SET_UNITS = "APP_SET_UNITS",
  APP_SET_VOLUME_STEPS = "APP_SET_VOLUME_STEPS",
  APP_SET_VOLUME_WINDOW_CENTER = "APP_SET_VOLUME_WINDOW_CENTER",
  APP_SET_VOLUME_WINDOW_WIDTH = "APP_SET_VOLUME_WINDOW_WIDTH"
}

//#region src

export interface AppSetSrcAction {
  type: TypeKeys.APP_SET_SRC;
  payload: [string, DisplayMode | undefined];
}

export const appSetSrc = (payload: [string, DisplayMode | undefined]) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_SRC,
    payload
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
    payload
  });
};

//#endregion

//#region nodes

export interface AppSetNodeAction {
  type: TypeKeys.APP_SET_NODE;
  payload: [string, AlNode];
}

export const appSetNode = (payload: [string, AlNode]) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_NODE,
    payload
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
    payload
  });
};

export interface AppSelectNodeAction {
  type: TypeKeys.APP_SELECT_NODE;
  payload: string;
}

export const appSelectNode = (payload: string | null) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SELECT_NODE,
    payload
  });
};

export interface AppClearNodesAction {
  type: TypeKeys.APP_CLEAR_NODES;
  payload: void;
}

export const appClearNodes = (payload: void) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_CLEAR_NODES,
    payload
  });
};

//#endregion

//#region edges

export interface AppSetEdgeAction {
  type: TypeKeys.APP_SET_EDGE;
  payload: [string, AlEdge];
}

export const appSetEdge = (payload: [string, AlEdge]) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_EDGE,
    payload
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
    payload
  });
};

export interface AppSelectEdgeAction {
  type: TypeKeys.APP_SELECT_EDGE;
  payload: string;
}

export const appSelectEdge = (payload: string | null) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SELECT_EDGE,
    payload
  });
};

export interface AppClearEdgesAction {
  type: TypeKeys.APP_CLEAR_EDGES;
  payload: void;
}

export const appClearEdges = (payload: void) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_CLEAR_EDGES,
    payload
  });
};

//#endregion

//#region angles

export interface AppSetAngleAction {
  type: TypeKeys.APP_SET_ANGLE;
  payload: [string, AlAngle];
}

export const appSetAngle = (payload: [string, AlAngle]) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_ANGLE,
    payload
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
    payload
  });
};

export interface AppSelectAngleAction {
  type: TypeKeys.APP_SELECT_ANGLE;
  payload: string;
}

export const appSelectAngle = (payload: string | null) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SELECT_ANGLE,
    payload
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
    payload
  });
};

//#endregion

//#region control panel

export interface AppSetBoundingBoxEnabledAction {
  type: TypeKeys.APP_SET_BOUNDINGBOX_VISIBLE;
  payload: boolean;
}

export const appSetBoundingBoxEnabled = (payload: boolean) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_BOUNDINGBOX_VISIBLE,
    payload
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
    payload
  });
};

export interface AppSetGraphEnabledAction {
  type: TypeKeys.APP_SET_NODES_ENABLED;
  payload: boolean;
}

export const appSetGraphEnabled = (payload: boolean) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_NODES_ENABLED,
    payload
  });
};

export interface AppSetMaterialAction {
  type: TypeKeys.APP_SET_MATERIAL;
  payload: Material;
}

export const appSetMaterial = (payload: Material) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_MATERIAL,
    payload
  });
};

export interface AppSetUnitsAction {
  type: TypeKeys.APP_SET_UNITS;
  payload: Units;
}

export const appSetUnits = (payload: Units) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_UNITS,
    payload
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
    payload
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
    payload
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
    payload
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
    payload
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
    payload
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
    payload
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
    payload
  });
};

//#endregion

//#region camera

export interface AppSetCameraAction {
  type: TypeKeys.APP_SET_CAMERA;
  payload: AlCamera;
}

export const appSetCamera = (payload: AlCamera) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_CAMERA,
    payload
  });
};

export interface AppSetControlsEnabledAction {
  type: TypeKeys.APP_SET_CONTROLS_ENABLED;
  payload: boolean;
}

export const appSetControlsEnabled = (payload: boolean) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_CONTROLS_ENABLED,
    payload
  });
};

export interface AppSetControlsTypeAction {
  type: TypeKeys.APP_SET_CONTROLS_TYPE;
  payload: ControlsType;
}

export const appSetControlsType = (payload: ControlsType) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_CONTROLS_TYPE,
    payload
  });
};

//#endregion
