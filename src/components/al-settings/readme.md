# al-settings



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                   | Description | Type                                                               | Default     |
| ------------------------ | --------------------------- | ----------- | ------------------------------------------------------------------ | ----------- |
| `displayMode`            | `display-mode`              |             | `DisplayMode.MESH \| DisplayMode.SLICES \| DisplayMode.VOLUME`     | `undefined` |
| `orientation`            | `orientation`               |             | `Orientation.AXIAL \| Orientation.CORONAL \| Orientation.SAGGITAL` | `undefined` |
| `slicesBrightness`       | `slices-brightness`         |             | `number`                                                           | `undefined` |
| `slicesContrast`         | `slices-contrast`           |             | `number`                                                           | `undefined` |
| `slicesIndex`            | `slices-index`              |             | `number`                                                           | `undefined` |
| `slicesMaxIndex`         | `slices-max-index`          |             | `number`                                                           | `undefined` |
| `volumeBrightness`       | `volume-brightness`         |             | `number`                                                           | `undefined` |
| `volumeContrast`         | `volume-contrast`           |             | `number`                                                           | `undefined` |
| `volumeSteps`            | `volume-steps`              |             | `number`                                                           | `undefined` |
| `volumeStepsHighEnabled` | `volume-steps-high-enabled` |             | `boolean`                                                          | `undefined` |


## Events

| Event                          | Description | Type               |
| ------------------------------ | ----------- | ------------------ |
| `displayModeChange`            |             | `CustomEvent<any>` |
| `orientationChange`            |             | `CustomEvent<any>` |
| `slicesBrightnessChange`       |             | `CustomEvent<any>` |
| `slicesContrastChange`         |             | `CustomEvent<any>` |
| `slicesIndexChange`            |             | `CustomEvent<any>` |
| `volumeBrightnessChange`       |             | `CustomEvent<any>` |
| `volumeContrastChange`         |             | `CustomEvent<any>` |
| `volumeStepsChange`            |             | `CustomEvent<any>` |
| `volumeStepsHighEnabledChange` |             | `CustomEvent<any>` |


## CSS Custom Properties

| Name                             | Description                         |
| -------------------------------- | ----------------------------------- |
| `--bounding-box-enabled-display` | Bounding Box Enabled Toggle Display |
| `--display-mode-display`         | Display Mode Toggle Display         |
| `--graph-enabled-display`        | Graph Enabled Toggle Display        |
| `--slices-index-display`         | Slices Index Range Display          |
| `--slices-orientation-display`   | Slices Orientation Select Display   |
| `--slices-window-center-display` | Slices Window Center Range Display  |
| `--slices-window-width-display`  | Slices Window Width Range Display   |
| `--volume-steps-display`         | Volume Steps Range Display          |
| `--volume-window-center-display` | Volume Window Center Range Display  |
| `--volume-window-width-display`  | Volume Window Width Range Display   |


## Dependencies

### Used by

 - [al-control-panel](..\al-control-panel)

### Depends on

- ion-item
- ion-icon
- ion-toggle
- ion-range
- ion-list-header

### Graph
```mermaid
graph TD;
  al-settings --> ion-item
  al-settings --> ion-icon
  al-settings --> ion-toggle
  al-settings --> ion-range
  al-settings --> ion-list-header
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  al-control-panel --> al-settings
  style al-settings fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
