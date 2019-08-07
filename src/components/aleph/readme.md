# uv-aleph



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description | Type     | Default     |
| ------------------ | -------------------- | ----------- | -------- | ----------- |
| `dracoDecoderPath` | `draco-decoder-path` |             | `string` | `undefined` |
| `height`           | `height`             |             | `string` | `"480"`     |
| `width`            | `width`              |             | `string` | `"640"`     |


## Events

| Event     | Description                                                                                    | Type                |
| --------- | ---------------------------------------------------------------------------------------------- | ------------------- |
| `changed` | Fires whenever the internal state changes passing an object describing the state.              | `CustomEvent<void>` |
| `loaded`  | Fires when an object is loaded passing either the object or a stackhelper for volumetric data. | `CustomEvent<void>` |


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



### `load(src: string, displayMode?: DisplayMode) => Promise<void>`



#### Parameters

| Name          | Type                                                           | Description |
| ------------- | -------------------------------------------------------------- | ----------- |
| `src`         | `string`                                                       |             |
| `displayMode` | `DisplayMode.MESH \| DisplayMode.SLICES \| DisplayMode.VOLUME` |             |

#### Returns

Type: `Promise<void>`



### `recenter() => Promise<void>`



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



### `setBoundingBoxEnabled(visible: boolean) => Promise<void>`



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



### `setEdge(edge: [string, AlEdge]) => Promise<void>`

Creates or updates an edge in the graph

#### Parameters

| Name   | Type               | Description |
| ------ | ------------------ | ----------- |
| `edge` | `[string, AlEdge]` |             |

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



### `setNode(node: [string, AlNode]) => Promise<void>`



#### Parameters

| Name   | Type               | Description |
| ------ | ------------------ | ----------- |
| `node` | `[string, AlNode]` |             |

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
