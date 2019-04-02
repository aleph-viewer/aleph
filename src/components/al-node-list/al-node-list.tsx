import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import { AlNodeSerial } from "../../interfaces";

@Component({
  tag: "al-node-list",
  styleUrl: "al-node-list.css",
  shadow: true
})
export class AlNodeList {
  @Event() onSelectedChanged: EventEmitter;

  @Prop({ mutable: true }) nodes: Map<string, AlNodeSerial> | null = null;
  @Prop({ mutable: true }) selected: string | null = null;

  render(): JSX.Element {
    if (this.nodes && this.nodes.size) {
      return (
        <ion-list>
          {[...this.nodes].map(([nodeId, node]) => {
            return (
              <ion-item
                class={this.selected === nodeId ? "selected" : null}
                onClick={() => this.onSelectedChanged.emit(nodeId)}
              >
                {node.text}
              </ion-item>
            );
          })}
        </ion-list>
      );
    }
    return <p>No nodes exist</p>;
  }

  // render(): JSX.Element {
  //   if (this.nodes) {
  //     return (
  //       <ion-list>
  //         <ion-radio-group value={this.selected}>
  //           {[...this.nodes].map(([nodeId, node]) => {
  //             return (
  //               <ion-item>
  //                 <ion-label>{node.text}</ion-label>
  //                 <ion-radio
  //                   value={nodeId}
  //                   onClick={() => this.onSelectedChanged.emit(nodeId)}
  //                 />
  //               </ion-item>
  //             );
  //           })}
  //         </ion-radio-group>
  //       </ion-list>
  //     );
  //   }
  //   return null;
  // }

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
  //                   this.onSelectedChanged.emit(e.srcElement.id)
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
