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

  @Event() public deleteNode: EventEmitter;
  @Event() public saveNode: EventEmitter;

  @Prop({ mutable: true }) public node: [string, AlNode];

  public render() {
    if (this.node) {
      const [nodeId, node] = this.node;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-item>
            <ion-input
              id="title"
              value={node.title}
              placeholder={this._contentStrings.title}
              required
              onIonChange={e => (node.title = e.detail.value)}
              maxlength="20"
            />
          </ion-item>
          <ion-item>
            <ion-textarea
              id="description"
              value={node.description}
              placeholder={this._contentStrings.description}
              rows="5"
              onIonChange={e => (node.description = e.detail.value)}
              maxlength="280"
            />
          </ion-item>
          <ion-item>
            <ion-button
              size="small"
              onClick={() => {
                this.deleteNode.emit(nodeId);
                this.node = null;
              }}
            >
              <ion-icon src={MinusIcon} />
              &nbsp;{this._contentStrings.delete}
            </ion-button>
            <ion-button
              size="small"
              type="submit"
              onClick={() => {
                if (node.title) {
                  this.saveNode.emit([nodeId, node]);
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
