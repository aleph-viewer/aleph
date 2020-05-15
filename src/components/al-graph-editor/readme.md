# al-graph-editor



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type                                | Default     |
| -------------- | --------------- | ----------- | ----------------------------------- | ----------- |
| `angles`       | --              |             | `Map<string, AlAngle>`              | `null`      |
| `edges`        | --              |             | `Map<string, AlEdge>`               | `null`      |
| `graphEnabled` | `graph-enabled` |             | `boolean`                           | `undefined` |
| `graphVisible` | `graph-visible` |             | `boolean`                           | `undefined` |
| `node`         | --              |             | `[string, AlNode]`                  | `undefined` |
| `nodes`        | --              |             | `Map<string, AlNode>`               | `null`      |
| `selected`     | `selected`      |             | `string`                            | `null`      |
| `units`        | `units`         |             | `Units.METERS \| Units.MILLIMETERS` | `undefined` |


## Dependencies

### Used by

 - [al-control-panel](..\al-control-panel)

### Depends on

- [al-graph-settings](..\al-graph-settings)
- [al-node-list](..\al-node-list)
- ion-item-divider
- [al-node-editor](..\al-node-editor)
- [al-edge-editor](..\al-edge-editor)
- [al-angle-editor](..\al-angle-editor)

### Graph
```mermaid
graph TD;
  al-graph-editor --> al-graph-settings
  al-graph-editor --> al-node-list
  al-graph-editor --> ion-item-divider
  al-graph-editor --> al-node-editor
  al-graph-editor --> al-edge-editor
  al-graph-editor --> al-angle-editor
  al-graph-settings --> ion-item
  al-graph-settings --> ion-toggle
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  al-node-list --> ion-list
  al-node-list --> ion-item
  al-node-editor --> ion-item
  al-node-editor --> ion-input
  al-node-editor --> ion-textarea
  al-node-editor --> ion-button
  al-node-editor --> ion-icon
  ion-button --> ion-ripple-effect
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
  al-control-panel --> al-graph-editor
  style al-graph-editor fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
