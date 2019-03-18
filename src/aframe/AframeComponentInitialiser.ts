import { raycastListener } from './RaycastListener';
import { halo } from './Halo';
import { tool } from './Tool';

export class AframeComponentInitialiser {
    public static initialise() {
        console.log('aframe');
        AFRAME.registerComponent('raycast-listener', raycastListener);
        AFRAME.registerComponent('halo', halo);
        AFRAME.registerComponent('tool', tool);
    }
}
