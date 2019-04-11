# al-control-panel



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute              | Description | Type                                                               | Default               |
| -------------------- | ---------------------- | ----------- | ------------------------------------------------------------------ | --------------------- |
| `boundingBoxVisible` | `bounding-box-visible` |             | `boolean`                                                          | `false`               |
| `displayMode`        | `display-mode`         |             | `DisplayMode.MESH \| DisplayMode.SLICES \| DisplayMode.VOLUME`     | `DisplayMode.MESH`    |
| `graphEnabled`       | `graph-enabled`        |             | `boolean`                                                          | `false`               |
| `graphVisible`       | `graph-visible`        |             | `boolean`                                                          | `true`                |
| `optionsEnabled`     | `options-enabled`      |             | `boolean`                                                          | `true`                |
| `optionsVisible`     | `options-visible`      |             | `boolean`                                                          | `true`                |
| `orientation`        | `orientation`          |             | `Orientation.AXIAL \| Orientation.CORONAL \| Orientation.SAGGITAL` | `Orientation.CORONAL` |
| `slicesIndex`        | `slices-index`         |             | `number`                                                           | `undefined`           |
| `slicesWindowCenter` | `slices-window-center` |             | `number`                                                           | `undefined`           |
| `slicesWindowWidth`  | `slices-window-width`  |             | `number`                                                           | `undefined`           |
| `stack`              | `stack`                |             | `any`                                                              | `undefined`           |
| `stackhelper`        | --                     |             | `StackHelper \| VolumeRenderingHelper`                             | `undefined`           |
| `volumeSteps`        | `volume-steps`         |             | `number`                                                           | `undefined`           |
| `volumeWindowCenter` | `volume-window-center` |             | `number`                                                           | `undefined`           |
| `volumeWindowWidth`  | `volume-window-width`  |             | `number`                                                           | `undefined`           |


## Events

| Event                         | Description | Type                |
| ----------------------------- | ----------- | ------------------- |
| `onBoundingBoxVisibleChanged` |             | `CustomEvent<void>` |
| `onDisplayModeChanged`        |             | `CustomEvent<void>` |
| `onGraphEnabledChanged`       |             | `CustomEvent<void>` |
| `onOptionsEnabledChanged`     |             | `CustomEvent<void>` |
| `onOrientationChanged`        |             | `CustomEvent<void>` |
| `onSlicesIndexChanged`        |             | `CustomEvent<void>` |
| `onSlicesWindowCenterChanged` |             | `CustomEvent<void>` |
| `onSlicesWindowWidthChanged`  |             | `CustomEvent<void>` |
| `onVolumeStepsChanged`        |             | `CustomEvent<void>` |
| `onVolumeWindowCenterChanged` |             | `CustomEvent<void>` |
| `onVolumeWindowWidthChanged`  |             | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
