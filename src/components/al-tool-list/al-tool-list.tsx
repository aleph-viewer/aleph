import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import { AlToolSerial } from "../../interfaces";

@Component({
  tag: "al-tool-list",
  styleUrl: "al-tool-list.css",
  shadow: false
})
export class AlToolList {
  @Event() onSelectedToolChanged: EventEmitter;

  @Prop({ mutable: true }) tools: AlToolSerial[] = [];
  @Prop({ mutable: true }) selectedTool: string | null = null;

  render(): JSX.Element {
    return (
      <div>
        <ul>
          {this.tools.map((tool: AlToolSerial) => {
            return (
              <li>
                <label class="block">
                  <input
                    type="radio"
                    checked={this.selectedTool === tool.id}
                    id={tool.id}
                    name="tool"
                    value={tool.id}
                    onChange={e =>
                      this.onSelectedToolChanged.emit(e.srcElement.id)
                    }
                  />
                  {tool.id}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
