import { ControlsType } from "../enums/ControlsType";
import { DisplayMode } from "../enums/DisplayMode";
import { Material } from "../enums/Material";
import { Orientation } from "../enums/Orientation";
import { Units } from "../enums/Units";
import { AlCamera, AlEdge } from "../interfaces";
import { AlAngle } from "../interfaces/AlAngle";
import { AlNode } from "../interfaces/AlNode";
export interface NullAction {
    type: TypeKeys.NULL;
}
export declare type ActionTypes = NullAction | AppClearAnglesAction | AppClearEdgesAction | AppClearNodesAction | AppDeleteAngleAction | AppDeleteEdgeAction | AppDeleteNodeAction | AppSelectAngleAction | AppSelectEdgeAction | AppSelectNodeAction | AppSetAngleAction | AppSetBoundingBoxEnabledAction | AppSetCameraAction | AppSetControlsEnabledAction | AppSetControlsTypeAction | AppSetDisplayModeAction | AppSetEdgeAction | AppSetGraphEnabledAction | AppSetMaterialAction | AppSetNodeAction | AppSetOrientationAction | AppSetSlicesIndexAction | AppSetSlicesMaxIndexAction | AppSetSrcAction | AppSetSrcLoadedAction | AppSetUnitsAction | AppSetVolumeStepsAction | AppSetVolumeWindowCenterAction | AppSetVolumeWindowWidthAction;
export declare enum TypeKeys {
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
    APP_SET_BOUNDINGBOX_ENABLED = "APP_SET_BOUNDINGBOX_ENABLED",
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
    APP_SET_SLICES_MAX_INDEX = "APP_SET_SLICES_MAX_INDEX",
    APP_SET_SLICES_WINDOW_CENTER = "APP_SET_SLICES_WINDOW_CENTER",
    APP_SET_SLICES_WINDOW_WIDTH = "APP_SET_SLICES_WINDOW_WIDTH",
    APP_SET_SRC = "APP_SET_SRC",
    APP_SET_SRC_LOADED = "APP_SET_SRC_LOADED",
    APP_SET_UNITS = "APP_SET_UNITS",
    APP_SET_VOLUME_STEPS = "APP_SET_VOLUME_STEPS",
    APP_SET_VOLUME_WINDOW_CENTER = "APP_SET_VOLUME_WINDOW_CENTER",
    APP_SET_VOLUME_WINDOW_WIDTH = "APP_SET_VOLUME_WINDOW_WIDTH"
}
export interface AppSetSrcAction {
    type: TypeKeys.APP_SET_SRC;
    payload: [string, DisplayMode | undefined];
}
export declare const appSetSrc: (payload: [string, DisplayMode]) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetSrcLoadedAction {
    type: TypeKeys.APP_SET_SRC_LOADED;
    payload: boolean;
}
export declare const appSetSrcLoaded: (payload: boolean) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetNodeAction {
    type: TypeKeys.APP_SET_NODE;
    payload: [string, AlNode];
}
export declare const appSetNode: (payload: [string, AlNode]) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppDeleteNodeAction {
    type: TypeKeys.APP_DELETE_NODE;
    payload: string;
}
export declare const appDeleteNode: (payload: string) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSelectNodeAction {
    type: TypeKeys.APP_SELECT_NODE;
    payload: string;
}
export declare const appSelectNode: (payload: string) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppClearNodesAction {
    type: TypeKeys.APP_CLEAR_NODES;
    payload: void;
}
export declare const appClearNodes: (payload: void) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetEdgeAction {
    type: TypeKeys.APP_SET_EDGE;
    payload: [string, AlEdge];
}
export declare const appSetEdge: (payload: [string, AlEdge]) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppDeleteEdgeAction {
    type: TypeKeys.APP_DELETE_EDGE;
    payload: string;
}
export declare const appDeleteEdge: (payload: string) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSelectEdgeAction {
    type: TypeKeys.APP_SELECT_EDGE;
    payload: string;
}
export declare const appSelectEdge: (payload: string) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppClearEdgesAction {
    type: TypeKeys.APP_CLEAR_EDGES;
    payload: void;
}
export declare const appClearEdges: (payload: void) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetAngleAction {
    type: TypeKeys.APP_SET_ANGLE;
    payload: [string, AlAngle];
}
export declare const appSetAngle: (payload: [string, AlAngle]) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppDeleteAngleAction {
    type: TypeKeys.APP_DELETE_ANGLE;
    payload: string;
}
export declare const appDeleteAngle: (payload: string) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSelectAngleAction {
    type: TypeKeys.APP_SELECT_ANGLE;
    payload: string;
}
export declare const appSelectAngle: (payload: string) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppClearAnglesAction {
    type: TypeKeys.APP_CLEAR_ANGLES;
    payload: void;
}
export declare const appClearAngles: (payload: void) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetBoundingBoxEnabledAction {
    type: TypeKeys.APP_SET_BOUNDINGBOX_ENABLED;
    payload: boolean;
}
export declare const appSetBoundingBoxEnabled: (payload: boolean) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetDisplayModeAction {
    type: TypeKeys.APP_SET_DISPLAY_MODE;
    payload: DisplayMode;
}
export declare const appSetDisplayMode: (payload: DisplayMode) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetGraphEnabledAction {
    type: TypeKeys.APP_SET_NODES_ENABLED;
    payload: boolean;
}
export declare const appSetGraphEnabled: (payload: boolean) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetMaterialAction {
    type: TypeKeys.APP_SET_MATERIAL;
    payload: Material;
}
export declare const appSetMaterial: (payload: Material) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetUnitsAction {
    type: TypeKeys.APP_SET_UNITS;
    payload: Units;
}
export declare const appSetUnits: (payload: Units) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetOrientationAction {
    type: TypeKeys.APP_SET_ORIENTATION;
    payload: Orientation;
}
export declare const appSetOrientation: (payload: Orientation) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetSlicesIndexAction {
    type: TypeKeys.APP_SET_SLICES_INDEX;
    payload: number;
}
export declare const appSetSlicesIndex: (payload: number) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetSlicesMaxIndexAction {
    type: TypeKeys.APP_SET_SLICES_MAX_INDEX;
    payload: number;
}
export declare const appSetSlicesMaxIndex: (payload: number) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetVolumeStepsAction {
    type: TypeKeys.APP_SET_VOLUME_STEPS;
    payload: number;
}
export declare const appSetVolumeSteps: (payload: number) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetVolumeWindowWidthAction {
    type: TypeKeys.APP_SET_VOLUME_WINDOW_WIDTH;
    payload: number;
}
export declare const appSetVolumeWindowWidth: (payload: number) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetVolumeWindowCenterAction {
    type: TypeKeys.APP_SET_VOLUME_WINDOW_CENTER;
    payload: number;
}
export declare const appSetVolumeWindowCenter: (payload: number) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetCameraAction {
    type: TypeKeys.APP_SET_CAMERA;
    payload: AlCamera;
}
export declare const appSetCamera: (payload: AlCamera) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetControlsEnabledAction {
    type: TypeKeys.APP_SET_CONTROLS_ENABLED;
    payload: boolean;
}
export declare const appSetControlsEnabled: (payload: boolean) => (dispatch: any, _getState: any) => Promise<any>;
export interface AppSetControlsTypeAction {
    type: TypeKeys.APP_SET_CONTROLS_TYPE;
    payload: ControlsType;
}
export declare const appSetControlsType: (payload: ControlsType) => (dispatch: any, _getState: any) => Promise<any>;
