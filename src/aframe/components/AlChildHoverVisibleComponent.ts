import { Entity } from 'aframe';
import { Constants } from '../../Constants';
import { BaseComponent } from './BaseComponent';

interface AlChildHoverVisibleComponent extends BaseComponent {
  tickFunction(): void;
  pointerOver(_event: CustomEvent): void;
  pointerOut(_event: CustomEvent): void;
}

export default AFRAME.registerComponent('al-child-hover-visible', {
  schema: {},

  init(): void {
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      Constants.minFrameMS,
      this
    );
    this.bindMethods();
    this.addEventListeners();

    this.hovered = false;
  },

  bindMethods(): void {
    this.pointerOver = this.pointerOver.bind(this);
    this.pointerOut = this.pointerOut.bind(this);
  },

  addEventListeners(): void {
    this.el.addEventListener('raycaster-intersected', this.pointerOver, {
      capture: true,
      once: false,
      passive: true
    });
    this.el.addEventListener('raycaster-intersected-cleared', this.pointerOut, {
      capture: false,
      once: false,
      passive: true
    });
  },

  removeEventListeners(): void {
    this.el.removeEventListener('raycaster-intersected', this.pointerOver);
    this.el.removeEventListener(
      'raycaster-intersected-cleared',
      this.pointerOut
    );
  },

  pointerOver(_event: CustomEvent): void {
    this.hovered = true;
  },

  pointerOut(_event: CustomEvent): void {
    this.hovered = false;
  },

  tickFunction(): void {
    const el = this.el;
    const firstChild: Entity = el.firstChild.firstChild;

    if (firstChild) {
      const obj3d: THREE.Object3D = firstChild.object3D;

      // show/hide label
      if (this.hovered) {
        obj3d.visible = true;
      } else {
        obj3d.visible = false;
      }
    }
  },

  tick() {
    this.tickFunction();
  },

  remove(): void {
    this.removeEventListeners();
  }
} as AlChildHoverVisibleComponent);
