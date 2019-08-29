import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import RunIcon from "../../assets/svg/run.svg";
@Component({
  tag: "al-console",
  styleUrl: "al-console.css",
  shadow: true
})
export class AlConsole {
  private _graph: HTMLTextAreaElement;

  @Event() public graphSubmitted: EventEmitter;

  @Prop({ mutable: true }) public graph: string;

  public render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <ion-item>
          <ion-textarea
            value={this.graph}
            rows="10"
            required
            onIonChange={e => (this.graph = e.detail.value)}
            ref={el => (this._graph = el)}
          />
        </ion-item>
        <ion-button
          size="small"
          type="submit"
          onClick={() => {
            if (this.graph) {
              this.graphSubmitted.emit(this._graph.value);
            }
          }}
        >
          <ion-icon src={RunIcon} />
        </ion-button>
      </form>
    );
  }
}
