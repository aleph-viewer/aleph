import { Component, Prop, State } from '@stencil/core';
import { Store, Action } from '@stencil/redux';
import { appSetBoxEnabled, appAddCubes, appRemoveCubes } from '../../redux/actions';
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

  private _container: HTMLElement;

  private _initialNumCubes = 100;

  @Prop({ context: 'store' }) store: Store;

  appSetBoxEnabled: Action;
  appAddCubes: Action;
  appRemoveCubes: Action;

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
      appAddCubes,
      appRemoveCubes
    });

    this._updateCubes(this._initialNumCubes);

    // remove
    console.log(this._container);
  }

  private _updateCubes(numCubes: number): void {

    if (numCubes > this.cubes.length) {
      this.appAddCubes(this._createCubes(numCubes - this.cubes.length));
    } else if (numCubes < this.cubes.length) {
      this.appRemoveCubes(this.cubes.length - numCubes);
    }
  }

  private _createCubes(numCubes: number): Cube[] {

    const cubes: Cube[] = [];

    for (var i = 0; i < numCubes; i++) {
      cubes.push(this._createCube());
    }

    return cubes;
  }

  private _createCube(): Cube {
    return new Cube(Utils.getRandomPosition(), Utils.getRandomColor());
  }

  private _renderAFrame(): JSX.Element {
    return (
      <a-scene embedded renderer="gammaOutput: true" vr-mode-ui="enabled: false" screenshot="enabled: false">
        {
          this.boxEnabled ? <a-entity geometry="primitive: box;" position="-1 0.5 -3" rotation="0 45 0" material="color: #4CC3D9" shadow></a-entity> : null
        }
        {
          this._renderCubes()
        }
      </a-scene>
    )
  }

  private _renderCubes() {

    const cubes: JSX.Element[] = [];

    for (var i = 0; i < this.cubes.length; i++) {
      if (i < this.cubes.length) {
        const cube: Cube = this.cubes[i];
        cubes.push(<a-entity geometry="primitive: box;" position={cube.position} material={ `color: ${cube.color}; shader: flat` }></a-entity>);
      }
      else {
        cubes.push(null);
      }
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
    return (
      <div id="container" ref={(el) => this._container = el as HTMLElement}>
        {this._renderAFrame()}
        {this._renderControlPanel()}
      </div>
    )
  }

}
