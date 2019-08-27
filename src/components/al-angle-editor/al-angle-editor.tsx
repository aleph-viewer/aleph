import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import MinusIcon from "../../assets/svg/minus.svg";
import { AlAngle } from "../../interfaces";

@Component({
  tag: "al-angle-editor",
  styleUrl: "al-angle-editor.css",
  shadow: true
})
export class AlAngleEditor {
  @Event() public deleteAngle: EventEmitter;

  @Prop({ mutable: true }) public angle: [string, AlAngle];

  public render() {
    if (this.angle) {
      const [angleId] = this.angle;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-button
            size="small"
            onClick={() => {
              this.deleteAngle.emit(angleId);
              this.angle = null;
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
