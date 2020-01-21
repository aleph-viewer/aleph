import { h } from "@stencil/core";
import { Constants } from "../../Constants";
import { DisplayMode, Units } from "../../enums";
import { ThreeUtils } from "../../utils";
const convertUnits = (dist, displayMode, units) => {
    if (displayMode === DisplayMode.MESH) {
        // if in mesh mode, units are always meters by default
        switch (units) {
            case Units.METERS: {
                return dist.toFixed(Constants.unitsDecimalPlaces) + units;
            }
            case Units.MILLIMETERS: {
                // convert m to mm
                return (dist / 0.001).toFixed(Constants.unitsDecimalPlaces) + units;
            }
            default: {
                break;
            }
        }
    }
    else {
        // if in volume mode, units are always millimeters by default
        switch (units) {
            case Units.METERS: {
                // convert mm to m
                return (dist / 1000.0).toFixed(Constants.unitsDecimalPlaces) + units;
            }
            case Units.MILLIMETERS: {
                return dist.toFixed(Constants.unitsDecimalPlaces) + units;
            }
            default: {
                break;
            }
        }
    }
};
export const Edges = ({ boundingSphereRadius, camera, cameraPosition, controlsType, displayMode, edges, edgeSize, fontSize, nodes, selected, units }, _children) => (() => {
    return Array.from(edges).map((n) => {
        const [edgeId, edge] = n;
        const node1 = nodes.get(edge.node1Id);
        const node2 = nodes.get(edge.node2Id);
        if (node1 && node2) {
            const sv = ThreeUtils.stringToVector3(node1.position);
            const ev = ThreeUtils.stringToVector3(node2.position);
            let dir = ev.clone().sub(sv);
            const dist = dir.length();
            dir = dir.normalize().multiplyScalar(dist * 0.5);
            const centoid = sv.clone().add(dir);
            const textOffset = new THREE.Vector3(0, 2.5, 0);
            const scale = (node1.scale + node2.scale) / 2;
            const radius = boundingSphereRadius * edgeSize;
            textOffset.multiplyScalar(scale);
            const textV = convertUnits(dist, displayMode, units);
            const frustrumDistance = ThreeUtils.getFrustrumSpaceDistance(camera, centoid.clone(), cameraPosition);
            const entityScale = (frustrumDistance / boundingSphereRadius) *
                Constants.frustrumScaleFactor;
            return (h("a-entity", { "al-child-hover-visible": true, id: edgeId + "-parent" },
                h("a-entity", { position: ThreeUtils.vector3ToString(centoid), id: edgeId + "-title-anchor", "al-billboard": `
              controlsType: ${controlsType};
              cameraPosition: ${ThreeUtils.vector3ToString(camera.position)};
              worldPosition: ${ThreeUtils.vector3ToString(centoid.clone().add(textOffset.clone()))};
            ` },
                    h("a-entity", { id: `${edgeId}-title`, text: `
                  value: ${textV};
                  side: double;
                  align: center;
                  baseline: bottom;
                  anchor: center;
                  width: ${fontSize * boundingSphereRadius}
                `, position: ThreeUtils.vector3ToString(textOffset), visible: `${selected === edgeId}`, scale: ` ${entityScale} ${entityScale} ${entityScale};`, "al-background": `
                  text: ${textV};
                  boundingRadius: ${fontSize * boundingSphereRadius};
                `, "al-render-overlaid": true })),
                h("a-entity", { class: "collidable", id: edgeId, position: ThreeUtils.vector3ToString(centoid), "al-edge": `
                length: ${dist};
                node1: ${node1.position};
                node2: ${node2.position};
                selected: ${selected === edgeId};
                radius: ${radius};
                nodeScale: ${scale};
                scale: ${entityScale};
              ` })));
        }
    });
})();
