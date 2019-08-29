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
  @Prop({ mutable: true }) public tabSize: number = 2;

  public render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <ion-item>
          <ion-textarea
            id="graph"
            value={JSON.stringify(
              JSON.parse(this.graph),
              undefined,
              this.tabSize
            )}
            rows="10"
            required
            onIonChange={e => (this.graph = e.detail.value)}
            maxlength="5000"
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
