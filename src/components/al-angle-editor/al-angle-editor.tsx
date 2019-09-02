import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import MinusIcon from "../../assets/svg/minus.svg";
import { AlAngle } from "../../interfaces";
import i18n from "./al-angle-editor.i18n.en.json";
import { ContentStrings } from "./ContentStrings";

@Component({
  tag: "al-angle-editor",
  styleUrl: "al-angle-editor.css",
  shadow: true
})
export class AlAngleEditor {
  private _contentStrings: ContentStrings = i18n;

  @Event() public deleteAngle: EventEmitter;

  @Prop({ mutable: true }) public angle: [string, AlAngle];

  public render() {
    if (this.angle) {
      const [angleId] = this.angle;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-item>
            <ion-button
              size="small"
              onClick={() => {
                this.deleteAngle.emit(angleId);
                this.angle = null;
              }}
            >
              <ion-icon src={MinusIcon} />
              &nbsp;{this._contentStrings.delete}
            </ion-button>
          </ion-item>
        </form>
      );
    }

    return null;
  }
}
