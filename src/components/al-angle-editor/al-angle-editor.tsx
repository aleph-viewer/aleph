import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import { AlAngle } from "../../interfaces";

@Component({
  tag: "al-angle-editor",
  styleUrl: "al-angle-editor.css",
  shadow: true
})
export class AlAngleEditor {
  @Event() public delete: EventEmitter;

  @Prop({ mutable: true }) public angle: [string, AlAngle];

  public render() {
    if (this.angle) {
      const [angleId] = this.angle;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-button
            size="small"
            onClick={() => {
              this.delete.emit(angleId);
              this.angle = null;
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
