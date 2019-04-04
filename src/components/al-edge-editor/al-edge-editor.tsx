import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import { AlEdgeSerial } from "../../interfaces";

@Component({
  tag: "al-edge-editor",
  styleUrl: "al-edge-editor.css",
  shadow: true
})
export class AlEdgeEditor {
  @Event() onDelete: EventEmitter;

  @Prop({ mutable: true }) edge: [string, AlEdgeSerial];

  render(): JSX.Element {
    if (this.edge) {
      const [edgeId] = this.edge;

      console.log(this.edge);

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-button
            size="small"
            onClick={() => {
              this.onDelete.emit(edgeId);
              this.edge = null;
            }}
          >
            <ion-icon name="remove" />
          </ion-button>
        </form>
      );
    }

    return null;
  }
}
