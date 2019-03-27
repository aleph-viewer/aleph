import {
  Component,
  Prop,
  Event,
  EventEmitter,
  Watch,
  State,
  Method
} from "@stencil/core";
import { AlNodeSerial } from "../../interfaces";

@Component({
  tag: "al-node-list",
  styleUrl: "al-node-list.css",
  shadow: false
})
export class AlNodeList {
  @Event() onSelectedNodeChanged: EventEmitter;

  @Prop({ mutable: true }) nodes: AlNodeSerial[] = [];
  @Prop({ mutable: true }) selectedNode: string | null = null;

  render(): JSX.Element {
    return (
      <div>
        <ul>
          {this.nodes.map((node: AlNodeSerial) => {
            return (
              <li>
                <label class="block">
                  <input
                    type="radio"
                    checked={this.selectedNode === node.id}
                    id={node.id}
                    name="node"
                    value={node.id}
                    onChange={e =>
                      this.onSelectedNodeChanged.emit(e.srcElement.id)
                    }
                  />
                  {node.id}
                </label>
              </li>
            );
          })}
        </ul>
        {/* {this.selectedNode !== null ? (
        <ion-button
          onClick={() => {
            this.onRemoveNode.emit(this.selectedNode);
          }}
        >
          Delete
        </ion-button>
      ) : null} */}
      </div>
    );
  }
}
