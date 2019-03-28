import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import { AlNodeSerial } from "../../interfaces";

@Component({
  tag: "al-node-editor",
  styleUrl: "al-node-editor.css",
  shadow: false
})
export class AlNodeEditor {
  @Event() onRemoveNode: EventEmitter;

  @Prop({ mutable: true }) node: AlNodeSerial;

  render(): JSX.Element {
    if (this.node) {
      return [
        <ion-item>
          <ion-textarea value={this.node.text} />,
        </ion-item>,
        <ion-button
          onClick={() => {
            this.onRemoveNode.emit(this.node);
            this.node = null;
          }}
        >
          Delete
        </ion-button>
      ];
    }

    return null;
  }
}
