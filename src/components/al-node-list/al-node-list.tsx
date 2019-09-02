import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import { AlNode } from "../../interfaces";
import i18n from "./al-node-list.i18n.en.json";
import { ContentStrings } from "./ContentStrings";

@Component({
  tag: "al-node-list",
  styleUrl: "al-node-list.css",
  shadow: true
})
export class AlNodeList {
  private _contentStrings: ContentStrings = i18n;

  @Event() public selectedChanged: EventEmitter;

  @Prop({ mutable: true }) public nodes: Map<string, AlNode> | null = null;
  @Prop({ mutable: true }) public selected: string | null = null;

  public render() {
    if (this.nodes && this.nodes.size) {
      return (
        <ion-list>
          {Array.from(this.nodes).map(([nodeId, node]) => {
            return (
              <ion-item
                selected={this.selected === nodeId ? true : false}
                onClick={() => this.selectedChanged.emit(nodeId)}
              >
                {node.title}
              </ion-item>
            );
          })}
        </ion-list>
      );
    }
    return (
      <ion-item>
        <p>{this._contentStrings.graphEmpty}</p>
      </ion-item>
    );
  }

  // render(): JSX.ElementInterfaces {
  //   if (this.nodes) {
  //     return (
  //       <ion-list>
  //         <ion-radio-group value={this.selected}>
  //           {[...this.nodes].map(([nodeId, node]) => {
  //             return (
  //               <ion-item no-padding>
  //                 <ion-label>{node.text}</ion-label>
  //                 <ion-radio
  //                   value={nodeId}
  //                   onClick={() => this.selectedChanged.emit(nodeId)}
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
  //       {this.nodes.map((node: AlNode) => {
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
  //                   this.selectedChanged.emit(e.srcElement.id)
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
  // }
}
