import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import RunIcon from "../../assets/svg/run.svg";
import { ContentStrings } from "../al-control-panel/ContentStrings";
import i18n from "./al-console.i18n.en.json";
@Component({
  tag: "al-console",
  styleUrl: "al-console.css",
  shadow: true
})
export class AlConsole {
  private _contentStrings: ContentStrings = i18n;
  private _graph: HTMLIonTextareaElement;

  @Event() public graphSubmitted: EventEmitter;

  @Prop({ mutable: true }) public graph: string | null = null;
  @Prop({ mutable: true }) public tabSize: number = 2;

  private _getGraphJson(): string {
    let json: string = "";

    try {
      json = JSON.stringify(JSON.parse(this.graph), undefined, this.tabSize);
    } catch {
      // do nothing
    }

    return json;
  }

  public render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <ion-item>
          <ion-textarea
            id="graph"
            value={this._getGraphJson()}
            rows={10}
            required
            onIonChange={e => (this.graph = e.detail.value)}
            ref={el => (this._graph = el)}
          />
        </ion-item>
        <ion-item>
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
            &nbsp;{this._contentStrings.update}
          </ion-button>
        </ion-item>
      </form>
    );
  }
}
