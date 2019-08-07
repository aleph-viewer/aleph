export class AlGltfModelEvents {
  public static LOADED: string = 'al-model-loaded';
  public static ERROR: string = 'al-model-error';
}

export default AFRAME.registerComponent('al-gltf-model', {
  schema: {
    src: { type: 'model', default: '' },
    dracoDecoderPath: { type: 'string', default: '' }
  },

  init(): void {
    this.bindMethods();
    this.addEventListeners();
    this.model = null;

    // tslint:disable-next-line: no-any
    const threeAny = THREE as any;

    this.loader = new threeAny.GLTFLoader();
    threeAny.DRACOLoader.setDecoderPath(this.data.dracoDecoderPath);
    this.loader.setDRACOLoader(new threeAny.DRACOLoader());
  },

  // tslint:disable-next-line: no-empty
  bindMethods(): void {},

  // tslint:disable-next-line: no-empty
  addEventListeners(): void {},

  // tslint:disable-next-line: no-empty
  removeEventListeners(): void {},

  // tslint:disable-next-line: no-any
  update(oldData: any): void {
    const self = this;
    const el = this.el;
    const src = this.data.src;

    if (oldData && oldData.src !== src) {
      this.remove();

      this.loader.load(
        src,
        // tslint:disable-next-line: typedef
        function gltfLoaded(gltfModel) {
          self.model = gltfModel.scene || gltfModel.scenes[0];
          self.model.animations = gltfModel.animations;
          // The "mesh" is actually a whole GLTF scene
          el.setObject3D('mesh', self.model);

          el.sceneEl.emit(
            AlGltfModelEvents.LOADED,
            {
              format: 'gltf',
              model: self.model
            },
            false
          );
        },
        undefined /* onProgress */,
        // tslint:disable-next-line: typedef
        function gltfFailed(error) {
          const message =
            error && error.message
              ? error.message
              : 'Failed to load glTF model';
          console.warn(message);
          el.sceneEl.emit(
            AlGltfModelEvents.ERROR,
            {
              format: 'gltf',
              src
            },
            false
          );
        }
      );
    }
  },

  remove(): void {
    if (!this.model) {
      return;
    }
    this.removeEventListeners();
    this.el.removeObject3D('mesh');
  }
});
