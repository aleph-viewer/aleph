# uv-aleph



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description | Type      | Default     |
| ------------------ | -------------------- | ----------- | --------- | ----------- |
| `debug`            | `debug`              |             | `boolean` | `false`     |
| `dracoDecoderPath` | `draco-decoder-path` |             | `string`  | `undefined` |
| `height`           | `height`             |             | `string`  | `"480px"`   |
| `spinnerColor`     | `spinner-color`      |             | `string`  | `"#fff"`    |
| `width`            | `width`              |             | `string`  | `"640px"`   |


## Events

| Event       | Description | Type                |
| ----------- | ----------- | ------------------- |
| `onChanged` |             | `CustomEvent<void>` |


## Methods

### `clearNodes() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `deleteNode(nodeId: string) => Promise<void>`



#### Parameters

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| `nodeId` | `string` |             |

#### Returns

Type: `Promise<void>`



### `load(src: string) => Promise<void>`



#### Parameters

| Name  | Type     | Description |
| ----- | -------- | ----------- |
| `src` | `string` |             |

#### Returns

Type: `Promise<void>`



### `selectNode(nodeId: string) => Promise<void>`



#### Parameters

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| `nodeId` | `string` |             |

#### Returns

Type: `Promise<void>`



### `setBoundingBoxVisible(visible: boolean) => Promise<void>`



#### Parameters

| Name      | Type      | Description |
| --------- | --------- | ----------- |
| `visible` | `boolean` |             |

#### Returns

Type: `Promise<void>`



### `setCameraType(type: CameraType) => Promise<void>`



#### Parameters

| Name   | Type                                                                   | Description |
| ------ | ---------------------------------------------------------------------- | ----------- |
| `type` | `CameraType.NONE \| CameraType.ORTHOGRAPHIC \| CameraType.PERSPECTIVE` |             |

#### Returns

Type: `Promise<void>`



### `setDisplayMode(displayMode: DisplayMode) => Promise<void>`



#### Parameters

| Name          | Type                                                           | Description |
| ------------- | -------------------------------------------------------------- | ----------- |
| `displayMode` | `DisplayMode.MESH \| DisplayMode.SLICES \| DisplayMode.VOLUME` |             |

#### Returns

Type: `Promise<void>`



### `setEdge(edge: [string, AlEdgeSerial]) => Promise<void>`



#### Parameters

| Name   | Type                     | Description |
| ------ | ------------------------ | ----------- |
| `edge` | `[string, AlEdgeSerial]` |             |

#### Returns

Type: `Promise<void>`



### `setNode(node: [string, AlNodeSerial]) => Promise<void>`



#### Parameters

| Name   | Type                     | Description |
| ------ | ------------------------ | ----------- |
| `node` | `[string, AlNodeSerial]` |             |

#### Returns

Type: `Promise<void>`



### `setNodes(nodes: Map<string, AlNodeSerial>) => Promise<void>`



#### Parameters

| Name    | Type                        | Description |
| ------- | --------------------------- | ----------- |
| `nodes` | `Map<string, AlNodeSerial>` |             |

#### Returns

Type: `Promise<void>`



### `setNodesEnabled(enabled: boolean) => Promise<void>`



#### Parameters

| Name      | Type      | Description |
| --------- | --------- | ----------- |
| `enabled` | `boolean` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
