import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import MinusIcon from "../../assets/svg/minus.svg";
import TickIcon from "../../assets/svg/tick.svg";
import { AlNode } from "../../interfaces";
import i18n from "./al-node-editor.i18n.en.json";
import { ContentStrings } from "./ContentStrings";

@Component({
  tag: "al-node-editor",
  styleUrl: "al-node-editor.css",
  shadow: true
})
export class AlNodeEditor {
  private _contentStrings: ContentStrings = i18n;

  @Event() public delete: EventEmitter;
  @Event() public save: EventEmitter;

  @Prop({ mutable: true }) public node: [string, AlNode];

  public render() {
    if (this.node) {
      const [nodeId, node] = this.node;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-item>
            <ion-input
              value={node.title}
              placeholder={this._contentStrings.title}
              required
              onIonChange={e => (node.title = e.detail.value)}
            />
          </ion-item>
          <ion-item>
            <ion-textarea
              value={node.description}
              placeholder={this._contentStrings.description}
              rows="10"
              onIonChange={e => (node.description = e.detail.value)}
            />
          </ion-item>
          <ion-button
            size="small"
            onClick={() => {
              this.delete.emit(nodeId);
              this.node = null;
            }}
          >
            <ion-icon src={MinusIcon} />
          </ion-button>
          <ion-button
            size="small"
            type="submit"
            onClick={() => {
              if (node.title) {
                this.save.emit([nodeId, node]);
              }
            }}
          >
            <ion-icon src={TickIcon} />
          </ion-button>
        </form>
      );
    }

    return null;
  }
}
