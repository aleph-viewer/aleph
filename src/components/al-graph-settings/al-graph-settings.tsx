import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
import { Units } from "../../enums";
import i18n from "./al-graph-settings.i18n.en.json";
import { ContentStrings } from "./ContentStrings";

@Component({
  tag: "al-graph-settings",
  styleUrl: "al-graph-settings.css",
  shadow: true
})
export class AlSettings {
  private _contentStrings: ContentStrings = i18n;

  @Event() public unitsChange: EventEmitter;
  @Event() public graphEnabledChange: EventEmitter;

  @Prop({ mutable: true }) public graphEnabled: boolean;
  @Prop({ mutable: true }) public graphVisible: boolean;
  @Prop({ mutable: true }) public units: Units;

  private _graphEnabled(enabled: boolean) {
    this.graphEnabled = enabled;
    this.graphEnabledChange.emit(enabled);
  }

  private _units(units: Units) {
    this.units = units;
    this.unitsChange.emit(this.units);
  }

  public renderGraphEnabled() {
    if (this.graphVisible) {
      return (
        <div>
          <ion-item
            style={{
              display: "var(--graph-enabled-display, block)"
            }}
          >
            <span title={this._contentStrings.graphEnabled}>
              {this._contentStrings.graphEnabled}
            </span>
            <ion-toggle
              slot="end"
              checked={this.graphEnabled}
              onIonChange={e => this._graphEnabled(e.detail.checked)}
            />
          </ion-item>
          <ion-item
            style={{
              display: "var(--units-display, block)"
            }}
          >
            <span title={this._contentStrings.units}>
              {this._contentStrings.units}
            </span>
            <select
              slot="end"
              onChange={e =>
                this._units((e.srcElement as HTMLSelectElement).value as Units)
              }
            >
              <option
                selected={this.units === Units.MILLIMETERS}
                value={Units.MILLIMETERS}
              >
                {this._contentStrings.millimeters}
              </option>
              <option
                selected={this.units === Units.METERS}
                value={Units.METERS}
              >
                {this._contentStrings.meters}
              </option>
            </select>
          </ion-item>
        </div>
      );
    } else {
      return <span>hello world</span>;
    }
  }

  public render() {
    return (
      <div
        style={{
          "max-width": "100%",
          "overflow-x": "hidden"
        }}
      >
        {this.renderGraphEnabled()}
      </div>
    );
  }
}
