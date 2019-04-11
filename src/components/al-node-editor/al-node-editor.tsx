import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import { AlNodeSerial } from "../../interfaces";

@Component({
  tag: "al-node-editor",
  styleUrl: "al-node-editor.css",
  shadow: true
})
export class AlNodeEditor {
  @Event() delete: EventEmitter;
  @Event() save: EventEmitter;

  @Prop({ mutable: true }) node: [string, AlNodeSerial];

  render(): JSX.Element {
    if (this.node) {
      const [nodeId, node] = this.node;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-item>
            <ion-textarea
              value={node.text}
              rows="5"
              required
              onIonChange={e => (node.text = e.detail.value)}
            />
          </ion-item>
          <ion-button
            size="small"
            onClick={() => {
              this.delete.emit(nodeId);
              this.node = null;
            }}
          >
            <ion-icon name="remove" />
          </ion-button>
          <ion-button
            size="small"
            type="submit"
            onClick={() => {
              if (node.text) {
                this.save.emit([nodeId, node]);
              }
            }}
          >
            <ion-icon name="checkmark" />
          </ion-button>
        </form>
      );
    }

    return null;
  }
}
