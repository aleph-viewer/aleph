import { Constants } from "../../Constants";
export default AFRAME.registerComponent("al-render-order", {
    schema: {
        order: { type: "number", default: Constants.topLayerRenderOrder }
    },
    init() {
        this.bindMethods();
        this.addEventListeners();
        Object.keys(this.el.object3DMap).forEach(key => {
            this.el.object3DMap[key].renderOrder = this.data.order;
        });
    },
    // tslint:disable-next-line: no-empty
    bindMethods() { },
    // tslint:disable-next-line: no-empty
    addEventListeners() { },
    // tslint:disable-next-line: no-empty
    removeEventListeners() { },
    update() {
        Object.keys(this.el.object3DMap).forEach(key => {
            this.el.object3DMap[key].renderOrder = this.data.order;
        });
    },
    remove() {
        this.removeEventListeners();
    }
});
