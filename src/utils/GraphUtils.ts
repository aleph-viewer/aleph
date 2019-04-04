import { AlNodeSerial, AlEdgeSerial, AlAngleSerial } from "../interfaces";

export class AlGraphEvents {
    static SELECTED: string = "al-graph-selected";
    static INTERSECTION: string = "al-graph-intersection";
    static INTERSECTION_CLEARED: string = "al-graph-intersection-cleared";
    static DRAGGING: string = "al-graph-dragging";
    static CONTROLS_ENABLED: string = "al-graph-controls-enabled";
    static CONTROLS_DISABLED: string = "al-graph-controls-disabled";
}

export class GraphUtils {
    static getNodeWithHighestId(nodes: Map<string, AlNodeSerial>): number {
        if (nodes.size) {
          return Math.max.apply(
            Math,
            [...nodes].map(([nodeId]) => {
              return this.getNodeIdNumber(nodeId);
            })
          );
        }
    
        return -1;
      }
    
      static getEdgeWithHighestId(edges: Map<string, AlEdgeSerial>): number {
        if (edges.size) {
          return Math.max.apply(
            Math,
            [...edges].map(([edgeId]) => {
              return this.getNodeIdNumber(edgeId);
            })
          );
        }
    
        return -1;
      }
    
      static getAngleWithHighestId(angles: Map<string, AlAngleSerial>): number {
        if (angles.size) {
          return Math.max.apply(
            Math,
            [...angles].map(([angleId]) => {
              return this.getNodeIdNumber(angleId);
            })
          );
        }
    
        return -1;
      }
    
      static getNodeIdNumber(nodeId: string): number {
        return Number(nodeId.split("-")[1]);
      }
    
      static getNextNodeId(nodes: Map<string, AlNodeSerial>): string {
        return "node-" + Number(this.getNodeWithHighestId(nodes) + 1);
      }
    
      static getNextEdgeId(edges: Map<string, AlEdgeSerial>): string {
        return "edge-" + Number(this.getEdgeWithHighestId(edges) + 1);
      }
    
      static getNextAngleId(angles: Map<string, AlAngleSerial>): string {
        return "angle-" + Number(this.getAngleWithHighestId(angles) + 1);
      }
}