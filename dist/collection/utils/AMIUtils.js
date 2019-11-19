import { Constants } from "../Constants";
import { ThreeUtils } from "./ThreeUtils";
export class AMIUtils {
    static _traceDataRay(stackHelper, px, py, pz, dx, dy, dz, maxDistance, 
    // tslint:disable-next-line: no-any
    hitPosition, hitNormal) {
        // consider raycast vector to be parametrized by t
        //   vec = [px,py,pz] + t * [dx,dy,dz]
        // algo below is as described by this paper:
        // http://www.cse.chalmers.se/edu/year/2010/course/TDA361/grid.pdf
        let t = 0.0;
        const floor = Math.floor;
        // tslint:disable-next-line: no-bitwise
        let ix = floor(px) | 0;
        // tslint:disable-next-line: no-bitwise
        let iy = floor(py) | 0;
        // tslint:disable-next-line: no-bitwise
        let iz = floor(pz) | 0;
        const stepx = dx > 0 ? 1 : -1;
        const stepy = dy > 0 ? 1 : -1;
        const stepz = dz > 0 ? 1 : -1;
        // dx,dy,dz are already normalized
        const txDelta = Math.abs(1 / dx);
        const tyDelta = Math.abs(1 / dy);
        const tzDelta = Math.abs(1 / dz);
        const xdist = stepx > 0 ? ix + 1 - px : px - ix;
        const ydist = stepy > 0 ? iy + 1 - py : py - iy;
        const zdist = stepz > 0 ? iz + 1 - pz : pz - iz;
        // location of nearest voxel boundary, in units of t
        let txMax = txDelta < Infinity ? txDelta * xdist : Infinity;
        let tyMax = tyDelta < Infinity ? tyDelta * ydist : Infinity;
        let tzMax = tzDelta < Infinity ? tzDelta * zdist : Infinity;
        // FROM DATA SHADER
        // float windowMin = uWindowCenterWidth[0] - uWindowCenterWidth[1] * 0.5;
        // float normalizedIntensity = ( realIntensity - windowMin ) / uWindowCenterWidth[1];
        // console.log(
        //   "WindowCenter: ",
        //   stackHelper.windowCenter,
        //   " WindowWidth: ",
        //   stackHelper.windowWidth
        // );
        let windowMin = stackHelper.windowCenter - stackHelper.windowWidth * 0.5;
        // Reduce windowMin by the sensitivity, to prevent floating nodes
        windowMin -= windowMin * Constants.volumeRaycastSensitivity;
        let steppedIndex = -1;
        // main loop along raycast vector
        while (t <= maxDistance) {
            // exit check in data space
            let b;
            const pixelPosition = new THREE.Vector3(ix, iy, iz);
            const dataPixelPosition = AMI.CoreUtils.worldToData(stackHelper.stack.lps2IJK, pixelPosition);
            const currentPixel = AMI.CoreUtils.getPixelData(stackHelper.stack, dataPixelPosition);
            if (currentPixel !== null && currentPixel > windowMin) {
                b = 1;
            }
            else {
                b = 0;
            }
            if (b) {
                if (hitPosition) {
                    hitPosition.x = px + t * dx;
                    hitPosition.y = py + t * dy;
                    hitPosition.z = pz + t * dz;
                }
                if (hitNormal) {
                    hitNormal.x = hitNormal.y = hitNormal.z = 0;
                    if (steppedIndex === 0) {
                        hitNormal.x = -stepx;
                    }
                    if (steppedIndex === 1) {
                        hitNormal.y = -stepy;
                    }
                    if (steppedIndex === 2) {
                        hitNormal.z = -stepz;
                    }
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
                }
                else {
                    iz += stepz;
                    t = tzMax;
                    tzMax += tzDelta;
                    steppedIndex = 2;
                }
            }
            else {
                if (tyMax < tzMax) {
                    iy += stepy;
                    t = tyMax;
                    tyMax += tyDelta;
                    steppedIndex = 1;
                }
                else {
                    iz += stepz;
                    t = tzMax;
                    tzMax += tzDelta;
                    steppedIndex = 2;
                }
            }
        }
        // no voxel hit found
        if (hitPosition) {
            hitPosition.x = px + t * dx;
            hitPosition.y = py + t * dy;
            hitPosition.z = pz + t * dz;
        }
        if (hitNormal) {
            hitNormal.x = hitNormal.y = hitNormal.z = 0;
        }
        return 0;
    }
    // Trace an AMI ray through dataSpace voxels
    static volumeRay(
    // tslint:disable-next-line: no-any
    stack, 
    // tslint:disable-next-line: no-any
    origin, 
    // tslint:disable-next-line: no-any
    direction, 
    // tslint:disable-next-line: no-any
    maxDistance, 
    // tslint:disable-next-line: no-any
    hitPosition, 
    // tslint:disable-next-line: no-any
    hitNormal) {
        const px = +origin.x;
        const py = +origin.y;
        const pz = +origin.z;
        let dx = +direction.x;
        let dy = +direction.y;
        let dz = +direction.z;
        const ds = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (ds === 0) {
            throw new Error("Can't raycast along a zero vector");
        }
        dx /= ds;
        dy /= ds;
        dz /= ds;
        if (typeof maxDistance === "undefined") {
            maxDistance = 64.0;
        }
        else {
            maxDistance = +maxDistance;
        }
        return this._traceDataRay(stack, px, py, pz, dx, dy, dz, maxDistance, hitPosition, hitNormal);
    }
    /**
     * Convert a vector3 from (mm) world space values to (m) world space values
     * @param vector Vector in AMI World Space (mm)
     */
    static toAframeSpace(vector) {
        return vector.divide(ThreeUtils.objectToVector3(Constants.stackSpaceMultiplier));
    }
}
