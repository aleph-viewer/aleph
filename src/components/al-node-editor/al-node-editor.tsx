import { Component, Prop, Event, EventEmitter, State } from "@stencil/core";
import { AlNodeSerial } from "../../interfaces";

@Component({
  tag: "al-node-editor",
  styleUrl: "al-node-editor.css",
  shadow: false
})
export class AlNodeEditor {
  @Event() onDelete: EventEmitter;
  @Event() onSave: EventEmitter;

  @Prop({ mutable: true }) node: [string, AlNodeSerial];

  render(): JSX.Element {
    if (this.node) {
      const [nodeId, node] = this.node;

      return [
        <ion-item>
          <ion-textarea
            value={node.text}
            onIonChange={e => (node.text = e.detail.value)}
          />
          ,
        </ion-item>,
        <ion-button
          onClick={() => {
            this.onDelete.emit(nodeId);
            this.node = null;
          }}
        >
          Delete
        </ion-button>,
        <ion-button
          onClick={() => {
            this.onSave.emit([nodeId, node]);
          }}
        >
          Save
        </ion-button>
      ];
    }

    return null;
  }
}
