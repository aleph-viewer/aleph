export var TypeKeys;
(function (TypeKeys) {
    TypeKeys["NULL"] = "NULL";
    TypeKeys["ERROR"] = "ERROR";
    TypeKeys["APP_CLEAR_ANGLES"] = "APP_LOAD_ANGLES";
    TypeKeys["APP_CLEAR_EDGES"] = "APP_LOAD_EDGES";
    TypeKeys["APP_CLEAR_NODES"] = "APP_LOAD_NODES";
    TypeKeys["APP_DELETE_ANGLE"] = "APP_DELETE_ANGLE";
    TypeKeys["APP_DELETE_EDGE"] = "APP_DELETE_EDGE";
    TypeKeys["APP_DELETE_NODE"] = "APP_DELETE_NODE";
    TypeKeys["APP_SELECT_ANGLE"] = "APP_SELECT_ANGLE";
    TypeKeys["APP_SELECT_EDGE"] = "APP_SELECT_EDGE";
    TypeKeys["APP_SELECT_NODE"] = "APP_SELECT_NODE";
    TypeKeys["APP_SET_ANGLE"] = "APP_SET_ANGLE";
    TypeKeys["APP_SET_BOUNDINGBOX_ENABLED"] = "APP_SET_BOUNDINGBOX_ENABLED";
    TypeKeys["APP_SET_CAMERA"] = "APP_SET_CAMERA";
    TypeKeys["APP_SET_CONTROLS_ENABLED"] = "APP_SET_CONTROLS_ENABLED";
    TypeKeys["APP_SET_CONTROLS_TYPE"] = "APP_SET_CONTROLS_TYPE";
    TypeKeys["APP_SET_DISPLAY_MODE"] = "APP_SET_DISPLAY_MODE";
    TypeKeys["APP_SET_EDGE"] = "APP_SET_EDGE";
    TypeKeys["APP_SET_MATERIAL"] = "APP_SET_MATERIAL";
    TypeKeys["APP_SET_NODE"] = "APP_SET_NODE";
    TypeKeys["APP_SET_NODES_ENABLED"] = "APP_SET_NODES_ENABLED";
    TypeKeys["APP_SET_ORIENTATION"] = "APP_SET_ORIENTATION";
    TypeKeys["APP_SET_SLICES_INDEX"] = "APP_SET_SLICES_INDEX";
    TypeKeys["APP_SET_SLICES_MAX_INDEX"] = "APP_SET_SLICES_MAX_INDEX";
    TypeKeys["APP_SET_SLICES_WINDOW_CENTER"] = "APP_SET_SLICES_WINDOW_CENTER";
    TypeKeys["APP_SET_SLICES_WINDOW_WIDTH"] = "APP_SET_SLICES_WINDOW_WIDTH";
    TypeKeys["APP_SET_SRC"] = "APP_SET_SRC";
    TypeKeys["APP_SET_SRC_LOADED"] = "APP_SET_SRC_LOADED";
    TypeKeys["APP_SET_UNITS"] = "APP_SET_UNITS";
    TypeKeys["APP_SET_VOLUME_STEPS"] = "APP_SET_VOLUME_STEPS";
    TypeKeys["APP_SET_VOLUME_WINDOW_CENTER"] = "APP_SET_VOLUME_WINDOW_CENTER";
    TypeKeys["APP_SET_VOLUME_WINDOW_WIDTH"] = "APP_SET_VOLUME_WINDOW_WIDTH";
})(TypeKeys || (TypeKeys = {}));
export const appSetSrc = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_SRC,
        payload
    });
};
export const appSetSrcLoaded = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_SRC_LOADED,
        payload
    });
};
export const appSetNode = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_NODE,
        payload
    });
};
export const appDeleteNode = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_DELETE_NODE,
        payload
    });
};
export const appSelectNode = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SELECT_NODE,
        payload
    });
};
export const appClearNodes = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_CLEAR_NODES,
        payload
    });
};
export const appSetEdge = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_EDGE,
        payload
    });
};
export const appDeleteEdge = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_DELETE_EDGE,
        payload
    });
};
export const appSelectEdge = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SELECT_EDGE,
        payload
    });
};
export const appClearEdges = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_CLEAR_EDGES,
        payload
    });
};
export const appSetAngle = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_ANGLE,
        payload
    });
};
export const appDeleteAngle = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_DELETE_ANGLE,
        payload
    });
};
export const appSelectAngle = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SELECT_ANGLE,
        payload
    });
};
export const appClearAngles = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_CLEAR_ANGLES,
        payload
    });
};
export const appSetBoundingBoxEnabled = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_BOUNDINGBOX_ENABLED,
        payload
    });
};
export const appSetDisplayMode = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_DISPLAY_MODE,
        payload
    });
};
export const appSetGraphEnabled = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_NODES_ENABLED,
        payload
    });
};
export const appSetMaterial = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_MATERIAL,
        payload
    });
};
export const appSetUnits = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_UNITS,
        payload
    });
};
export const appSetOrientation = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_ORIENTATION,
        payload
    });
};
export const appSetSlicesIndex = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_SLICES_INDEX,
        payload
    });
};
export const appSetSlicesMaxIndex = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_SLICES_MAX_INDEX,
        payload
    });
};
export const appSetVolumeSteps = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_VOLUME_STEPS,
        payload
    });
};
export const appSetVolumeWindowWidth = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_VOLUME_WINDOW_WIDTH,
        payload
    });
};
export const appSetVolumeWindowCenter = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_VOLUME_WINDOW_CENTER,
        payload
    });
};
export const appSetCamera = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_CAMERA,
        payload
    });
};
export const appSetControlsEnabled = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_CONTROLS_ENABLED,
        payload
    });
};
export const appSetControlsType = (payload) => async (dispatch, _getState) => {
    return dispatch({
        type: TypeKeys.APP_SET_CONTROLS_TYPE,
        payload
    });
};
//#endregion
