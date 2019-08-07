import { Component, Event, EventEmitter, Prop } from "@stencil/core";

@Component({
  tag: "al-console",
  styleUrl: "al-console.css",
  shadow: true
})
export class AlConsole {
  private _cmd: HTMLTextAreaElement;

  @Event() public command: EventEmitter;

  @Prop({ mutable: true }) public cmd: string;

  public render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <ion-item>
          <ion-textarea
            value={this.cmd}
            rows="10"
            required
            onIonChange={e => (this.cmd = e.detail.value)}
            ref={el => (this._cmd = el)}
          />
        </ion-item>
        <ion-button
          size="small"
          type="submit"
          onClick={() => {
            if (this.cmd) {
              this.command.emit(this._cmd.value);
            }
          }}
        >
          <ion-icon name="arrow-dropright" />
        </ion-button>
      </form>
    );
  }
}
