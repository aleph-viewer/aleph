import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import MinusIcon from "../../assets/svg/minus.svg";
import TickIcon from "../../assets/svg/tick.svg";
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
  @Event() public saveAngle: EventEmitter;

  @Prop({ mutable: true }) public angle: [string, AlAngle];

  public render() {
    if (this.angle) {
      const [angleId, angle] = this.angle;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-item>
            <ion-input
              id="title"
              value={angle.title}
              placeholder={this._contentStrings.title}
              required
              onIonChange={e => (angle.title = e.detail.value)}
              maxlength="20"
            />
          </ion-item>
          <ion-item>
            <ion-textarea
              id="description"
              value={angle.description}
              placeholder={this._contentStrings.description}
              rows="5"
              onIonChange={e => (angle.description = e.detail.value)}
              maxlength="280"
            />
          </ion-item>
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
            <ion-button
              size="small"
              type="submit"
              onClick={() => {
                if (angle.title) {
                  this.saveAngle.emit([angleId, angle]);
                }
              }}
            >
              <ion-icon src={TickIcon} />
              &nbsp;{this._contentStrings.update}
            </ion-button>
          </ion-item>
        </form>
      );
    }

    return null;
  }
}
