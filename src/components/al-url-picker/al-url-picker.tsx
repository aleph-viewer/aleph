import { Component, Prop, Event, EventEmitter } from "@stencil/core";

@Component({
  tag: "al-url-picker",
  styleUrl: "al-url-picker.css",
  shadow: false
})
export class AlUrlPicker {
  @Event() onUrlChanged: EventEmitter;

  @Prop({ mutable: true }) urls: Map<string, string> | null = null;
  @Prop({ mutable: true }) url: string | null = null;

  //private _select: HTMLSelectElement;
  private _input: HTMLInputElement;

  // private _urlChanged() {
  //   const selectUrl: string = this._select.value;
  //   const inputUrl: string = this._input.value;

  //   console.log("url changed");

  //   if (inputUrl && inputUrl !== selectUrl) {
  //     this.url = inputUrl;
  //   } else {
  //     this.url = selectUrl;
  //   }

  //   this.onUrlChanged.emit(this.url);
  // }

  render(): JSX.Element {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <ion-select
          value={this.url}
          interface="popover"
          placeholder=""
          ok-text="OK"
          cancel-text="Cancel"
          onIonChange={e => this.onUrlChanged.emit(e.detail.value)}
        >
          {[...this.urls].map(([url, title]) => {
            return <ion-select-option value={url}>{title}</ion-select-option>;
          })}
        </ion-select>
        <ion-input
          type="text"
          placeholder="src"
          required
          value={this.url}
          ref={el => (this._input = el)}
        />
        <ion-button
          size="small"
          onClick={() => this.onUrlChanged.emit(this._input.value)}
        >
          <ion-icon name="refresh" />
        </ion-button>
      </form>
    );
  }
}
