/**
 * glTF model loader.
 */
AFRAME.registerComponent('al-gltf-model', {
  schema: {
    src: {type: 'model', default: ''},
    dracoDecoderPath: {type: 'string', default: ''}
  },

  init: function () {
    this.model = null;
    this.loader = new THREE.GLTFLoader();
    THREE.DRACOLoader.setDecoderPath(this.data.dracoDecoderPath);
    this.loader.setDRACOLoader(new THREE.DRACOLoader());
  },

  update: function () {
    var self = this;
    var el = this.el;
    var src = this.data.src;

    if (!src) { return; }

    this.remove();

    this.loader.load(src, function gltfLoaded (gltfModel) {
      self.model = gltfModel.scene || gltfModel.scenes[0];
      self.model.animations = gltfModel.animations;
      el.setObject3D('mesh', self.model);
      el.emit('model-loaded', {format: 'gltf', model: self.model});
    }, undefined /* onProgress */, function gltfFailed (error) {
      var message = (error && error.message) ? error.message : 'Failed to load glTF model';
      warn(message);
      el.emit('model-error', {format: 'gltf', src: src});
    });
  },

  remove: function () {
    if (!this.model) { return; }
    this.el.removeObject3D('mesh');
  }
});
