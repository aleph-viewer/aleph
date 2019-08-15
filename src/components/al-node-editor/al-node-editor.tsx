import {
  Component,
  h,
  Element,
  Event,
  EventEmitter,
  Prop
} from "@stencil/core";
import { AlNode } from "../../interfaces";
import { ContentStrings } from "./ContentStrings";
import { getLocaleComponentStrings } from "../../utils/Locale";

@Component({
  tag: "al-node-editor",
  styleUrl: "al-node-editor.css",
  shadow: true
})
export class AlNodeEditor {
  @Element() element: HTMLElement;
  contentStrings: ContentStrings;

  @Event() public delete: EventEmitter;
  @Event() public save: EventEmitter;

  @Prop({ mutable: true }) public node: [string, AlNode];

  async componentWillLoad(): Promise<void> {
    this.contentStrings = await getLocaleComponentStrings(this.element);
  }

  public render() {
    if (this.node) {
      const [nodeId, node] = this.node;

      return (
        <form onSubmit={e => e.preventDefault()}>
          <ion-item>
            <ion-input
              value={node.title}
              placeholder={this.contentStrings.title}
              required
              onIonChange={e => (node.title = e.detail.value)}
            />
          </ion-item>
          <ion-item>
            <ion-textarea
              value={node.description}
              placeholder={this.contentStrings.description}
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
            <ion-icon src="/assets/svg/minus.svg" />
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
            <ion-icon src="/assets/svg/tick.svg" />
          </ion-button>
        </form>
      );
    }

    return null;
  }
}
