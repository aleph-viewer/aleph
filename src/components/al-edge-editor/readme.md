# al-edge-editor



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type               | Default     |
| -------- | --------- | ----------- | ------------------ | ----------- |
| `edge`   | --        |             | `[string, AlEdge]` | `undefined` |


## Events

| Event        | Description | Type               |
| ------------ | ----------- | ------------------ |
| `deleteEdge` |             | `CustomEvent<any>` |
| `saveEdge`   |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [al-graph-editor](..\al-graph-editor)

### Depends on

- ion-item
- ion-input
- ion-textarea
- ion-button
- ion-icon

### Graph
```mermaid
graph TD;
  al-edge-editor --> ion-item
  al-edge-editor --> ion-input
  al-edge-editor --> ion-textarea
  al-edge-editor --> ion-button
  al-edge-editor --> ion-icon
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  al-graph-editor --> al-edge-editor
  style al-edge-editor fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
