import AframeComponent from "../interfaces/AframeComponent";

export const tool = {
  schema: {
    color: {default: '#FFF'},
    position: {default: '0 0 0'}
  },

  init: function () {},

  update: function () {

  },

  tick: function () {
    console.log('tool');
  },

  remove: function () {},

  pause: function () {},

  play: function () {}

} as AframeComponent;