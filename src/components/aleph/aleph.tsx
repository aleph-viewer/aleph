import { Component, Prop, State } from '@stencil/core';
import { Store, Action } from '@stencil/redux';
import { appAddTool, appRemoveTool, appSelectTool, appSaveTools } from '../../redux/actions';
import { configureStore } from '../../redux/store';
import { Tool } from '../../Tool';
import { Utils } from '../../utils/Utils';
type Entity = import('aframe').Entity;

@Component({
  tag: 'uv-aleph',
  styleUrl: 'aleph.css',
  shadow: true
})
export class Aleph {

  private _container: HTMLElement;

  @Prop({ context: 'store' }) store: Store;

  appAddTool: Action;
  appRemoveTool: Action;
  appSelectTool: Action;
  appSaveTools: Action;

  @State() selectedTool: number;
  @State() tools: Tool[];

  componentWillLoad() {

    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, (state) => {
      const {
        app: {
          selectedTool,
          tools
        }
      } = state;

      return {
        selectedTool,
        tools
      }
    });

    this.store.mapDispatchToProps(this, {
      appAddTool,
      appRemoveTool,
      appSelectTool,
      appSaveTools
    });
  }

  private _renderTools() {

    const tools: JSX.Element[] = [];

    for (var i = 0; i < this.tools.length; i++) {
      if (i < this.tools.length) {
        const tool: Tool = this.tools[i];
        tools.push(<a-entity id={tool.id} class="tool collidable" raycaster-listen geometry="primitive: sphere;" position={tool.position} material={ `color: ${tool.color}; shader: flat` }></a-entity>);
      }
      else {
        tools.push(null);
      }
    }

    return tools;
  }

  private _renderAFrame(): JSX.Element {
    return (
      <a-scene embedded renderer="colorManagement: true;" vr-mode-ui="enabled: false">
        <a-entity light="type: directional; color: #ffffff; intensity: 0.75" position="1 1 1"></a-entity>
        <a-entity light="type: directional; color: #002958; intensity: 0.5" position="-1 -1 -1"></a-entity>
        <a-entity light="type: ambient; color: #d0d0d0; intensity: 1"></a-entity>
        <a-camera look-control>
          <a-entity raycaster="showLine: true; far: 200; objects: .collidable; interval: 1000"
            position="0 0 -1"
            scale="0.02 0.02 0.02"
            geometry="primitive: ring"
            material="color: black; shader: flat"
            line="color: orange; opacity: 0.5"></a-entity>
        </a-camera>
        { this._renderTools() }
      </a-scene>
    )
  }

  private _renderControlPanel(): JSX.Element {
    return (
      <ion-app id="control-panel">
        <ion-item>
          <ion-list lines="none">
            <ion-radio-group>
              <ion-list-header>
                Tools
              </ion-list-header>
              {
                this.tools.map((tool: Tool) => {
                  return (
                    <ion-item>
                      <ion-label>{ tool.id }</ion-label>
                      <ion-radio checked={tool.id === this.selectedTool} onClick={() => this.appSelectTool(tool.id)}></ion-radio>
                    </ion-item>
                  )
                })
              }
            </ion-radio-group>
          </ion-list>
        </ion-item>
        <ion-footer>
          <ion-toolbar>
            <ion-buttons>
              <ion-button onClick={ () => {
                this.appAddTool(Utils.createTool(this.tools))
              }}>Add</ion-button>
              <ion-button onClick={ () => {
                this.appSaveTools()
              }}>Save</ion-button>
              {
                (this.selectedTool !== null) ? (
                  <ion-button onClick={ () => {
                    this.appRemoveTool(this.tools.findIndex((tool: Tool) => {
                      return tool.id === this.selectedTool;
                    }))
                  }}>Delete</ion-button>) : null
              }
            </ion-buttons>
          </ion-toolbar>
        </ion-footer>
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

  private _getSceneEl(): Entity {
    return this._container.querySelector('a-scene');
  }

  private _getToolEls(): NodeListOf<Entity> {
    return this._getSceneEl().querySelectorAll('.tool');
  }

  private _addToolClickHandlers(): void {
    this._getToolEls().forEach((el: Entity) => {
      el.addEventListener('click', (event: CustomEvent) => {
        if (this.selectedTool !== Number(el.id)) {
          this.appSelectTool(Number(el.id));
          console.log('clicked', event.detail.position);
        }
      });
    });
  }

  componentDidLoad() {
    this._addToolClickHandlers();
  }

  componentDidUpdate() {
    this._addToolClickHandlers();
  }

}
