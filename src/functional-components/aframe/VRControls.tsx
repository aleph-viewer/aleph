import { FunctionalComponent, h } from "@stencil/core";

interface VRControlsProps extends FunctionalComponentProps {
  enabled: boolean;
}

export const VRControls: FunctionalComponent<VRControlsProps> = (
  { enabled },
  _children
) =>
  (() => {
    if (!enabled) {
      return null;
    } else {
      return (
        <a-entity id="controllers">
          <a-entity
            laser-controls="hand: left"
            raycaster="objects: .collidable;"
            id="left_hand"
          />
          <a-entity
            laser-controls="hand: right"
            raycaster="objects: .collidable;"
            id="right_hand"
          />
        </a-entity>
      );
    }
  })();
