<p align="center">
<h1 style="fontsize: 5rem">
א
</h1>
</p>

**Aleph** is a 3D object viewer and annotation/measurement tool built with [A-Frame](https://aframe.io), [AMI](https://github.com/FNNDSC/ami), and [StencilJS](http://stenciljs.com).

It can be used to display GLTF and DICOM files. GLTF can be used in conjunction with DRACO compression. DICOM series must be [represented as a json array](https://www.morphosource.org/media/morphosource/dcm_sample/ptilocercus/dcm_multi_vf300_jpegQ95_16bit_allslices.json).

## Dev Builds

  npm run build:dev

## Production Builds

  npm run build

## View on localhost

  npm start

## Design

Aleph is highly componentised, using a combination of reusable [A-Frame components](https://aframe.io/docs/0.9.0/core/component.html) and [StencilJS Web Components](https://stenciljs.com/docs/decorators).

[Redux](https://redux.js.org) is used to manage state, with A-Frame custom elements rendered reactively.

### A-Frame Components

  - [al-angle](/src/aframe/components/AlAngleComponent.ts)
  - [al-background](/src/aframe/components/AlBackgroundComponent.ts)
  - [al-billboard](/src/aframe/components/AlBillboardComponent.ts)
  - [al-bounding-box](/src/aframe/components/AlBoundingBoxComponent.ts)
  - [al-cursor](/src/aframe/components/AlCursorComponent.ts)
  - [al-edge](/src/aframe/components/AlEdgeComponent.ts)
  - [al-fixed-to-orbit-camera](/src/aframe/components/AlFixedToOrbitCamera.ts)
  - [al-gltf-model](/src/aframe/components/AlGltfModelComponent.ts)
  - [al-node-spawner](/src/aframe/components/AlNodeSpawnerComponent.ts)
  - [al-node](/src/aframe/components/AlNodeComponent.ts)
  - [al-orbit-control](/src/aframe/components/AlOrbitControlComponent.ts)
  - [al-render-order](/src/aframe/components/AlRenderOrderComponent.ts)
  - [al-render-overlaid](/src/aframe/components/AlRenderOverlaidComponent.ts)
  - [al-trackball-control](/src/aframe/components/AlTrackballControlComponent.ts)
  - [al-volume](/src/aframe/components/AlVolumeComponent.ts)

### StencilJS Web Components

  - [al-angle-editor](/src/components/al-angle-editor/readme.md)
  - [al-console](/src/components/al-console/readme.md)
  - [al-control-panel](/src/components/al-control-panel/readme.md)
  - [al-edge-editor](/src/components/al-edge-editor/readme.md)
  - [al-node-editor](/src/components/al-node-editor/readme.md)
  - [al-node-list](/src/components/al-node-list/readme.md)
  - [al-settings](/src/components/al-settings/readme.md)
  - [al-tabs](/src/components/al-tabs/readme.md)
  - [al-url-picker](/src/components/al-url-picker/readme.md)
  - [al-viewer](/src/components/al-viewer/readme.md)

The two top-level components are `al-control-panel` and `al-viewer`. `al-control-panel` wraps up the tabs-based interface containing `al-url-picker`, `al-settings`, `al-graph-editor`, and `al-console`. `al-viewer` contains the A-Frame scene and all 3D rendering logic. It also contains the Redux store and acts as single source of truth. `al-viewer` can be used without `al-control-panel`, which provides additional options. 

## Example

https://aframe-viewer.com