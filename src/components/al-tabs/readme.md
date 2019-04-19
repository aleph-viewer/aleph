# al-tabs



<!-- Auto Generated Below -->


## Events

| Event               | Description                                                                | Type                           |
| ------------------- | -------------------------------------------------------------------------- | ------------------------------ |
| `ionTabsDidChange`  | Emitted when the navigation has finished transitioning to a new component. | `CustomEvent<{ tab: string }>` |
| `ionTabsWillChange` | Emitted when the navigation is about to transition to a new component.     | `CustomEvent<{ tab: string }>` |


## Methods

### `getSelected() => Promise<string>`

Get the currently selected tab

#### Returns

Type: `Promise<string>`



### `getTab(tab: any) => Promise<any>`

Get the tab element given the tab name

#### Parameters

| Name  | Type  | Description |
| ----- | ----- | ----------- |
| `tab` | `any` |             |

#### Returns

Type: `Promise<any>`



### `select(tab: any) => Promise<boolean>`

Index or the Tab instance, of the tab to select.

#### Parameters

| Name  | Type  | Description |
| ----- | ----- | ----------- |
| `tab` | `any` |             |

#### Returns

Type: `Promise<boolean>`




## Slots

| Slot       | Description                                                           |
| ---------- | --------------------------------------------------------------------- |
|            | Content is placed between the named slots if provided without a slot. |
| `"bottom"` | Content is placed at the bottom of the screen.                        |
| `"top"`    | Content is placed at the top of the screen.                           |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
