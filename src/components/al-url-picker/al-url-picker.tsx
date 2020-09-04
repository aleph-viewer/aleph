import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import RefreshIcon from "../../assets/svg/refresh.svg";

@Component({
  tag: "al-url-picker",
  styleUrl: "al-url-picker.css",
  shadow: true
})
export class AlUrlPicker {
  @Event() public urlChange: EventEmitter;

  @Prop({ mutable: true }) public urls: Map<string, string> | null = null;
  @Prop({ mutable: true }) public url: string | null = null;

  private _input: HTMLIonInputElement;

  public render() {
    if (this.urls) {
      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-item>
            <ion-select
              id="select"
              value={this.url}
              interface="popover"
              placeholder=""
              onIonChange={e => this.urlChange.emit(e.detail.value)}
            >
              {Array.from(this.urls).map(([url, title]) => {
                return (
                  <ion-select-option value={url}>{title}</ion-select-option>
                );
              })}
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-input
              id="input"
              type="url"
              size={100}
              placeholder="src"
              required
              value={this.url}
              ref={el => (this._input = el)}
            />
          </ion-item>
          <ion-item>
            <ion-button
              id="submit"
              size="small"
              type="submit"
              onClick={() => this.urlChange.emit(this._input.value)}
            >
              <ion-icon src={RefreshIcon} />
              &nbsp;Load
            </ion-button>
          </ion-item>
        </form>
      );
    }
    return null;
  }
}
