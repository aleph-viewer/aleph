import { Component, Prop } from "@stencil/core";
import { DisplayMode, Orientation } from "../../enums";
import { Entity } from "aframe";

@Component({
  tag: "al-src",
  styleUrl: "al-src.css",
  shadow: true
})
export class AlSrc {
  @Prop() src: string | null;
  @Prop() srcLoaded: boolean;
  @Prop() displayMode: DisplayMode;
  @Prop() graphEnabled: boolean;
  @Prop() dracoDecoderPath: string;
  @Prop({ mutable: true }) targetEntity: Entity;
  @Prop() slicesIndex: number;
  @Prop() orientation: Orientation;
  @Prop() slicesWindowWidth: number;
  @Prop() slicesWindowCenter: number;
  @Prop() volumeSteps: number;
  @Prop() volumeWindowCenter: number;
  @Prop() volumeWindowWidth: number;
  @Prop() isWebGl2: boolean;

  render() {
    if (!this.src) {
      return null;
    }

    switch (this.displayMode) {
      case DisplayMode.MESH: {
        return (
          <a-entity
            class="collidable"
            al-node-spawner={`
              graphEnabled: ${this.graphEnabled};
            `}
            al-gltf-model={`
              src: url(${this.src});
              dracoDecoderPath: ${this.dracoDecoderPath};
            `}
            position="0 0 0"
            scale="1 1 1"
            ref={(el: Entity) => (this.targetEntity = el)}
          />
        );
      }
      case DisplayMode.SLICES: {
        return (
          <a-entity
            id="target-entity"
            class="collidable"
            al-node-spawner={`
              graphEnabled: ${this.graphEnabled};
            `}
            al-volume={`
              srcLoaded: ${this.srcLoaded};
              src: ${this.src};
              displayMode: ${this.displayMode};
              slicesIndex: ${this.slicesIndex};
              slicesOrientation: ${this.orientation};
              slicesWindowWidth: ${this.slicesWindowWidth};
              slicesWindowCenter: ${this.slicesWindowCenter};
              volumeSteps: ${this.volumeSteps};
              volumeWindowCenter: ${this.volumeWindowCenter};
              volumeWindowWidth: ${this.volumeWindowWidth};
              isWebGl2: ${this.isWebGl2};
            `}
            position="0 0 0"
            ref={(el: Entity) => (this.targetEntity = el)}
          />
        );
      }
      case DisplayMode.VOLUME: {
        return (
          <a-entity
            id="target-entity"
            al-volume={`
              srcLoaded: ${this.srcLoaded};
              src: ${this.src};
              displayMode: ${this.displayMode};
              slicesIndex: ${this.slicesIndex};
              slicesOrientation: ${this.orientation};
              slicesWindowWidth: ${this.slicesWindowWidth};
              slicesWindowCenter: ${this.slicesWindowCenter};
              volumeSteps: ${this.volumeSteps};
              volumeWindowCenter: ${this.volumeWindowCenter};
              volumeWindowWidth: ${this.volumeWindowWidth};
              isWebGl2: ${this.isWebGl2};
            `}
            position="0 0 0"
            ref={(el: Entity) => (this.targetEntity = el)}
          />
        );
      }
    }
  }
}
