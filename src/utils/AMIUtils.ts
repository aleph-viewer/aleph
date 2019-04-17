import { Constants } from "../Constants";
import { ThreeUtils } from "./ThreeUtils";

export class AMIUtils {
  private static _traceDataRay(
    stackHelper: {
      uniforms: any;
      stack: { lps2IJK: any };
    },
    px: number,
    py: number,
    pz: number,
    dx: number,
    dy: number,
    dz: number,
    max_d: number,
    hit_pos: { x: any; y: any; z: any },
    hit_norm: { x: number; y: number; z: number }
  ) {
    // consider raycast vector to be parametrized by t
    //   vec = [px,py,pz] + t * [dx,dy,dz]

    // algo below is as described by this paper:
    // http://www.cse.chalmers.se/edu/year/2010/course/TDA361/grid.pdf

    let t = 0.0;
    let floor = Math.floor;
    let ix = floor(px) | 0;
    let iy = floor(py) | 0;
    let iz = floor(pz) | 0;

    let stepx = dx > 0 ? 1 : -1;
    let stepy = dy > 0 ? 1 : -1;
    let stepz = dz > 0 ? 1 : -1;

    // dx,dy,dz are already normalized
    let txDelta = Math.abs(1 / dx);
    let tyDelta = Math.abs(1 / dy);
    let tzDelta = Math.abs(1 / dz);

    let xdist = stepx > 0 ? ix + 1 - px : px - ix;
    let ydist = stepy > 0 ? iy + 1 - py : py - iy;
    let zdist = stepz > 0 ? iz + 1 - pz : pz - iz;

    // location of nearest voxel boundary, in units of t
    let txMax = txDelta < Infinity ? txDelta * xdist : Infinity;
    let tyMax = tyDelta < Infinity ? tyDelta * ydist : Infinity;
    let tzMax = tzDelta < Infinity ? tzDelta * zdist : Infinity;

    // FROM DATA SHADER
    // float windowMin = uWindowCenterWidth[0] - uWindowCenterWidth[1] * 0.5;
    // float normalizedIntensity = ( realIntensity - windowMin ) / uWindowCenterWidth[1];
    let windowMin =
      stackHelper.uniforms.uWindowCenterWidth.value[0] -
      stackHelper.uniforms.uWindowCenterWidth.value[1] * 0.5;
    let steppedIndex = -1;

    // main loop along raycast vector
    while (t <= max_d) {
      // exit check in data space
      let b;
      let pixel_pos = new THREE.Vector3(ix, iy, iz);
      let data_pixel_pos = AMI.CoreUtils.worldToData(
        stackHelper.stack.lps2IJK,
        pixel_pos
      );
      let cur_pixel = AMI.CoreUtils.getPixelData(
        stackHelper.stack,
        data_pixel_pos
      );

      if (cur_pixel !== null && cur_pixel > windowMin) {
        b = 1;
      } else {
        b = 0;
      }

      if (b) {
        if (hit_pos) {
          hit_pos.x = px + t * dx;
          hit_pos.y = py + t * dy;
          hit_pos.z = pz + t * dz;
        }
        if (hit_norm) {
          hit_norm.x = hit_norm.y = hit_norm.z = 0;
          if (steppedIndex === 0) hit_norm.x = -stepx;
          if (steppedIndex === 1) hit_norm.y = -stepy;
          if (steppedIndex === 2) hit_norm.z = -stepz;
        }
        return b;
      }

      // advance t to next nearest voxel boundary
      if (txMax < tyMax) {
        if (txMax < tzMax) {
          ix += stepx;
          t = txMax;
          txMax += txDelta;
          steppedIndex = 0;
        } else {
          iz += stepz;
          t = tzMax;
          tzMax += tzDelta;
          steppedIndex = 2;
        }
      } else {
        if (tyMax < tzMax) {
          iy += stepy;
          t = tyMax;
          tyMax += tyDelta;
          steppedIndex = 1;
        } else {
          iz += stepz;
          t = tzMax;
          tzMax += tzDelta;
          steppedIndex = 2;
        }
      }
    }

    // no voxel hit found
    if (hit_pos) {
      hit_pos.x = px + t * dx;
      hit_pos.y = py + t * dy;
      hit_pos.z = pz + t * dz;
    }
    if (hit_norm) {
      hit_norm.x = hit_norm.y = hit_norm.z = 0;
    }

    return 0;
  }

  // Trace an AMI ray through dataSpace voxels
  public static volumeRay(stack, origin, direction, max_d, hit_pos, hit_norm) {
    let px = +origin.x;
    let py = +origin.y;
    let pz = +origin.z;
    let dx = +direction.x;
    let dy = +direction.y;
    let dz = +direction.z;
    let ds = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (ds === 0) {
      throw new Error("Can't raycast along a zero vector");
    }

    dx /= ds;
    dy /= ds;
    dz /= ds;

    if (typeof max_d === "undefined") {
      max_d = 64.0;
    } else {
      max_d = +max_d;
    }

    return this._traceDataRay(
      stack,
      px,
      py,
      pz,
      dx,
      dy,
      dz,
      max_d,
      hit_pos,
      hit_norm
    );
  }

  /**
   * Convert a vector3 from (mm) world space values to (m) world space values
   * @param vector Vector in AMI World Space (mm)
   */
  public static toAframeSpace(vector: THREE.Vector3): THREE.Vector3 {
    return vector.divide(
      ThreeUtils.objectToVector3(Constants.stackSpaceMultiplier)
    );
  }
}
