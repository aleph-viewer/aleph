import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import RunIcon from "../../assets/svg/run.svg";
@Component({
  tag: "al-console",
  styleUrl: "al-console.css",
  shadow: true
})
export class AlConsole {
  private _cmd: HTMLTextAreaElement;

  @Event() public runCommand: EventEmitter;

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
              this.runCommand.emit(this._cmd.value);
            }
          }}
        >
          <ion-icon src={RunIcon} />
        </ion-button>
      </form>
    );
  }
}
