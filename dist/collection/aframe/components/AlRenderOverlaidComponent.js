import { Constants } from "../../Constants";
export default AFRAME.registerComponent("al-render-overlaid", {
    schema: {},
    // tslint:disable-next-line: no-any
    init(_data) {
        this.bindMethods();
        this.addEventListeners();
        this.setDepth(this.el.object3DMap.mesh);
        this.setDepth(this.el.object3DMap.text);
    },
    // tslint:disable-next-line: no-empty
    bindMethods() { },
    // tslint:disable-next-line: no-empty
    addEventListeners() { },
    // tslint:disable-next-line: no-empty
    removeEventListeners() { },
    setDepth(mesh) {
        if (mesh) {
            mesh.renderOrder = Constants.topLayerRenderOrder;
            if (mesh.material) {
                mesh.material.depthTest = false;
            }
        }
    },
    remove() {
        this.removeEventListeners();
    }
});
