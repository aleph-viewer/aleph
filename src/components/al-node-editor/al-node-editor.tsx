import { Component, Event, EventEmitter, Prop } from "@stencil/core";
import { AlNode } from "../../interfaces";

@Component({
  tag: "al-node-editor",
  styleUrl: "al-node-editor.css",
  shadow: true
})
export class AlNodeEditor {
  @Event() public delete: EventEmitter;
  @Event() public save: EventEmitter;

  @Prop({ mutable: true }) public node: [string, AlNode];

  public render() {
    if (this.node) {
      const [nodeId, node] = this.node;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-item>
            <ion-input
              value={node.title}
              placeholder="title"
              required
              onIonChange={e => (node.title = e.detail.value)}
            />
          </ion-item>
          <ion-item>
            <ion-textarea
              value={node.description}
              placeholder="description"
              rows="10"
              onIonChange={e => (node.description = e.detail.value)}
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
              if (node.title) {
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
