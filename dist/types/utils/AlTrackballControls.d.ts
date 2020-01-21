/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga 	/ http://lantiga.github.io
 */
export declare class AlTrackballControls extends THREE.EventDispatcher {
    object: any;
    target: THREE.Vector3;
    readonly up0: THREE.Vector3;
    domElement: any;
    enabled: boolean;
    screen: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    rotateSpeed: number;
    zoomSpeed: number;
    panSpeed: number;
    noRotate: boolean;
    noZoom: boolean;
    noPan: boolean;
    staticMoving: boolean;
    dynamicDampingFactor: number;
    minDistance: number;
    maxDistance: number;
    private EPS;
    private _lastPosition;
    private _state;
    private _eye;
    private _movePrev;
    private _moveCurr;
    private _lastAxis;
    private _lastAngle;
    private _zoomStart;
    private _zoomEnd;
    private _touchZoomDistanceStart;
    private _touchZoomDistanceEnd;
    private _panStart;
    private _panEnd;
    private _target0;
    private _position0;
    private _up0;
    private _changeEvent;
    private _startEvent;
    private _endEvent;
    constructor(object: any, domElement: HTMLElement | Document);
    private _bindMethods;
    private _addListeners;
    private _mouseDown;
    private _mouseMove;
    private _mouseUp;
    private _mouseWheel;
    private _touchStart;
    private _touchEnd;
    private _touchMove;
    _resize(): void;
    private _getMouseOnScreen;
    private _getMouseOnCircle;
    private _rotateCamera;
    private _zoomCamera;
    private _panCamera;
    private _checkDistances;
    update(): void;
    reset(): void;
    dispose(): void;
    private _removeListeners;
}
