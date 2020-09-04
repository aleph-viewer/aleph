# al-url-picker



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                  | Default |
| -------- | --------- | ----------- | --------------------- | ------- |
| `url`    | `url`     |             | `string`              | `null`  |
| `urls`   | --        |             | `Map<string, string>` | `null`  |


## Events

| Event       | Description | Type               |
| ----------- | ----------- | ------------------ |
| `urlChange` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [al-control-panel](..\al-control-panel)

### Depends on

- ion-item
- ion-select
- ion-select-option
- ion-input
- ion-button
- ion-icon

### Graph
```mermaid
graph TD;
  al-url-picker --> ion-item
  al-url-picker --> ion-select
  al-url-picker --> ion-select-option
  al-url-picker --> ion-input
  al-url-picker --> ion-button
  al-url-picker --> ion-icon
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  al-control-panel --> al-url-picker
  style al-url-picker fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
