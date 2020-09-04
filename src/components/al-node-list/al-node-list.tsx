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

  @Event() public selectedChange: EventEmitter;

  @Prop({ mutable: true }) public nodes: Map<string, AlNode> | null = null;
  @Prop({ mutable: true }) public selected: string | null = null;

  public render() {
    if (this.nodes && this.nodes.size) {
      return (
        <ion-list
          style={{
            color: "var(--al-item-color)",
            "border-width": "1px 0 0 0",
            "border-color": "var(--ion-list-header-border-color)",
            "border-style": "solid",
            "margin-top": "10px"
          }}
        >
          {Array.from(this.nodes).map(([nodeId, node]) => {
            return (
              <ion-item
                data-selected={this.selected === nodeId ? true : false}
                onClick={() => this.selectedChange.emit(nodeId)}
              >
                {node.title}
              </ion-item>
            );
          })}
        </ion-list>
      );
    }
    return (
      <ion-item
        style={{
          color: "var(--al-item-color)",
          "border-width": "1px 0 0 0",
          "border-color": "var(--ion-list-header-border-color)",
          "border-style": "solid",
          "margin-top": "10px"
        }}
      >
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
