import { Tool } from "../interfaces/Tool";
import { DisplayMode } from "../enums/DisplayMode";
import { Orientation } from "../enums/Orientation";
import { ToolType } from "../enums/ToolType";

export interface NullAction {
  type: TypeKeys.NULL;
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppSetSrcAction
  | AppSetSrcLoadedAction
  | AppAddToolAction
  | AppRemoveToolAction
  | AppSelectToolAction
  | AppUpdateToolAction
  | AppSaveToolsAction
  | AppSetDisplayModeAction
  | AppSetOrientationAction
  | AppSetToolsVisibleAction
  | AppSetToolsEnabledAction
  | AppSetToolTypeAction
  | AppSetOptionsVisibleAction
  | AppSetOptionsEnabledAction
  | AppSetBoundingBoxVisibleAction
  | AppSetSlicesIndexAction
  | AppSetSlicesWindowWidthAction
  | AppSetSlicesWindowCenterAction
  | AppSetVolumeStepsAction
  | AppSetVolumeWindowWidthAction
  | AppSetVolumeWindowCenterAction
  | AppSetAngleToolEnabledAction
  | AppSetAnnotationToolEnabledAction
  | AppSetRulerToolEnabledAction
;

export enum TypeKeys {
  NULL = "NULL",
  ERROR = "ERROR",
  APP_SET_SRC = "APP_SET_SRC",
  APP_SET_SRC_LOADED = "APP_SET_SRC_LOADED",
  APP_ADD_TOOL = "APP_ADD_TOOL",
  APP_REMOVE_TOOL = "APP_REMOVE_TOOL",
  APP_SELECT_TOOL = "APP_SELECT_TOOL",
  APP_UPDATE_TOOL = "APP_UPDATE_TOOL",
  APP_SAVE_TOOLS = "APP_SAVE_TOOLS",
  APP_SET_DISPLAY_MODE = "APP_SET_DISPLAY_MODE",
  APP_SET_ORIENTATION = "APP_SET_ORIENTATION",
  APP_SET_TOOLS_VISIBLE = "APP_SET_TOOLS_VISIBLE",
  APP_SET_TOOLS_ENABLED = "APP_SET_TOOLS_ENABLED",
  APP_SET_TOOL_TYPE = "APP_SET_TOOL_TYPE",
  APP_SET_OPTIONS_VISIBLE = "APP_SET_OPTIONS_VISIBLE",
  APP_SET_OPTIONS_ENABLED = "APP_SET_OPTIONS_ENABLED",
  APP_SET_BOUNDINGBOX_VISIBLE = "APP_SET_BOUNDINGBOX_VISIBLE",
  APP_SET_SLICES_INDEX = "APP_SET_SLICES_INDEX",
  APP_SET_SLICES_WINDOW_WIDTH = "APP_SET_SLICES_WINDOW_WIDTH",
  APP_SET_SLICES_WINDOW_CENTER = "APP_SET_SLICES_WINDOW_CENTER",
  APP_SET_VOLUME_STEPS = "APP_SET_VOLUME_STEPS",
  APP_SET_VOLUME_WINDOW_WIDTH = "APP_SET_VOLUME_WINDOW_WIDTH",
  APP_SET_VOLUME_WINDOW_CENTER = "APP_SET_VOLUME_WINDOW_CENTER",
  APP_SET_ANGLE_TOOL_ENABLED = "APP_SET_ANGLE_TOOL_ENABLED",
  APP_SET_ANNOTATION_TOOL_ENABLED = "APP_SET_ANNOTATION_TOOL_ENABLED",
  APP_SET_RULER_TOOL_ENABLED = "APP_SET_RULER_TOOL_ENABLED",
};

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

export interface AppAddToolAction {
  type: TypeKeys.APP_ADD_TOOL;
  payload: Tool;
}

export const appAddTool = (payload: Tool) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_ADD_TOOL,
    payload: payload
  });
};

export interface AppRemoveToolAction {
  type: TypeKeys.APP_REMOVE_TOOL;
  payload: number;
}

export const appRemoveTool = (payload: number) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_REMOVE_TOOL,
    payload: payload
  });
};

export interface AppSelectToolAction {
  type: TypeKeys.APP_SELECT_TOOL;
  payload: number;
}

export const appSelectTool = (payload: number) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SELECT_TOOL,
    payload: payload
  });
};

export interface AppUpdateToolAction {
  type: TypeKeys.APP_UPDATE_TOOL;
  payload: Tool;
}

export const appUpdateTool = (payload: Tool) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_UPDATE_TOOL,
    payload: payload
  });
};

export interface AppSaveToolsAction {
  type: TypeKeys.APP_SAVE_TOOLS;
  payload: void;
}

export const appSaveTools = (payload: void) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SAVE_TOOLS,
    payload: payload
  });
};

export interface AppSetDisplayModeAction {
  type: TypeKeys.APP_SET_DISPLAY_MODE,
  payload: DisplayMode;
}

export const appSetDisplayMode = (payload: DisplayMode) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_DISPLAY_MODE,
    payload: payload
  });
};

export interface AppSetOrientationAction {
  type: TypeKeys.APP_SET_ORIENTATION,
  payload: Orientation;
}

export const appSetOrientation = (payload: Orientation) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_ORIENTATION,
    payload: payload
  });
};

export interface AppSetToolsVisibleAction {
  type: TypeKeys.APP_SET_TOOLS_VISIBLE,
  payload: boolean;
}

export const appSetToolsVisible = (payload: boolean) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_TOOLS_VISIBLE,
    payload: payload
  });
};

export interface AppSetToolsEnabledAction {
  type: TypeKeys.APP_SET_TOOLS_ENABLED,
  payload: boolean;
}

export const appSetToolsEnabled = (payload: boolean) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_TOOLS_ENABLED,
    payload: payload
  });
};

export interface AppSetToolTypeAction {
  type: TypeKeys.APP_SET_TOOL_TYPE,
  payload: ToolType;
}

export const appSetToolType = (payload: ToolType) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_TOOL_TYPE,
    payload: payload
  });
};

export interface AppSetOptionsVisibleAction {
  type: TypeKeys.APP_SET_OPTIONS_VISIBLE,
  payload: boolean;
}

export const appSetOptionsVisible = (payload: boolean) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_OPTIONS_VISIBLE,
    payload: payload
  });
};

export interface AppSetOptionsEnabledAction {
  type: TypeKeys.APP_SET_OPTIONS_ENABLED,
  payload: boolean;
}

export const appSetOptionsEnabled = (payload: boolean) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_OPTIONS_ENABLED,
    payload: payload
  });
};

export interface AppSetBoundingBoxVisibleAction {
  type: TypeKeys.APP_SET_BOUNDINGBOX_VISIBLE,
  payload: boolean;
}

export const appSetBoundingBoxVisible = (payload: boolean) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_BOUNDINGBOX_VISIBLE,
    payload: payload
  });
};

export interface AppSetSlicesIndexAction {
  type: TypeKeys.APP_SET_SLICES_INDEX,
  payload: number;
}

export const appSetSlicesIndex = (payload: number) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_SLICES_INDEX,
    payload: payload
  });
};

export interface AppSetSlicesWindowWidthAction {
  type: TypeKeys.APP_SET_SLICES_WINDOW_WIDTH,
  payload: number;
}

export const appSetSlicesWindowWidth = (payload: number) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_SLICES_WINDOW_WIDTH,
    payload: payload
  });
};

export interface AppSetSlicesWindowCenterAction {
  type: TypeKeys.APP_SET_SLICES_WINDOW_CENTER,
  payload: number;
}

export const appSetSlicesWindowCenter = (payload: number) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_SLICES_WINDOW_CENTER,
    payload: payload
  });
};

export interface AppSetVolumeStepsAction {
  type: TypeKeys.APP_SET_VOLUME_STEPS,
  payload: number;
}

export const appSetVolumeSteps = (payload: number) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_VOLUME_STEPS,
    payload: payload
  });
};

export interface AppSetVolumeWindowWidthAction {
  type: TypeKeys.APP_SET_VOLUME_WINDOW_WIDTH,
  payload: number;
}

export const appSetVolumeWindowWidth = (payload: number) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_VOLUME_WINDOW_WIDTH,
    payload: payload
  });
};

export interface AppSetVolumeWindowCenterAction {
  type: TypeKeys.APP_SET_VOLUME_WINDOW_CENTER,
  payload: number;
}

export const appSetVolumeWindowCenter = (payload: number) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_VOLUME_WINDOW_CENTER,
    payload: payload
  });
};

export interface AppSetAngleToolEnabledAction {
  type: TypeKeys.APP_SET_ANGLE_TOOL_ENABLED,
  payload: boolean;
}

export const appSetAngleToolEnabled = (payload: boolean) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_ANGLE_TOOL_ENABLED,
    payload: payload
  });
};

export interface AppSetAnnotationToolEnabledAction {
  type: TypeKeys.APP_SET_ANNOTATION_TOOL_ENABLED,
  payload: boolean;
}

export const appSetAnnotationToolEnabled = (payload: boolean) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_ANNOTATION_TOOL_ENABLED,
    payload: payload
  });
};

export interface AppSetRulerToolEnabledAction {
  type: TypeKeys.APP_SET_RULER_TOOL_ENABLED,
  payload: boolean;
}

export const appSetRulerToolEnabled = (payload: boolean) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_SET_RULER_TOOL_ENABLED,
    payload: payload
  });
};
