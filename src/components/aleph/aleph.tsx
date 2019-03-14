import { Component, Prop, State } from '@stencil/core';
import { Store, Action } from '@stencil/redux';
import { appSetBoxEnabled, appSetCubes } from '../../redux/actions';
import { configureStore } from '../../redux/store';
import { Utils } from '../../utils/Utlis';
import { Cube } from '../../Cube';
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
  appSetCubes: Action;

  @State() boxEnabled: number;
  @State() cubes: Cube[];

  componentWillLoad() {

    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, (state) => {
      const {
        app: {
          boxEnabled,
          cubes
        }
      } = state;

      return {
        boxEnabled,
        cubes
      }
    });

    this.store.mapDispatchToProps(this, {
      appSetBoxEnabled,
      appSetCubes
    });

    this._updateCubes(100);
  }

  private _updateCubes(numCubes: number): void {
    const cubes: Cube[] = [];

    for (var i = 0; i < numCubes; i++) {
      cubes.push(new Cube(Utils.getRandomPosition(), Utils.getRandomColor()));
    }

    this.appSetCubes(cubes);
  }

  private _renderAFrame(): JSX.Element {
    return (
      <a-scene background="color: #ECECEC">
        {
          this.boxEnabled ? <a-entity geometry="primitive: box;" position="-1 0.5 -3" rotation="0 45 0" material="color: #4CC3D9" shadow></a-entity> : null
        }
        {
          this._renderCubes()
        }
        <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4" shadow></a-plane>
      </a-scene>
    )
  }

  private _renderCubes() {

    const cubes: JSX.Element[] = [];

    for (var i = 0; i < this.cubes.length; i++) {
      const cube: Cube = this.cubes[i];
      cubes.push(<a-entity geometry="primitive: box;" position={cube.position} material={ `color: ${cube.color}; shader: flat` }></a-entity>);
    }

    return cubes;
  }

  private _renderControlPanel(): JSX.Element {
    return (
      <ion-app id="control-panel">
        <ion-item>
          <ion-label>box</ion-label>
          <ion-toggle checked={this.boxEnabled} onIonChange={(e) => this.appSetBoxEnabled(e.detail.checked)}></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>cubez</ion-label>
          <ion-range pin="true" min="0" max="1000" value={this.cubes.length} onIonChange={ (e) => this._updateCubes(Number(e.detail.value)) }></ion-range>
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
