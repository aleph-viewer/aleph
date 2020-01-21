import { h } from "@stencil/core";
import { Constants } from "../../Constants";
import { ThreeUtils } from "../../utils";
export const Nodes = ({ boundingSphereRadius, camera, cameraPosition, controlsType, fontSize, graphEnabled, nodes, selected }, _children) => (() => {
    return Array.from(nodes).map((n) => {
        const [nodeId, node] = n;
        const frustrumDistance = ThreeUtils.getFrustrumSpaceDistance(camera, ThreeUtils.stringToVector3(node.position), cameraPosition);
        const entityScale = (frustrumDistance / boundingSphereRadius) *
            Constants.frustrumScaleFactor;
        const textOffset = new THREE.Vector3(0, 3 * entityScale, 0);
        textOffset.multiplyScalar(node.scale);
        return (h("a-entity", { "al-child-hover-visible": true, id: nodeId + "-parent" },
            h("a-entity", { position: node.position, id: nodeId + "-title-anchor", "al-billboard": `
              controlsType: ${controlsType};
              cameraPosition: ${ThreeUtils.vector3ToString(camera.position)};
              worldPosition: ${ThreeUtils.vector3ToString(ThreeUtils.stringToVector3(node.position).add(textOffset.clone()))};
            ` },
                h("a-entity", { text: `
                value: ${node.title};
                side: double;
                align: center;
                baseline: bottom;
                anchor: center;
                width: ${fontSize * boundingSphereRadius};
                zOffset: ${0.0000001};
              `, position: ThreeUtils.vector3ToString(textOffset), "al-render-overlaid": true, visible: `${selected === nodeId}`, id: `${nodeId}-label`, "al-background": `
                  text: ${node.title};
                  boundingRadius: ${fontSize * boundingSphereRadius};
              `, scale: ` ${entityScale} ${entityScale} ${entityScale};` })),
            h("a-entity", { class: "collidable", id: nodeId, position: node.position, "al-node": `
              scale: ${node.scale};
              selected: ${selected === nodeId};
              graphEnabled: ${graphEnabled};
            `, scale: ` ${entityScale} ${entityScale} ${entityScale};` })));
    });
})();
