import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import { AlNodeSerial } from "../../interfaces";

@Component({
  tag: "al-node-list",
  styleUrl: "al-node-list.css",
  shadow: false
})
export class AlNodeList {
  @Event() onselectedChanged: EventEmitter;

  @Prop({ mutable: true }) nodes: Map<string, AlNodeSerial> | null = null;
  @Prop({ mutable: true }) selected: string | null = null;

  render(): JSX.Element {
    if (this.nodes) {
      return (
        <ion-list>
          <ion-radio-group value={this.selected}>
            {[...this.nodes].map(([nodeId, node]) => {
              return (
                <ion-item no-padding>
                  <ion-label>{node.text}</ion-label>
                  <ion-radio
                    value={nodeId}
                    onClick={() => this.onselectedChanged.emit(nodeId)}
                  />
                </ion-item>
              );
            })}
          </ion-radio-group>
        </ion-list>
      );
    }
    return null;
  }

  // return (
  //   <div>
  //     <ul>
  //       {this.nodes.map((node: AlNodeSerial) => {
  //         return (
  //           <li>
  //             <label class="block">
  //               <input
  //                 type="radio"
  //                 checked={this.selected === node.id}
  //                 id={node.id}
  //                 name="node"
  //                 value={node.id}
  //                 onChange={e =>
  //                   this.onselectedChanged.emit(e.srcElement.id)
  //                 }
  //               />
  //               {node.id}
  //             </label>
  //           </li>
  //         );
  //       })}
  //     </ul>
  //   </div>
  // );
  //}
}
