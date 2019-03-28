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

  @Prop({ mutable: true }) node: AlNodeSerial;

  render(): JSX.Element {
    if (this.node) {
      return [
        <ion-item>
          <ion-textarea
            value={this.node.text}
            onIonChange={e => (this.node.text = e.detail.value)}
          />
          ,
        </ion-item>,
        <ion-button
          onClick={() => {
            this.onDelete.emit(this.node);
            this.node = null;
          }}
        >
          Delete
        </ion-button>,
        <ion-button
          onClick={() => {
            this.onSave.emit(this.node);
          }}
        >
          Save
        </ion-button>
      ];
    }

    return null;
  }
}
