import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import MinusIcon from "../../assets/svg/minus.svg";
import { AlEdge } from "../../interfaces";

@Component({
  tag: "al-edge-editor",
  styleUrl: "al-edge-editor.css",
  shadow: true
})
export class AlEdgeEditor {
  @Event() public deleteEdge: EventEmitter;

  @Prop({ mutable: true }) public edge: [string, AlEdge];

  public render() {
    if (this.edge) {
      const [edgeId] = this.edge;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-button
            size="small"
            onClick={() => {
              this.deleteEdge.emit(edgeId);
              this.edge = null;
            }}
          >
            <ion-icon src={MinusIcon} />
          </ion-button>
        </form>
      );
    }

    return null;
  }
}
