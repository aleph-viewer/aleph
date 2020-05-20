# al-control-panel



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                   | Description | Type                                                               | Default     |
| ------------------------ | --------------------------- | ----------- | ------------------------------------------------------------------ | ----------- |
| `angles`                 | --                          |             | `Map<string, AlAngle>`                                             | `null`      |
| `boundingBoxEnabled`     | `bounding-box-enabled`      |             | `boolean`                                                          | `undefined` |
| `consoleTabEnabled`      | `console-tab-enabled`       |             | `boolean`                                                          | `true`      |
| `controlsType`           | `controls-type`             |             | `ControlsType.ORBIT \| ControlsType.TRACKBALL`                     | `undefined` |
| `displayMode`            | `display-mode`              |             | `DisplayMode.MESH \| DisplayMode.SLICES \| DisplayMode.VOLUME`     | `undefined` |
| `edges`                  | --                          |             | `Map<string, AlEdge>`                                              | `null`      |
| `graphEnabled`           | `graph-enabled`             |             | `boolean`                                                          | `undefined` |
| `graphTabEnabled`        | `graph-tab-enabled`         |             | `boolean`                                                          | `true`      |
| `nodes`                  | --                          |             | `Map<string, AlNode>`                                              | `null`      |
| `orientation`            | `orientation`               |             | `Orientation.AXIAL \| Orientation.CORONAL \| Orientation.SAGGITAL` | `undefined` |
| `selected`               | `selected`                  |             | `string`                                                           | `null`      |
| `settingsTabEnabled`     | `settings-tab-enabled`      |             | `boolean`                                                          | `true`      |
| `slicesBrightness`       | `slices-brightness`         |             | `number`                                                           | `undefined` |
| `slicesContrast`         | `slices-contrast`           |             | `number`                                                           | `undefined` |
| `slicesIndex`            | `slices-index`              |             | `number`                                                           | `undefined` |
| `slicesMaxIndex`         | `slices-max-index`          |             | `number`                                                           | `undefined` |
| `srcTabEnabled`          | `src-tab-enabled`           |             | `boolean`                                                          | `true`      |
| `tabContentHeight`       | `tab-content-height`        |             | `string`                                                           | `null`      |
| `units`                  | `units`                     |             | `Units.METERS \| Units.MILLIMETERS`                                | `undefined` |
| `url`                    | `url`                       |             | `string`                                                           | `null`      |
| `urls`                   | --                          |             | `Map<string, string>`                                              | `null`      |
| `volumeBrightness`       | `volume-brightness`         |             | `number`                                                           | `undefined` |
| `volumeContrast`         | `volume-contrast`           |             | `number`                                                           | `undefined` |
| `volumeSteps`            | `volume-steps`              |             | `number`                                                           | `undefined` |
| `volumeStepsHighEnabled` | `volume-steps-high-enabled` |             | `boolean`                                                          | `undefined` |


## Dependencies

### Depends on

- ion-app
- [al-tabs](..\al-tabs)
- ion-tab-bar
- ion-tab-button
- ion-icon
- ion-label
- ion-tab
- [al-view-controls](..\al-view-controls)
- [al-url-picker](..\al-url-picker)
- [al-settings](..\al-settings)
- [al-graph-editor](..\al-graph-editor)
- [al-console](..\al-console)

### Graph
```mermaid
graph TD;
  al-control-panel --> ion-app
  al-control-panel --> al-tabs
  al-control-panel --> ion-tab-bar
  al-control-panel --> ion-tab-button
  al-control-panel --> ion-icon
  al-control-panel --> ion-label
  al-control-panel --> ion-tab
  al-control-panel --> al-view-controls
  al-control-panel --> al-url-picker
  al-control-panel --> al-settings
  al-control-panel --> al-graph-editor
  al-control-panel --> al-console
  ion-tab-button --> ion-ripple-effect
  al-view-controls --> ion-button
  al-view-controls --> ion-icon
  ion-button --> ion-ripple-effect
  al-url-picker --> ion-item
  al-url-picker --> ion-select
  al-url-picker --> ion-select-option
  al-url-picker --> ion-input
  al-url-picker --> ion-button
  al-url-picker --> ion-icon
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  al-settings --> ion-item
  al-settings --> ion-icon
  al-settings --> ion-toggle
  al-settings --> ion-range
  al-settings --> ion-list-header
  al-graph-editor --> al-graph-settings
  al-graph-editor --> al-node-list
  al-graph-editor --> ion-item-divider
  al-graph-editor --> al-node-editor
  al-graph-editor --> al-edge-editor
  al-graph-editor --> al-angle-editor
  al-graph-settings --> ion-item
  al-graph-settings --> ion-toggle
  al-node-list --> ion-list
  al-node-list --> ion-item
  al-node-editor --> ion-item
  al-node-editor --> ion-input
  al-node-editor --> ion-textarea
  al-node-editor --> ion-button
  al-node-editor --> ion-icon
  al-edge-editor --> ion-item
  al-edge-editor --> ion-input
  al-edge-editor --> ion-textarea
  al-edge-editor --> ion-button
  al-edge-editor --> ion-icon
  al-angle-editor --> ion-item
  al-angle-editor --> ion-input
  al-angle-editor --> ion-textarea
  al-angle-editor --> ion-button
  al-angle-editor --> ion-icon
  al-console --> ion-item
  al-console --> ion-textarea
  al-console --> ion-button
  al-console --> ion-icon
  style al-control-panel fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
