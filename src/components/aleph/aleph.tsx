import { Component, Prop, State, Method } from "@stencil/core";
import { Store, Action } from "@stencil/redux";
import {
  appSetSrc,
  appSetSrcLoaded,
  appAddTool,
  appRemoveTool,
  appSelectTool,
  appSaveTools
} from "../../redux/actions";
import { configureStore } from "../../redux/store";
import { Tool } from "../../interfaces/interfaces";
import { CreateUtils, GetUtils } from "../../utils/utils";

type Entity = import("aframe").Entity;

@Component({
  tag: "uv-aleph",
  styleUrl: "aleph.css",
  shadow: true
})
export class Aleph {
  private _container: HTMLElement;
  private _scene: Entity;
  private _focusEntity: Entity;
  private _srcLoadedHandler: any;
  private _toolIntersectedHandler: any;

  @Prop({ context: "store" }) store: Store;
  @Prop() dracoDecoderPath: string | null;

  appSetSrc: Action;
  appSetSrcLoaded: Action;
  appAddTool: Action;
  appRemoveTool: Action;
  appSelectTool: Action;
  appSaveTools: Action;

  @State() src: string | null;
  @State() srcLoaded: boolean;
  @State() selectedTool: number;
  @State() tools: Tool[];

  @Method()
  async setSrc(src: string) {
    this.appSetSrc(src);
  }

  componentWillLoad() {
    CreateUtils.createAframeComponents();

    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, state => {
      const {
        app: { src, srcLoaded, selectedTool, tools }
      } = state;

      return {
        src,
        srcLoaded,
        selectedTool,
        tools
      };
    });

    this.store.mapDispatchToProps(this, {
      appSetSrc,
      appSetSrcLoaded,
      appAddTool,
      appRemoveTool,
      appSelectTool,
      appSaveTools
    });

    // set up event handlers
    this._srcLoadedHandler = this._srcLoaded.bind(this);
    this._toolIntersectedHandler = this._toolIntersected.bind(this);

    // todo: remove
    console.log(this._container);
  }

  private _renderSrc() {
    return this.src ? (
      <a-entity
        ref={(el: Entity) => (this._focusEntity = el)}
        al-gltf-model={`
            src: url(${this.src}); 
            dracoDecoderPath: ${this.dracoDecoderPath};
          `}
        position="0 0 0"
        scale="1 1 1"
      />
    ) : null;
  }

  private _renderTools(): JSX.Element {
    const tools: JSX.Element[] = [];

    for (var i = 0; i < this.tools.length; i++) {
      if (i < this.tools.length) {
        const tool: Tool = this.tools[i];

        tools.push(
          <a-entity
            id={tool.id}
            class="tool collidable"
            raycaster-listen
            geometry="primitive: sphere;"
            position={tool.position}
            material={`color: ${
              this.selectedTool === tool.id ? tool.selectedColor : tool.color
            }; 
            shader: flat`}
          />
        );
      }
    }

    return tools;
  }

  private _renderLights(): JSX.Element {
    return [
      <a-entity
        light="type: directional; color: #ffffff; intensity: 0.75"
        position="1 1 1"
      />,
      <a-entity
        light="type: directional; color: #002958; intensity: 0.5"
        position="-1 -1 -1"
      />,
      <a-entity light="type: ambient; color: #d0d0d0; intensity: 1" />
    ];
  }

  private _renderCamera(): JSX.Element {
    if (this.srcLoaded) {
      let orbitData = GetUtils.getOrbitData(this._focusEntity);
      let pos = orbitData.sceneCenter;
      pos.z += orbitData.sceneDistance;

      return (
        <a-camera
          orbit-controls={`
            target: ${orbitData.sceneCenter}; 
            initialPosition: ${pos}; 
            enableDamping: true; 
            zoomSpeed: 1;`}
        />
      );
    } else {
      return null;
    }
  }

  private _renderScene(): JSX.Element {
    return (
      <a-scene
        ref={(el: Entity) => (this._scene = el)}
        embedded
        renderer="colorManagement: true;"
        vr-mode-ui="enabled: false; enterVRButton: test"
      >
        {this._renderSrc()}
        {this._renderTools()}
        {this._renderLights()}
        {this._renderCamera()}
      </a-scene>
    );
  }

  private _renderControlPanel(): JSX.Element {
    return (
      <al-control-panel
        tools={this.tools}
        selectedTool={this.selectedTool}
        selectTool={this.appSelectTool}
        addTool={this.appAddTool}
        saveTools={this.appSaveTools}
        removeTool={this.appRemoveTool}
      />
    );
  }

  render(): JSX.Element {
    return (
      <div id="container" ref={(el: HTMLElement) => (this._container = el)}>
        {this._renderScene()}
        {this._renderControlPanel()}
      </div>
    );
  }

  private _getToolEls(): NodeListOf<Entity> {
    return this._scene.querySelectorAll(".tool");
  }

  private _srcLoaded(): void {
    this.appSetSrcLoaded(true);
  }

  private _toolIntersected(event: CustomEvent): void {
    const id: number = Number(event.detail.intersection.object.el.id);
    if (this.selectedTool !== id) {
      this.appSelectTool(id);
    }
  }

  private _addEventListeners(): void {
    if (this._scene) {
      this._getToolEls().forEach((el: Entity) => {
        el.addEventListener(
          "intersection",
          this._toolIntersectedHandler,
          false
        );
      });

      if (this._focusEntity) {
        this._focusEntity.addEventListener(
          "model-loaded",
          this._srcLoadedHandler,
          false
        );
      }
    }
  }

  componentDidLoad() {}

  componentDidUpdate() {
    this._addEventListeners();
  }
}
