/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga 	/ http://lantiga.github.io
 */

// Possible states for control component
const AlTrackballState = {
  NONE: -1,
  ROTATE: 0,
  ZOOM: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_ZOOM_PAN: 4
};

// Mouse button binds to actions
const AlMouseButtons = {
  ROTATE: THREE.MOUSE.LEFT,
  ZOOM: THREE.MOUSE.MIDDLE,
  PAN: THREE.MOUSE.RIGHT
};

export class AlTrackballControls extends THREE.EventDispatcher {
  public object;
  public target: THREE.Vector3;

  public get up0(): THREE.Vector3 {
    return this._up0.clone();
  }

  // tslint:disable-next-line: no-any
  public domElement: any;

  // API
  public enabled: boolean;
  public screen = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  };
  public rotateSpeed: number;
  public zoomSpeed: number;
  public panSpeed: number;

  public noRotate: boolean;
  public noZoom: boolean;
  public noPan: boolean;

  public staticMoving: boolean;
  public dynamicDampingFactor: number;
  public minDistance: number;
  public maxDistance: number;
  // ===============================
  private EPS: number;
  private _lastPosition: THREE.Vector3;

  private _state: number;
  private _eye: THREE.Vector3;
  private _movePrev: THREE.Vector2;
  private _moveCurr: THREE.Vector2;
  private _lastAxis: THREE.Vector3;
  private _lastAngle: number;
  private _zoomStart: THREE.Vector2;
  private _zoomEnd: THREE.Vector2;
  private _touchZoomDistanceStart: number;
  private _touchZoomDistanceEnd: number;
  private _panStart: THREE.Vector2;
  private _panEnd: THREE.Vector2;

  private _target0: THREE.Vector3;
  private _position0: THREE.Vector3;
  private _up0: THREE.Vector3;

  // events
  private _changeEvent = { type: 'change' };
  private _startEvent = { type: 'start' };
  private _endEvent = { type: 'end' };

  // tslint:disable-next-line: no-any
  constructor(object: any, domElement: HTMLElement | Document) {
    super();

    this.object = object;
    this.domElement = domElement !== undefined ? domElement : document;

    // ======== API ========
    this.enabled = true;
    this.screen = { left: 0, top: 0, width: 0, height: 0 };

    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.2;
    this.panSpeed = 0.3;

    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;

    this.staticMoving = false;
    this.dynamicDampingFactor = 0.2;

    this.minDistance = 0;
    this.maxDistance = Infinity;
    // =====================

    // ===== internals =====

    // for reset
    this.target = new THREE.Vector3();
    this.EPS = 0.000001;
    this._lastPosition = new THREE.Vector3();

    this._state = AlTrackballState.NONE;
    this._eye = new THREE.Vector3();
    this._movePrev = new THREE.Vector2();
    this._moveCurr = new THREE.Vector2();
    this._lastAxis = new THREE.Vector3();
    this._lastAngle = 0;
    this._zoomStart = new THREE.Vector2();
    this._zoomEnd = new THREE.Vector2();
    this._touchZoomDistanceStart = 0;
    this._touchZoomDistanceEnd = 0;
    this._panStart = new THREE.Vector2();
    this._panEnd = new THREE.Vector2();

    this._target0 = this.target.clone();
    this._position0 = this.object.position.clone();
    this._up0 = this.object.up.clone();

    this._bindMethods();
    this._addListeners();
    this.update();
  }

  private _bindMethods() {
    this._mouseDown = this._mouseDown.bind(this);
    this._mouseMove = this._mouseMove.bind(this);
    this._mouseUp = this._mouseUp.bind(this);
    this._mouseWheel = this._mouseWheel.bind(this);
    this._touchStart = this._touchStart.bind(this);
    this._touchEnd = this._touchEnd.bind(this);
    this._touchMove = this._touchMove.bind(this);
    this._resize = this._resize.bind(this);
  }

  private _addListeners() {
    this.domElement.addEventListener('mousedown', this._mouseDown, {
      capture: false,
      once: false,
      passive: true
    });
    window.addEventListener('mousemove', this._mouseMove, {
      capture: false,
      once: false,
      passive: true
    });
    window.addEventListener('mouseup', this._mouseUp, {
      capture: false,
      once: false,
      passive: true
    });
    this.domElement.addEventListener('wheel', this._mouseWheel, {
      capture: false,
      once: false,
      passive: true
    });

    this.domElement.addEventListener('touchstart', this._touchStart, {
      capture: false,
      once: false,
      passive: true
    });
    window.addEventListener('touchend', this._touchEnd, {
      capture: false,
      once: false,
      passive: true
    });
    window.addEventListener('touchmove', this._touchMove, {
      capture: false,
      once: false,
      passive: true
    });
  }

  private _mouseDown(event: MouseEvent) {
    if (this.enabled === false) {
      return;
    }

    if (this._state === AlTrackballState.NONE) {
      switch (event.button) {
        case AlMouseButtons.ROTATE:
          this._state = AlTrackballState.ROTATE;
          if (!this.noRotate) {
            this._moveCurr.copy(
              this._getMouseOnCircle(event.pageX, event.pageY)
            );
            this._movePrev.copy(this._moveCurr);
          }
          break;

        case AlMouseButtons.ZOOM:
          this._state = AlTrackballState.ZOOM;
          if (!this.noZoom) {
            this._zoomStart.copy(
              this._getMouseOnScreen(event.pageX, event.pageY)
            );
            this._zoomEnd.copy(this._zoomStart);
          }
          break;

        case AlMouseButtons.PAN:
          this._state = AlTrackballState.PAN;
          if (!this.noPan) {
            this._panStart.copy(
              this._getMouseOnScreen(event.pageX, event.pageY)
            );
            this._panEnd.copy(this._panStart);
          }
          break;

        default:
          this._state = AlTrackballState.NONE;
      }
    }

    this.dispatchEvent(this._startEvent);
    this.update();
  }

  private _mouseMove(event: MouseEvent) {
    if (this.enabled === false) {
      return;
    }

    if (this._state === AlTrackballState.ROTATE && !this.noRotate) {
      this._movePrev.copy(this._moveCurr);
      this._moveCurr.copy(this._getMouseOnCircle(event.pageX, event.pageY));
    } else if (this._state === AlTrackballState.ZOOM && !this.noZoom) {
      this._zoomEnd.copy(this._getMouseOnScreen(event.pageX, event.pageY));
    } else if (this._state === AlTrackballState.PAN && !this.noPan) {
      this._panEnd.copy(this._getMouseOnScreen(event.pageX, event.pageY));
    }
    this.update();
  }

  private _mouseUp(_event: MouseEvent) {
    if (this.enabled === false) {
      return;
    }

    this._state = AlTrackballState.NONE;

    this.dispatchEvent(this._endEvent);
    this.update();
  }

  private _mouseWheel(event: WheelEvent) {
    if (this.enabled === false || this.noZoom === true) {
      return;
    }
    switch (event.deltaMode) {
      case 2:
        // Zoom in pages
        this._zoomStart.y -= event.deltaY * 0.025;
        break;

      case 1:
        // Zoom in lines
        this._zoomStart.y -= event.deltaY * 0.01;
        break;

      default:
        // undefined, 0, assume pixels
        this._zoomStart.y -= event.deltaY * 0.00025;
        break;
    }

    this.dispatchEvent(this._startEvent);
    this.dispatchEvent(this._endEvent);
    this.update();
  }

  private _touchStart(event: TouchEvent) {
    if (this.enabled === false) {
      return;
    }
    switch (event.touches.length) {
      case 1:
        this._state = AlTrackballState.TOUCH_ROTATE;
        this._moveCurr.copy(
          this._getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY)
        );
        this._movePrev.copy(this._moveCurr);
        break;

      default:
        // 2 or more
        this._state = AlTrackballState.TOUCH_ZOOM_PAN;
        const dx = event.touches[0].pageX - event.touches[1].pageX;
        const dy = event.touches[0].pageY - event.touches[1].pageY;
        this._touchZoomDistanceEnd = this._touchZoomDistanceStart = Math.sqrt(
          dx * dx + dy * dy
        );

        const x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
        const y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
        this._panStart.copy(this._getMouseOnScreen(x, y));
        this._panEnd.copy(this._panStart);
        break;
    }

    this.dispatchEvent(this._startEvent);
    this.update();
  }

  private _touchEnd(event: TouchEvent) {
    if (this.enabled === false) {
      return;
    }

    switch (event.touches.length) {
      case 0:
        this._state = AlTrackballState.NONE;
        break;

      case 1:
        this._state = AlTrackballState.TOUCH_ROTATE;
        this._moveCurr.copy(
          this._getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY)
        );
        this._movePrev.copy(this._moveCurr);
        break;
      default: {
        break;
      }
    }

    this.dispatchEvent(this._endEvent);
    this.update();
  }

  private _touchMove(event: TouchEvent) {
    if (this.enabled === false) {
      return;
    }

    switch (event.touches.length) {
      case 1:
        this._movePrev.copy(this._moveCurr);
        this._moveCurr.copy(
          this._getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY)
        );
        break;

      default:
        // 2 or more
        const dx = event.touches[0].pageX - event.touches[1].pageX;
        const dy = event.touches[0].pageY - event.touches[1].pageY;
        this._touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

        const x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
        const y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
        this._panEnd.copy(this._getMouseOnScreen(x, y));
        break;
    }
    this.update();
  }
  public _resize() {
    if (this.domElement === document) {
      this.screen.left = 0;
      this.screen.top = 0;
      this.screen.width = window.innerWidth;
      this.screen.height = window.innerHeight;
    } else {
      const box = this.domElement.getBoundingClientRect();
      // adjustments come from similar code in the jquery offset() function
      const d = this.domElement.ownerDocument.documentElement;
      this.screen.left = box.left + window.pageXOffset - d.clientLeft;
      this.screen.top = box.top + window.pageYOffset - d.clientTop;
      this.screen.width = box.width;
      this.screen.height = box.height;
    }
  }

  private _getMouseOnScreen(pageX: number, pageY: number): THREE.Vector2 {
    const vector = new THREE.Vector2();
    vector.set(
      (pageX - this.screen.left) / this.screen.width,
      (pageY - this.screen.top) / this.screen.height
    );

    return vector;
  }

  private _getMouseOnCircle(pageX: number, pageY: number): THREE.Vector2 {
    const vector = new THREE.Vector2();
    vector.set(
      (pageX - this.screen.width * 0.5 - this.screen.left) /
        (this.screen.width * 0.5),
      (this.screen.height + 2 * (this.screen.top - pageY)) / this.screen.width // screen.width intentional
    );
    return vector;
  }

  private _rotateCamera() {
    const axis = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const eyeDirection = new THREE.Vector3();
    const objectUpDirection = new THREE.Vector3();
    const objectSidewaysDirection = new THREE.Vector3();
    const moveDirection = new THREE.Vector3();
    let angle;

    moveDirection.set(
      this._moveCurr.x - this._movePrev.x,
      this._moveCurr.y - this._movePrev.y,
      0
    );
    angle = moveDirection.length();

    if (angle) {
      this._eye.copy(this.object.position).sub(this.target);

      eyeDirection.copy(this._eye).normalize();
      objectUpDirection.copy(this.object.up).normalize();
      objectSidewaysDirection
        .crossVectors(objectUpDirection, eyeDirection)
        .normalize();

      objectUpDirection.setLength(this._moveCurr.y - this._movePrev.y);
      objectSidewaysDirection.setLength(this._moveCurr.x - this._movePrev.x);

      moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));

      axis.crossVectors(moveDirection, this._eye).normalize();

      angle *= this.rotateSpeed;
      quaternion.setFromAxisAngle(axis, angle);

      this._eye.applyQuaternion(quaternion);
      this.object.up.applyQuaternion(quaternion);

      this._lastAxis.copy(axis);
      this._lastAngle = angle;
    } else if (!this.staticMoving && this._lastAngle) {
      this._lastAngle *= Math.sqrt(1.0 - this.dynamicDampingFactor);
      this._eye.copy(this.object.position).sub(this.target);
      quaternion.setFromAxisAngle(this._lastAxis, this._lastAngle);
      this._eye.applyQuaternion(quaternion);
      this.object.up.applyQuaternion(quaternion);
    }

    this._movePrev.copy(this._moveCurr);
  }

  private _zoomCamera() {
    let factor;

    if (this._state === AlTrackballState.TOUCH_ZOOM_PAN) {
      factor = this._touchZoomDistanceStart / this._touchZoomDistanceEnd;
      this._touchZoomDistanceStart = this._touchZoomDistanceEnd;
      this._eye.multiplyScalar(factor);
    } else {
      factor = 1.0 + (this._zoomEnd.y - this._zoomStart.y) * this.zoomSpeed;

      if (factor !== 1.0 && factor > 0.0) {
        this._eye.multiplyScalar(factor);
      }

      if (this.staticMoving) {
        this._zoomStart.copy(this._zoomEnd);
      } else {
        this._zoomStart.y +=
          (this._zoomEnd.y - this._zoomStart.y) * this.dynamicDampingFactor;
      }
    }
  }

  private _panCamera() {
    const mouseChange = new THREE.Vector2();
    const objectUp = new THREE.Vector3();
    const pan = new THREE.Vector3();
    mouseChange.copy(this._panEnd).sub(this._panStart);

    if (mouseChange.lengthSq()) {
      mouseChange.multiplyScalar(this._eye.length() * this.panSpeed);

      pan
        .copy(this._eye)
        .cross(this.object.up)
        .setLength(mouseChange.x);
      pan.add(objectUp.copy(this.object.up).setLength(mouseChange.y));

      this.object.position.add(pan);
      this.target.add(pan);

      if (this.staticMoving) {
        this._panStart.copy(this._panEnd);
      } else {
        this._panStart.add(
          mouseChange
            .subVectors(this._panEnd, this._panStart)
            .multiplyScalar(this.dynamicDampingFactor)
        );
      }
    }
  }

  private _checkDistances() {
    if (!this.noZoom || !this.noPan) {
      if (this._eye.lengthSq() > this.maxDistance * this.maxDistance) {
        this.object.position.addVectors(
          this.target,
          this._eye.setLength(this.maxDistance)
        );
        this._zoomStart.copy(this._zoomEnd);
      }

      if (this._eye.lengthSq() < this.minDistance * this.minDistance) {
        this.object.position.addVectors(
          this.target,
          this._eye.setLength(this.minDistance)
        );
        this._zoomStart.copy(this._zoomEnd);
      }
    }
  }

  public update() {
    this._eye.subVectors(this.object.position, this.target);

    if (!this.noRotate) {
      this._rotateCamera();
    }
    if (!this.noZoom) {
      this._zoomCamera();
    }
    if (!this.noPan) {
      this._panCamera();
    }

    this.object.position.addVectors(this.target, this._eye);
    this._checkDistances();
    this.object.lookAt(this.target);

    if (this._lastPosition.distanceToSquared(this.object.position) > this.EPS) {
      this.dispatchEvent(this._changeEvent);
      this._lastPosition.copy(this.object.position);
    }
  }

  public reset() {
    this._state = AlTrackballState.NONE;

    this.target.copy(this._target0);
    this.object.position.copy(this._position0);
    this.object.up.copy(this._up0);
    this._eye.subVectors(this.object.position, this.target);
    this.object.lookAt(this.target);

    this.dispatchEvent(this._changeEvent);
    this._lastPosition.copy(this.object.position);
  }

  public dispose() {
    this._removeListeners();
  }

  private _removeListeners() {
    this.domElement.removeEventListener('mousedown', this._mouseDown, false);
    window.removeEventListener('mousemove', this._mouseMove, false);
    window.removeEventListener('mouseup', this._mouseUp, false);
    this.domElement.removeEventListener('wheel', this._mouseWheel, false);

    this.domElement.removeEventListener('touchstart', this._touchStart, false);
    window.removeEventListener('touchend', this._touchEnd, false);
    window.removeEventListener('touchmove', this._touchMove, false);
  }
}
