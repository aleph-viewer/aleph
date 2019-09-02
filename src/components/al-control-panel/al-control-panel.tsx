import { Component, Element, h, Listen, Prop } from "@stencil/core";
import { DisplayMode, Units } from "../../enums/index.js";
import { Scroll } from "../../functional-components/Scroll";
import { AlAngle, AlEdge, AlNode } from "../../interfaces/index.js";
import i18n from "./al-control-panel.i18n.en.json";
import { ContentStrings } from "./ContentStrings";

@Component({
  tag: "al-control-panel",
  styleUrl: "al-control-panel.css",
  shadow: true
})
export class AlSettings {
  private _contentStrings: ContentStrings = i18n;

  @Element() public el!: HTMLElement;

  @Prop({ mutable: true }) public angles: Map<string, AlAngle> | null = null;
  @Prop({ mutable: true }) public boundingBoxEnabled: boolean = false;
  @Prop({ mutable: true }) public consoleTabEnabled: boolean = true;
  @Prop({ mutable: true }) public displayMode: DisplayMode = DisplayMode.MESH;
  @Prop({ mutable: true }) public edges: Map<string, AlEdge> | null = null;
  @Prop({ mutable: true }) public graphTabEnabled: boolean = true;
  @Prop({ mutable: true }) public nodes: Map<string, AlNode> | null = null;
  @Prop({ mutable: true }) public selected: string | null = null;
  @Prop({ mutable: true }) public settingsTabEnabled: boolean = true;
  @Prop({ mutable: true }) public srcTabEnabled: boolean = true;
  @Prop({ mutable: true }) public stackhelper:
    | AMI.StackHelper
    | AMI.VolumeRenderHelper;
  @Prop({ mutable: true }) public tabContentHeight: string | null = null;
  @Prop({ mutable: true }) public units: Units = Units.METERS;
  @Prop({ mutable: true }) public url: string | null = null;
  @Prop({ mutable: true }) public urls: Map<string, string> | null = null;

  private _getGraphJson(): string {
    if (this.nodes && this.edges && this.angles) {
      const graph = {
        nodes: Array.from(this.nodes),
        edges: Array.from(this.edges),
        angles: Array.from(this.angles)
      };

      return JSON.stringify(graph);
    }

    return "";
  }

  private _getSelectedNode(): [string, AlNode] | null {
    if (this.selected && this.nodes) {
      const n = this.nodes.get(this.selected);
      if (n) {
        return [this.selected, n];
      }
    }
    return null;
  }

  private _getSelectedEdge(): [string, AlEdge] | null {
    if (this.selected && this.edges) {
      const e = this.edges.get(this.selected);
      if (e) {
        return [this.selected, e];
      }
    }
    return null;
  }

  private _getSelectedAngle(): [string, AlAngle] | null {
    if (this.selected && this.angles) {
      const a = this.angles.get(this.selected);
      if (a) {
        return [this.selected, a];
      }
    }
    return null;
  }

  public render() {
    const tabContentHeight: string =
      this.tabContentHeight || this.el.parentElement.clientHeight + "px";

    return (
      <ion-app>
        <al-tabs>
          <ion-tab-bar>
            {this.srcTabEnabled ? (
              <ion-tab-button tab="src">
                <ion-label>{this._contentStrings.src}</ion-label>
              </ion-tab-button>
            ) : null}
            {this.settingsTabEnabled ? (
              <ion-tab-button tab="settings">
                <ion-label>{this._contentStrings.settings}</ion-label>
              </ion-tab-button>
            ) : null}
            {this.graphTabEnabled ? (
              <ion-tab-button tab="graph">
                <ion-label>{this._contentStrings.graph}</ion-label>
              </ion-tab-button>
            ) : null}
            {this.consoleTabEnabled ? (
              <ion-tab-button tab="console">
                <ion-label>{this._contentStrings.console}</ion-label>
              </ion-tab-button>
            ) : null}
          </ion-tab-bar>
          {this.srcTabEnabled ? (
            <ion-tab tab="src">
              <al-url-picker urls={this.urls} url={this.url}></al-url-picker>
            </ion-tab>
          ) : null}
          {this.settingsTabEnabled ? (
            <ion-tab tab="settings">
              <Scroll height={tabContentHeight}>
                <al-settings
                  bounding-box-enabled={this.boundingBoxEnabled}
                  display-mode={this.displayMode}
                  stackhelper={this.stackhelper}
                  units={this.units}
                ></al-settings>
              </Scroll>
            </ion-tab>
          ) : null}
          {this.graphTabEnabled ? (
            <ion-tab tab="graph">
              <Scroll height={tabContentHeight}>
                <al-node-list
                  nodes={this.nodes}
                  selected={this.selected}
                ></al-node-list>
                <ion-item-divider></ion-item-divider>
                <al-node-editor node={this._getSelectedNode()}></al-node-editor>
                <al-edge-editor edge={this._getSelectedEdge()}></al-edge-editor>
                <al-angle-editor
                  angle={this._getSelectedAngle()}
                ></al-angle-editor>
              </Scroll>
            </ion-tab>
          ) : null}
          {this.consoleTabEnabled ? (
            <ion-tab tab="console">
              <Scroll height={tabContentHeight}>
                <al-console graph={this._getGraphJson()}></al-console>
              </Scroll>
            </ion-tab>
          ) : null}
        </al-tabs>
      </ion-app>
    );
  }

  @Listen("selectedChanged")
  protected selectedChangedHandler(e: CustomEvent) {
    this.selected = e.detail;
  }
}
