# al-node-list



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type                  | Default |
| ---------- | ---------- | ----------- | --------------------- | ------- |
| `nodes`    | --         |             | `Map<string, AlNode>` | `null`  |
| `selected` | `selected` |             | `string`              | `null`  |


## Events

| Event            | Description | Type               |
| ---------------- | ----------- | ------------------ |
| `selectedChange` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [al-graph-editor](../al-graph-editor)

### Depends on

- ion-list
- ion-item

### Graph
```mermaid
graph TD;
  al-node-list --> ion-list
  al-node-list --> ion-item
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  al-graph-editor --> al-node-list
  style al-node-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
