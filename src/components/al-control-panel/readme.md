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
| `stackhelper`        | --                     |             | `StackHelper \| VolumeRenderHelper`                             | `undefined`           |
| `volumeSteps`        | `volume-steps`         |             | `number`                                                           | `undefined`           |
| `volumeWindowCenter` | `volume-window-center` |             | `number`                                                           | `undefined`           |
| `volumeWindowWidth`  | `volume-window-width`  |             | `number`                                                           | `undefined`           |


## Events

| Event                       | Description | Type                |
| --------------------------- | ----------- | ------------------- |
| `boundingBoxVisibleChanged` |             | `CustomEvent<void>` |
| `displayModeChanged`        |             | `CustomEvent<void>` |
| `graphEnabledChanged`       |             | `CustomEvent<void>` |
| `optionsEnabledChanged`     |             | `CustomEvent<void>` |
| `orientationChanged`        |             | `CustomEvent<void>` |
| `slicesIndexChanged`        |             | `CustomEvent<void>` |
| `slicesWindowCenterChanged` |             | `CustomEvent<void>` |
| `slicesWindowWidthChanged`  |             | `CustomEvent<void>` |
| `volumeStepsChanged`        |             | `CustomEvent<void>` |
| `volumeWindowCenterChanged` |             | `CustomEvent<void>` |
| `volumeWindowWidthChanged`  |             | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
