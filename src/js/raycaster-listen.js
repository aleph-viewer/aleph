AFRAME.registerComponent('raycaster-listen', {
	init: function () {
    // Use events to figure out what raycaster is listening so we don't have to
    // hardcode the raycaster.
    this.el.addEventListener('raycaster-intersected', evt => {
      this.raycaster = evt.detail.el;
    });
    this.el.addEventListener('raycaster-intersected-cleared', evt => {
      this.raycaster = null;
      this.waitingForClear = false;
    });
  },

  tick: function () {
    if (!this.raycaster) { return; }  // Not intersecting.
    let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
    if (!intersection) { return; }
    if (this.waitingForClear) { return; }
    this.waitingForClear = true;
    this.el.emit('intersection', { intersection: intersection }, false);
  }
});
