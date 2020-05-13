AFRAME.registerComponent("al-bounding-box", {
  schema: {
    boundingBoxWidth: { type: "number", default: 2 },
    color: { type: "string", default: "#fff" },
    scale: { type: "string" },
    enabled: { type: "boolean", default: true },
    topLayerRenderOrder: { type: "number", default: 999 }
  },

  init(){
    this.bindMethods();
    this.addEventListeners();

    this.state = {
      box: new THREE.Box3()
    }
  },

  bindMethods() {},

  addEventListeners() {},

  removeEventListeners() {},

  update() {
    const el = this.el;
    const state = this.state;
    const scale = AFRAME.utils.coordinates.parse(this.data.scale);

    state.box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), scale);

    // Add a second mesh for raycasting against volumes
    const geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
    const material = new THREE.MeshBasicMaterial({
      color: this.data.color,
      visible: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    el.setObject3D("mesh", mesh);

    // Parent of all MeshLines that form the bounding box
    const BboxLineController = new THREE.Mesh();
    BboxLineController.renderOrder = this.data.topLayerRenderOrder - 5;

    const MeshLineMat = new MeshLineMaterial({
      // - THREE.Color to paint the line width, or tint the texture with
      color: new THREE.Color(this.data.color),
      // - cutoff value from 0 to 1
      alphaTest: 0,
      // - THREE.Vector2 specifying the canvas size (REQUIRED)
      resolution: new THREE.Vector2(
        this.el.sceneEl.canvas.clientWidth,
        this.el.sceneEl.canvas.clientHeight
      ),
      // - makes the line width constant regardless distance (1 unit is 1px on screen) (0 - attenuate, 1 - don't attenuate)
      sizeAttenuation: 0,
      // - float defining width (if sizeAttenuation is true, it's world units; else is screen pixels)
      lineWidth: this.data.boundingBoxWidth,
      // - camera near clip plane distance (REQUIRED if sizeAttenuation set to false)
      near: this.el.sceneEl.camera.near,
      // - camera far clip plane distance (REQUIRED if sizeAttenuation set to false)
      far: this.el.sceneEl.camera.far
    });
    // MeshLineMat.transparent = this.data.opacity === 0;
    // // - alpha value from 0 to 1 (requires transparent set to true)
    // MeshLineMat.opacity = this.data.opactiy;

    const TopLeftFront = new THREE.Vector3(
      scale.x,
      scale.y,
      scale.z
    ).multiplyScalar(0.5);
    const TopRightFront = new THREE.Vector3(
      -scale.x,
      scale.y,
      scale.z
    ).multiplyScalar(0.5);
    const TopLeftBack = new THREE.Vector3(
      scale.x,
      scale.y,
      -scale.z
    ).multiplyScalar(0.5);
    const TopRightBack = new THREE.Vector3(
      -scale.x,
      scale.y,
      -scale.z
    ).multiplyScalar(0.5);
    const BottomLeftFront = new THREE.Vector3(
      scale.x,
      -scale.y,
      scale.z
    ).multiplyScalar(0.5);
    const BottomRightFront = new THREE.Vector3(
      -scale.x,
      -scale.y,
      scale.z
    ).multiplyScalar(0.5);
    const BottomLeftBack = new THREE.Vector3(
      scale.x,
      -scale.y,
      -scale.z
    ).multiplyScalar(0.5);
    const BottomRightBack = new THREE.Vector3(
      -scale.x,
      -scale.y,
      -scale.z
    ).multiplyScalar(0.5);

    // Line 1
    const TLF_TRF = new THREE.Geometry();
    TLF_TRF.vertices.push(TopLeftFront);
    TLF_TRF.vertices.push(TopRightFront);
    const line1 = new MeshLine();
    line1.setGeometry(TLF_TRF, _p => this.data.boundingBoxWidth);
    const mesh1 = new THREE.Mesh(line1.geometry, MeshLineMat);
    BboxLineController.add(mesh1);

    // Line 2
    const TLF_TLB = new THREE.Geometry();
    TLF_TLB.vertices.push(TopLeftFront);
    TLF_TLB.vertices.push(TopLeftBack);
    const line2 = new MeshLine();
    line2.setGeometry(TLF_TLB, _p => this.data.boundingBoxWidth);
    const mesh2 = new THREE.Mesh(line2.geometry, MeshLineMat);
    BboxLineController.add(mesh2);

    // Line 3
    const TLF_BLF = new THREE.Geometry();
    TLF_BLF.vertices.push(TopLeftFront);
    TLF_BLF.vertices.push(BottomLeftFront);
    const line3 = new MeshLine();
    line3.setGeometry(TLF_BLF, _p => this.data.boundingBoxWidth);
    const mesh3 = new THREE.Mesh(line3.geometry, MeshLineMat);
    BboxLineController.add(mesh3);

    // Line 4
    const TRB_TRF = new THREE.Geometry();
    TRB_TRF.vertices.push(TopRightBack);
    TRB_TRF.vertices.push(TopRightFront);
    const line4 = new MeshLine();
    line4.setGeometry(TRB_TRF, _p => this.data.boundingBoxWidth);
    const mesh4 = new THREE.Mesh(line4.geometry, MeshLineMat);
    BboxLineController.add(mesh4);

    // Line 5
    const TRB_TLB = new THREE.Geometry();
    TRB_TLB.vertices.push(TopRightBack);
    TRB_TLB.vertices.push(TopLeftBack);
    const line5 = new MeshLine();
    line5.setGeometry(TRB_TLB, _p => this.data.boundingBoxWidth);
    const mesh5 = new THREE.Mesh(line5.geometry, MeshLineMat);
    BboxLineController.add(mesh5);

    // Line 6
    const TRB_BRB = new THREE.Geometry();
    TRB_BRB.vertices.push(TopRightBack);
    TRB_BRB.vertices.push(BottomRightBack);
    const line6 = new MeshLine();
    line6.setGeometry(TRB_BRB, _p => this.data.boundingBoxWidth);
    const mesh6 = new THREE.Mesh(line6.geometry, MeshLineMat);
    BboxLineController.add(mesh6);

    // Line 7
    const BRB_BRF = new THREE.Geometry();
    BRB_BRF.vertices.push(BottomRightBack);
    BRB_BRF.vertices.push(BottomRightFront);
    const line7 = new MeshLine();
    line7.setGeometry(BRB_BRF, _p => this.data.boundingBoxWidth);
    const mesh7 = new THREE.Mesh(line7.geometry, MeshLineMat);
    BboxLineController.add(mesh7);

    // Line 8
    const BRB_BLB = new THREE.Geometry();
    BRB_BLB.vertices.push(BottomRightBack);
    BRB_BLB.vertices.push(BottomLeftBack);
    const line8 = new MeshLine();
    line8.setGeometry(BRB_BLB, _p => this.data.boundingBoxWidth);
    const mesh8 = new THREE.Mesh(line8.geometry, MeshLineMat);
    BboxLineController.add(mesh8);

    // Line 9
    const BLF_BLB = new THREE.Geometry();
    BLF_BLB.vertices.push(BottomLeftFront);
    BLF_BLB.vertices.push(BottomLeftBack);
    const line9 = new MeshLine();
    line9.setGeometry(BLF_BLB, _p => this.data.boundingBoxWidth);
    const mesh9 = new THREE.Mesh(line9.geometry, MeshLineMat);
    BboxLineController.add(mesh9);

    // Line 10
    const BLF_BRF = new THREE.Geometry();
    BLF_BRF.vertices.push(BottomLeftFront);
    BLF_BRF.vertices.push(BottomRightFront);
    const line10 = new MeshLine();
    line10.setGeometry(BLF_BRF, _p => this.data.boundingBoxWidth);
    const mesh10 = new THREE.Mesh(line10.geometry, MeshLineMat);
    BboxLineController.add(mesh10);

    // Line 11
    const TRF_BRF = new THREE.Geometry();
    TRF_BRF.vertices.push(TopRightFront);
    TRF_BRF.vertices.push(BottomRightFront);
    const line11 = new MeshLine();
    line11.setGeometry(TRF_BRF, _p => this.data.boundingBoxWidth);
    const mesh11 = new THREE.Mesh(line11.geometry, MeshLineMat);
    BboxLineController.add(mesh11);

    // Line 12
    const TLB_BLB = new THREE.Geometry();
    TLB_BLB.vertices.push(TopLeftBack);
    TLB_BLB.vertices.push(BottomLeftBack);
    const line12 = new MeshLine();
    line12.setGeometry(TLB_BLB, _p => this.data.boundingBoxWidth);
    const mesh12 = new THREE.Mesh(line12.geometry, MeshLineMat);
    BboxLineController.add(mesh12);

    state.mesh = BboxLineController;
    state.material = MeshLineMat;

    if (this.data.enabled) {
      el.setObject3D("bbox", BboxLineController);
    } else if (el.object3DMap.bbox) {
      el.removeObject3D("bbox");
    }
  },

  remove() {
    this.removeEventListeners();
    this.el.removeObject3D("mesh");
  }
});
