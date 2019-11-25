# al-node-editor



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type               | Default     |
| -------- | --------- | ----------- | ------------------ | ----------- |
| `node`   | --        |             | `[string, AlNode]` | `undefined` |


## Events

| Event        | Description | Type               |
| ------------ | ----------- | ------------------ |
| `deleteNode` |             | `CustomEvent<any>` |
| `saveNode`   |             | `CustomEvent<any>` |


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
  al-node-editor --> ion-item
  al-node-editor --> ion-input
  al-node-editor --> ion-textarea
  al-node-editor --> ion-button
  al-node-editor --> ion-icon
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  al-graph-editor --> al-node-editor
  style al-node-editor fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
