<p align="center">
<h1 style="fontsize: 5rem">
א
</h1>
</p>

https://aleph-viewer.com

**Aleph** is a 3D object viewer and annotation/measurement tool built with [A-Frame](https://aframe.io), [AMI](https://github.com/FNNDSC/ami), [StencilJS](http://stenciljs.com), and [Ionic](https://ionicframework.com). 

Aleph aims to satisfy the following goals:

- is usable as a web component within any page/framework and has a [Universal Viewer](http://universalviewer.io) integration
- has a supporting Control Panel (a separate web component) showing associated settings for a given mesh or volume
- is straight-forward to debug, using a single source of truth and unidirectional data flow ([redux](https://redux.js.org/))
- is themable to allow customised colour schemes (css variables)
- encapsulates 3D rendering logic in a well-defined component model, with pre-existing community support/adoption (A-Frame)
- utilises the component model to extensibly display 3D media file types (GLTF+DRACO, DICOM)
- renders 3D scenes declaratively, decoupling the presentation layer from the application layer
- permits annotation of points on a 3D mesh or volume with a title and description
- permits measurement of lengths and angles, with the potential to be extended to areas and volumes
- permits annotation/measurement data to be stored/retrieved as json
- permits slice and volume views of volumetric data, with axis/slice selection and point cloud windowing controls
- permits panning, rotating, and animated transitions between annotations/measurements
- has "in-scene" annotation/measurement tools as opposed to overlaid, permitting future AR/VR/XR use cases

Aleph can be used to display GLTF files and DICOM series. GLTF can be used in conjunction with DRACO compression.

To annotate/measure an object, open the "Settings" tab in the control panel and check "Enable Node Placement". Clicking on a 3D object will create a node which can be given a title and description. Nodes can be used as points of interest or can be connected via edges. With a node selected, SHIFT + Click to create an edge between that and another node. Edges can be used for measurement and can also be labeled with a title and description. Units of measurement can be changed in the control panel. SHIFT + Click between edges to measure angles.

## Setup

Clone the repository and run `npm install`

## Dev Builds

For development with readable sources and hot reloading run:

  npm run build:dev

## Production Builds

For minified production builds run:

  npm run build

## View on localhost

  npm start

## Design

Aleph uses a combination of [A-Frame components](https://aframe.io/docs/0.9.0/core/component.html) and [StencilJS Web Components](https://stenciljs.com/docs/component).

[Redux](https://redux.js.org) is used to manage state, with reactively-rendered A-Frame custom elements.

### A-Frame Components

  - [al-angle](/src/aframe/components/AlAngleComponent.ts)
  - [al-background](/src/aframe/components/AlBackgroundComponent.ts)
  - [al-billboard](/src/aframe/components/AlBillboardComponent.ts)
  - [al-bounding-box](/src/aframe/components/AlBoundingBoxComponent.ts)
  - [al-child-hover-visible](/src/aframe/components/AlChildHoverVisibleComponent.ts)
  - [al-control-lights](/src/aframe/components/AlControlLightsComponent.ts)
  - [al-cursor](/src/aframe/components/AlCursorComponent.ts)
  - [al-edge](/src/aframe/components/AlEdgeComponent.ts)
  - [al-gltf-model](/src/aframe/components/AlGltfModelComponent.ts)
  - [al-node](/src/aframe/components/AlNodeComponent.ts)
  - [al-node-spawner](/src/aframe/components/AlNodeSpawnerComponent.ts)
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
  - [al-graph-editor](/src/components/al-graph-editor/readme.md)
  - [al-node-editor](/src/components/al-node-editor/readme.md)
  - [al-node-list](/src/components/al-node-list/readme.md)
  - [al-settings](/src/components/al-settings/readme.md)
  - [al-tabs](/src/components/al-tabs/readme.md)
  - [al-url-picker](/src/components/al-url-picker/readme.md)
  - [al-viewer](/src/components/al-viewer/readme.md)

The two top-level web components are `<al-control-panel>` and `<al-viewer>`. `<al-control-panel>` wraps a tabs-based interface containing `<al-url-picker>`, `<al-settings>`, `<al-graph-editor>`, and `<al-console>`. `<al-viewer>` contains the A-Frame scene and all 3D rendering logic. It also contains a Redux store that acts as single source of truth for the viewer and control panel. `<al-viewer>` can be used independently of `<al-control-panel>`, which can be lazy loaded to provide additional options. 