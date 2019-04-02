# al-control-panel



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute              | Description | Type                                                                   | Default                  |
| -------------------- | ---------------------- | ----------- | ---------------------------------------------------------------------- | ------------------------ |
| `boundingBoxVisible` | `bounding-box-visible` |             | `boolean`                                                              | `false`                  |
| `cameraType`         | `camera-type`          |             | `CameraType.NONE \| CameraType.ORTHOGRAPHIC \| CameraType.PERSPECTIVE` | `CameraType.PERSPECTIVE` |
| `displayMode`        | `display-mode`         |             | `DisplayMode.MESH \| DisplayMode.SLICES \| DisplayMode.VOLUME`         | `DisplayMode.MESH`       |
| `nodesEnabled`       | `nodes-enabled`        |             | `boolean`                                                              | `false`                  |
| `nodesVisible`       | `nodes-visible`        |             | `boolean`                                                              | `true`                   |
| `optionsEnabled`     | `options-enabled`      |             | `boolean`                                                              | `false`                  |
| `optionsVisible`     | `options-visible`      |             | `boolean`                                                              | `true`                   |
| `orientation`        | `orientation`          |             | `Orientation.AXIAL \| Orientation.CORONAL \| Orientation.SAGGITAL`     | `Orientation.CORONAL`    |
| `slicesIndex`        | `slices-index`         |             | `number`                                                               | `undefined`              |
| `slicesWindowCenter` | `slices-window-center` |             | `number`                                                               | `undefined`              |
| `slicesWindowWidth`  | `slices-window-width`  |             | `number`                                                               | `undefined`              |
| `stack`              | `stack`                |             | `any`                                                                  | `undefined`              |
| `stackHelper`        | --                     |             | `StackHelper`                                                          | `undefined`              |
| `volumeSteps`        | `volume-steps`         |             | `number`                                                               | `undefined`              |
| `volumeWindowCenter` | `volume-window-center` |             | `number`                                                               | `undefined`              |
| `volumeWindowWidth`  | `volume-window-width`  |             | `number`                                                               | `undefined`              |


## Events

| Event                     | Description | Type                |
| ------------------------- | ----------- | ------------------- |
| `onSetBoundingBoxVisible` |             | `CustomEvent<void>` |
| `onSetCameraType`         |             | `CustomEvent<void>` |
| `onSetDisplayMode`        |             | `CustomEvent<void>` |
| `onSetNodesEnabled`       |             | `CustomEvent<void>` |
| `onSetOptionsEnabled`     |             | `CustomEvent<void>` |
| `onSetOrientation`        |             | `CustomEvent<void>` |
| `onSetSlicesIndex`        |             | `CustomEvent<void>` |
| `onSetSlicesWindowCenter` |             | `CustomEvent<void>` |
| `onSetSlicesWindowWidth`  |             | `CustomEvent<void>` |
| `onSetVolumeSteps`        |             | `CustomEvent<void>` |
| `onSetVolumeWindowCenter` |             | `CustomEvent<void>` |
| `onSetVolumeWindowWidth`  |             | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
