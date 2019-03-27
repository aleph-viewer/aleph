import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import { AlToolSerial } from "../../interfaces";

@Component({
  tag: "al-tool-editor",
  styleUrl: "al-tool-editor.css",
  shadow: false
})
export class AlToolEditor {
  @Event() onRemoveTool: EventEmitter;

  @Prop({ mutable: true }) tool: AlToolSerial | null = null;

  render(): JSX.Element {
    return (
      <div>
        {this.tool !== null
          ? [
              <textarea value={this.tool.text} />,
              <ion-button
                onClick={() => {
                  this.onRemoveTool.emit(this.tool);
                }}
              >
                Delete
              </ion-button>
            ]
          : null}
      </div>
    );
  }
}
