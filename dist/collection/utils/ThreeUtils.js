import { Constants } from "../Constants";
import { ControlsType } from "../enums";
export class ThreeUtils {
    static isWebGL2Available() {
        try {
            // tslint:disable-next-line: no-any
            const canvas = document.createElement("canvas");
            return !!(window.WebGL2RenderingContext && canvas.getContext("webgl2"));
        }
        catch (e) {
            return false;
        }
    }
    // Must use setAttribute, otherwise THREE.OrbitControls onMouseUp doesn't always pick up the change :-(
    static enableControls(camEntity, enabled, type) {
        type === ControlsType.TRACKBALL
            ? camEntity.setAttribute("al-trackball-control", `enabled: ${enabled}`)
            : camEntity.setAttribute("al-orbit-control", `enabled: ${enabled}`);
    }
    static waitOneFrame(func) {
        window.setTimeout(() => {
            func();
        }, Constants.minFrameMS);
    }
    static objectToVector3(vec) {
        const res = new THREE.Vector3();
        res.x = vec.x;
        res.y = vec.y;
        res.z = vec.z;
        return res;
    }
    static worldToScreen(worldCoordinate, camera, 
    // tslint:disable-next-line: no-any
    container) {
        const screenCoordinates = worldCoordinate.clone();
        screenCoordinates.project(camera);
        screenCoordinates.x = Math.round(((screenCoordinates.x + 1) * container.offsetWidth) / 2);
        screenCoordinates.y = Math.round(((-screenCoordinates.y + 1) * container.offsetHeight) / 2);
        screenCoordinates.z = 0;
        return screenCoordinates;
    }
    static vector3ToString(vec) {
        return vec.toArray().join(" ");
    }
    static stringToVector3(vec) {
        const res = vec.split(" ");
        const vect = new THREE.Vector3();
        vect.x = Number(res[0]);
        vect.y = Number(res[1]);
        vect.z = Number(res[2]);
        return vect;
    }
    // https://en.wikipedia.org/wiki/Slerp
    static slerp(start, end, percent) {
        const t = percent;
        const p0 = start;
        const p1 = end;
        let theta = p0.angleTo(p1);
        if (theta) {
            theta = THREE.Math.clamp(theta, -0.99, 0.99);
            const topP0 = Math.sin(1 - t) * theta;
            const topP1 = Math.sin(t * theta);
            const bot = Math.sin(theta);
            const p0Const = topP0 / bot;
            const p1Const = topP1 / bot;
            const left = p0.clone().multiplyScalar(p0Const);
            const right = p1.clone().multiplyScalar(p1Const);
            const result = left.add(right);
            return result;
        }
        else {
            return null;
        }
    }
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    static getSlerpCameraPath(start, end, positionChange, targetChange) {
        const path = [];
        // add epsilon to avoid NaN due to divide by 0 in the atan in angleTo
        const sp = start.position.clone().addScalar(Number.EPSILON);
        const st = start.target.clone().addScalar(Number.EPSILON);
        const ep = end.position.clone().addScalar(Number.EPSILON);
        const et = end.target.clone().addScalar(Number.EPSILON);
        for (let frame = 0; frame <= Constants.maxAnimationSteps; frame++) {
            const percent = this.easeInOutCubic(frame / Constants.maxAnimationSteps);
            path.push({
                position: positionChange
                    ? ThreeUtils.slerp(sp.clone(), ep.clone(), percent)
                    : ep,
                target: targetChange
                    ? ThreeUtils.slerp(st.clone(), et.clone(), percent)
                    : et
            });
        }
        return path;
    }
    static getSlerp3Path(start, end) {
        const path = [];
        // add epsilon to avoid NaN due to divide by 0 in the atan in angleTo
        const sp = start.clone().addScalar(Number.EPSILON);
        const ep = end.clone().addScalar(Number.EPSILON);
        for (let frame = 0; frame <= Constants.maxAnimationSteps; frame++) {
            const percent = this.easeInOutCubic(frame / Constants.maxAnimationSteps);
            path.push(ThreeUtils.slerp(sp.clone(), ep.clone(), percent));
        }
        return path;
    }
    static lookToFrustrumSpace(object, camera, worldPosition, cameraPosition) {
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        const distance = cameraPosition.distanceTo(new THREE.Vector3(0, 0, 0));
        const lookPlane = new THREE.Plane(cameraDirection, distance);
        const frustrumDirection = new THREE.Vector3();
        lookPlane.projectPoint(worldPosition, frustrumDirection);
        object.lookAt(frustrumDirection);
    }
    static getFrustrumSpaceDistance(camera, worldPosition, cameraPosition) {
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        const distance = cameraPosition.distanceTo(new THREE.Vector3(0, 0, 0));
        const lookPlane = new THREE.Plane(cameraDirection, distance);
        const frustrumDirection = new THREE.Vector3();
        lookPlane.projectPoint(worldPosition, frustrumDirection);
        const ray = new THREE.Ray(worldPosition);
        ray.lookAt(frustrumDirection);
        const dist = ray.distanceToPlane(lookPlane);
        return dist;
    }
}
