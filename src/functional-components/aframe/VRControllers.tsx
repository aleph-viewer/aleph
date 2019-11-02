import { FunctionalComponent, h } from "@stencil/core";

interface VRControllersProps extends FunctionalComponentProps {}

export const VRControllers: FunctionalComponent<VRControllersProps> = (
  {},
  _children
) =>
  (() => {
    if (
      !AFRAME.utils.device.isMobile() &&
      AFRAME.utils.device.checkHeadsetConnected()
    ) {
      return (
        <a-entity id="vr-controllers">
          <a-entity
            laser-controls="hand: left"
            raycaster="objects: .collidable;"
            id="left_hand"
          />
          <a-entity
            laser-touch-controls="hand: right"
            raycaster="objects: .collidable;"
            id="right_hand"
          />
        </a-entity>
      );
    }
    return <a-entity id="vr-controllers-no-headset-or-is-mobile" />;
  })();
