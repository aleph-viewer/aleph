# al-angle-editor



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                | Default     |
| -------- | --------- | ----------- | ------------------- | ----------- |
| `angle`  | --        |             | `[string, AlAngle]` | `undefined` |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `deleteAngle` |             | `CustomEvent<any>` |
| `saveAngle`   |             | `CustomEvent<any>` |


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
  al-angle-editor --> ion-item
  al-angle-editor --> ion-input
  al-angle-editor --> ion-textarea
  al-angle-editor --> ion-button
  al-angle-editor --> ion-icon
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  al-graph-editor --> al-angle-editor
  style al-angle-editor fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
