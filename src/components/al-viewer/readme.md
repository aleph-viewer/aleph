# al-viewer



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description | Type      | Default     |
| ------------------ | -------------------- | ----------- | --------- | ----------- |
| `dracoDecoderPath` | `draco-decoder-path` |             | `string`  | `undefined` |
| `envMapPath`       | `env-map-path`       |             | `string`  | `undefined` |
| `height`           | `height`             |             | `string`  | `"480"`     |
| `vrEnabled`        | `vr-enabled`         |             | `boolean` | `false`     |
| `width`            | `width`              |             | `string`  | `"640"`     |


## Events

| Event     | Description                                                                                    | Type               |
| --------- | ---------------------------------------------------------------------------------------------- | ------------------ |
| `changed` | Fires whenever the internal state changes passing an object describing the state.              | `CustomEvent<any>` |
| `loaded`  | Fires when an object is loaded passing either the object or a stackhelper for volumetric data. | `CustomEvent<any>` |


## Methods

### `clearGraph() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `deleteAngle(angleId: string) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `deleteEdge(edgeId: string) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `deleteNode(nodeId: string) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `load(src: string, displayMode?: DisplayMode) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `recenter() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `resize() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `selectNode(nodeId: string) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setBoundingBoxEnabled(visible: boolean) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setControlsEnabled(enabled: boolean) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setControlsType(type: ControlsType) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setDisplayMode(displayMode: DisplayMode) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setEdge(edge: [string, AlEdge]) => Promise<void>`

Creates or updates an edge in the graph

#### Returns

Type: `Promise<void>`



### `setGraph(graph: AlGraph) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setGraphEnabled(enabled: boolean) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setMaterial(material: Material) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setNode(node: [string, AlNode]) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setOrientation(orientation: Orientation) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setSlicesIndex(index: number) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setUnits(units: Units) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setVolumeBrightness(brightness: number) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setVolumeContrast(contrast: number) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setVolumeSteps(steps: number) => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
