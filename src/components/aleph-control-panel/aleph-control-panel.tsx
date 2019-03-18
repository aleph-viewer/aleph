import { Component, Prop } from "@stencil/core";
import { Tool } from "../../Tool";
import { Utils } from "../../utils/Utils";

@Component({
  tag: "aleph-control-panel",
  styleUrl: "aleph-control-panel.css",
  shadow: true
})
export class ControlPanel {

  @Prop() tools: Tool[];
  @Prop() selectedTool: number;
  @Prop() selectTool: (id: number) => void;
  @Prop() addTool: (tool: Tool) => void;
  @Prop() saveTools: () => void;
  @Prop() removeTool: (id: number) => void;

  render(): JSX.Element {
    return (
      <ion-app id="control-panel">
        <ion-item>
          <ion-list lines="none">
            <ion-radio-group>
              <ion-list-header>
                Tools
              </ion-list-header>
              {
                this.tools.map((tool: Tool) => {
                  return (
                    <ion-item>
                      <ion-label>{ tool.id }</ion-label>
                      <ion-radio checked={tool.id === this.selectedTool} onClick={() => this.selectTool(tool.id)}></ion-radio>
                    </ion-item>
                  );
                })
              }
            </ion-radio-group>
          </ion-list>
        </ion-item>
        <ion-footer>
          <ion-toolbar>
            <ion-buttons>
              <ion-button onClick={ () => {
                this.addTool(Utils.createTool(this.tools));
              }}>Add</ion-button>
              <ion-button onClick={ () => {
                this.saveTools();
              }}>Save</ion-button>
              {
                (this.selectedTool !== null) ? (
                  <ion-button onClick={ () => {
                    this.removeTool(this.selectedTool);
                  }}>Delete</ion-button>) : null
              }
            </ion-buttons>
          </ion-toolbar>
        </ion-footer>
      </ion-app>
    );
  }

}
