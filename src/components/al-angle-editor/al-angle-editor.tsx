import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import { AlAngleSerial } from "../../interfaces";

@Component({
  tag: "al-angle-editor",
  styleUrl: "al-angle-editor.css",
  shadow: true
})
export class AlangleEditor {
  @Event() onDelete: EventEmitter;

  @Prop({ mutable: true }) angle: [string, AlAngleSerial];

  render(): JSX.Element {
    if (this.angle) {
      const [angleId] = this.angle;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-button
            size="small"
            onClick={() => {
              this.onDelete.emit(angleId);
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
