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

  private _handleSubmit(event) {
    event.preventDefault();
  }

  render(): JSX.Element {
    if (this.node) {
      const [nodeId, node] = this.node;

      return [
        <form onSubmit={this._handleSubmit}>
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
              this.onDelete.emit(nodeId);
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
                this.onSave.emit([nodeId, node]);
                return false;
              }
            }}
          >
            <ion-icon name="checkmark" />
          </ion-button>
        </form>
      ];
    }

    return null;
  }
}
