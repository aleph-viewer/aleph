import { Component, Prop, State } from '@stencil/core';
import { Store, Action } from '@stencil/redux';
import { appSetBoxEnabled, appSetSphereEnabled, appSetCylinderEnabled } from '../../redux/actions';
import { configureStore } from '../../redux/store';
//type Entity = import('aframe').Entity;

@Component({
  tag: 'uv-aleph',
  styleUrl: 'aleph.css',
  shadow: true
})
export class Aleph {

  private _canvasContainer: HTMLElement;

  @Prop({ context: 'store' }) store: Store;

  appSetBoxEnabled: Action;
  appSetSphereEnabled: Action;
  appSetCylinderEnabled: Action;

  @State() boxEnabled: number;
  @State() sphereEnabled: number;
  @State() cylinderEnabled: number;

  componentWillLoad() {

    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, (state) => {
      const {
        app: {
          boxEnabled,
          sphereEnabled,
          cylinderEnabled
        }
      } = state;

      return {
        boxEnabled,
        sphereEnabled,
        cylinderEnabled
      }
    });

    this.store.mapDispatchToProps(this, {
      appSetBoxEnabled,
      appSetSphereEnabled,
      appSetCylinderEnabled
    });
  }

  private _renderAFrame(): JSX.Element {
    return (
      <a-scene background="color: #ECECEC">
        {
          this.boxEnabled ? <a-entity id='box' geometry="primitive: box;" position="-1 0.5 -3" rotation="0 45 0" material="color: #4CC3D9" shadow></a-entity> : null
        }
        {
          this.sphereEnabled ? <a-entity geometry="primitive: sphere;" position="0 1.25 -5" radius="1.25" material="color: #EF2D5E" shadow></a-entity> : null
        }
        {
          this.cylinderEnabled ? <a-entity geometry="primitive: cylinder;" position="1 0.75 -3" radius="0.5" height="1.5" material="color: #FFC65D" shadow></a-entity> : null
        }
        <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4" shadow></a-plane>
      </a-scene>
    )
  }

  private _renderControlPanel(): JSX.Element {
    return (
      <ion-app id="control-panel">
        <ion-item>
          <ion-label>box</ion-label>
          <ion-toggle checked={this.boxEnabled} onIonChange={(e) => this.appSetBoxEnabled(e.detail.checked)}></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>sphere</ion-label>
          <ion-toggle checked={this.sphereEnabled} onIonChange={(e) => this.appSetSphereEnabled(e.detail.checked)}></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>cylinder</ion-label>
          <ion-toggle checked={this.cylinderEnabled} onIonChange={(e) => this.appSetCylinderEnabled(e.detail.checked)}></ion-toggle>
        </ion-item>
      </ion-app>
    )
  }

  render() {
    console.log(this._canvasContainer);
    return (
      <div ref={(el) => this._canvasContainer = el as HTMLElement}>
        {this._renderAFrame()}
        {this._renderControlPanel()}
      </div>
    )
  }

}
