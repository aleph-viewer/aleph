import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import MinusIcon from "../../assets/svg/minus.svg";
import TickIcon from "../../assets/svg/tick.svg";
import { AlEdge } from "../../interfaces";
import i18n from "./al-edge-editor.i18n.en.json";
import { ContentStrings } from "./ContentStrings";

@Component({
  tag: "al-edge-editor",
  styleUrl: "al-edge-editor.css",
  shadow: true
})
export class AlEdgeEditor {
  private _contentStrings: ContentStrings = i18n;

  @Event() public deleteEdge: EventEmitter;
  @Event() public saveEdge: EventEmitter;

  @Prop({ mutable: true }) public edge: [string, AlEdge];

  public render() {
    if (this.edge) {
      const [edgeId, edge] = this.edge;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-item>
            <ion-input
              id="title"
              value={edge.title}
              placeholder={this._contentStrings.title}
              required
              onIonChange={e => (edge.title = e.detail.value)}
              maxlength={20}
            />
          </ion-item>
          <ion-item>
            <ion-textarea
              id="description"
              value={edge.description}
              placeholder={this._contentStrings.description}
              rows={5}
              onIonChange={e => (edge.description = e.detail.value)}
              maxlength={280}
            />
          </ion-item>
          <ion-item>
            <ion-button
              size="small"
              onClick={() => {
                this.deleteEdge.emit(edgeId);
                this.edge = null;
              }}
            >
              <ion-icon src={MinusIcon} />
              &nbsp;{this._contentStrings.delete}
            </ion-button>
            <ion-button
              size="small"
              type="submit"
              onClick={() => {
                if (edge.title) {
                  this.saveEdge.emit([edgeId, edge]);
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
