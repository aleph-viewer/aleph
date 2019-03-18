AFRAME.registerComponent('tool', {
  schema: {
    color: {default: '#FFF'},
    position: {default: '0 0 0'}
  },
  init: function () {
    console.log('init tool', this);
  },
  update: function () {

  },
  tick: function () {
    //console.log('tool');
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});
