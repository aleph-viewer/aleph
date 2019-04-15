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

| Event     | Description | Type                |
| --------- | ----------- | ------------------- |
| `changed` |             | `CustomEvent<void>` |
| `loaded`  |             | `CustomEvent<void>` |


## Methods

### `clearGraph() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `deleteAngle(angleId: string) => Promise<void>`



#### Parameters

| Name      | Type     | Description |
| --------- | -------- | ----------- |
| `angleId` | `string` |             |

#### Returns

Type: `Promise<void>`



### `deleteEdge(edgeId: string) => Promise<void>`



#### Parameters

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| `edgeId` | `string` |             |

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



### `resize() => Promise<void>`



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



### `setGraph(graph: AlGraph) => Promise<void>`



#### Parameters

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| `graph` | `AlGraph` |             |

#### Returns

Type: `Promise<void>`



### `setGraphEnabled(enabled: boolean) => Promise<void>`



#### Parameters

| Name      | Type      | Description |
| --------- | --------- | ----------- |
| `enabled` | `boolean` |             |

#### Returns

Type: `Promise<void>`



### `setNode(node: [string, AlNodeSerial]) => Promise<void>`



#### Parameters

| Name   | Type                     | Description |
| ------ | ------------------------ | ----------- |
| `node` | `[string, AlNodeSerial]` |             |

#### Returns

Type: `Promise<void>`



### `setOrientation(orientation: Orientation) => Promise<void>`



#### Parameters

| Name          | Type                                                               | Description |
| ------------- | ------------------------------------------------------------------ | ----------- |
| `orientation` | `Orientation.AXIAL \| Orientation.CORONAL \| Orientation.SAGGITAL` |             |

#### Returns

Type: `Promise<void>`



### `setSlicesIndex(index: number) => Promise<void>`



#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `index` | `number` |             |

#### Returns

Type: `Promise<void>`



### `setSlicesWindowCenter(center: number) => Promise<void>`



#### Parameters

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| `center` | `number` |             |

#### Returns

Type: `Promise<void>`



### `setSlicesWindowWidth(width: number) => Promise<void>`



#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `width` | `number` |             |

#### Returns

Type: `Promise<void>`



### `setVolumeSteps(steps: number) => Promise<void>`



#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `steps` | `number` |             |

#### Returns

Type: `Promise<void>`



### `setVolumeWindowCenter(center: number) => Promise<void>`



#### Parameters

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| `center` | `number` |             |

#### Returns

Type: `Promise<void>`



### `setVolumeWindowWidth(width: number) => Promise<void>`



#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `width` | `number` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
