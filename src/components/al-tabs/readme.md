# al-tabs



<!-- Auto Generated Below -->


## Events

| Event               | Description                                                                | Type                            |
| ------------------- | -------------------------------------------------------------------------- | ------------------------------- |
| `ionTabsDidChange`  | Emitted when the navigation has finished transitioning to a new component. | `CustomEvent<{ tab: string; }>` |
| `ionTabsWillChange` | Emitted when the navigation is about to transition to a new component.     | `CustomEvent<{ tab: string; }>` |


## Methods

### `getSelected() => Promise<string>`

Get the currently selected tab.

#### Returns

Type: `Promise<string>`



### `getTab(tab: any) => Promise<any>`

Get a specific tab by the value of its `tab` property or an element reference.

#### Returns

Type: `Promise<any>`



### `select(tab: any) => Promise<boolean>`

Select a tab by the value of its `tab` property or an element reference.

#### Returns

Type: `Promise<boolean>`




## Slots

| Slot       | Description                                                           |
| ---------- | --------------------------------------------------------------------- |
|            | Content is placed between the named slots if provided without a slot. |
| `"bottom"` | Content is placed at the bottom of the screen.                        |
| `"top"`    | Content is placed at the top of the screen.                           |


## Dependencies

### Used by

 - [al-control-panel](..\al-control-panel)

### Graph
```mermaid
graph TD;
  al-control-panel --> al-tabs
  style al-tabs fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
