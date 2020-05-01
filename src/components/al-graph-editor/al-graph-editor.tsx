import { Component, h, Prop } from "@stencil/core";
import { AlAngle, AlEdge, AlNode } from "../../interfaces";
import { Units } from "../../enums";

@Component({
  tag: "al-graph-editor",
  styleUrl: "al-graph-editor.css",
  shadow: true
})
export class AlGraphEditor {
  @Prop({ mutable: true }) public node: [string, AlNode];
  @Prop({ mutable: true }) public nodes: Map<string, AlNode> | null = null;
  @Prop({ mutable: true }) public angles: Map<string, AlAngle> | null = null;
  @Prop({ mutable: true }) public edges: Map<string, AlEdge> | null = null;
  @Prop({ mutable: true }) public selected: string | null = null;
  @Prop({ mutable: true }) public graphEnabled: boolean;
  @Prop({ mutable: true }) public graphVisible: boolean;
  @Prop({ mutable: true }) public units: Units;

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
    return [
      <al-graph-settings
        graph-enabled={this.graphEnabled}
        graph-visible={this.graphVisible}
        units={this.units}
      ></al-graph-settings>,
      <al-node-list nodes={this.nodes} selected={this.selected}></al-node-list>,
      <ion-item-divider></ion-item-divider>,
      <al-node-editor node={this._getSelectedNode()}></al-node-editor>,
      <al-edge-editor edge={this._getSelectedEdge()}></al-edge-editor>,
      <al-angle-editor angle={this._getSelectedAngle()}></al-angle-editor>
    ];
  }
}
