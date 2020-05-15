# al-console



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description | Type     | Default |
| --------- | ---------- | ----------- | -------- | ------- |
| `graph`   | `graph`    |             | `string` | `null`  |
| `tabSize` | `tab-size` |             | `number` | `2`     |


## Events

| Event            | Description | Type               |
| ---------------- | ----------- | ------------------ |
| `graphSubmitted` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [al-control-panel](..\al-control-panel)

### Depends on

- ion-item
- ion-textarea
- ion-button
- ion-icon

### Graph
```mermaid
graph TD;
  al-console --> ion-item
  al-console --> ion-textarea
  al-console --> ion-button
  al-console --> ion-icon
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  al-control-panel --> al-console
  style al-console fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
