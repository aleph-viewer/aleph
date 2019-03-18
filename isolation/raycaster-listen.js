AFRAME.registerComponent('raycaster-listen', {
	init: function () {
    // Use events to figure out what raycaster is listening so we don't have to
    // hardcode the raycaster.
    this._el.addEventListener('raycaster-intersected', evt => {
      this._raycaster = evt.detail.el;
    });
    this._el.addEventListener('raycaster-intersected-cleared', _evt => {
      this._raycaster = null;
      this._waitingForClear = false;
    });
  },

  tick: function () {
    if (!this._raycaster) { return; }  // Not intersecting.
    let intersection = this._raycaster.components.raycaster.getIntersection(this._el);
    if (!intersection) { return; }
    if (this._waitingForClear) { return; }
    this._waitingForClear = true;
    this._el.emit('intersection', { intersection: intersection }, false);
  }
});
