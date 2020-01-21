export declare class AMIUtils {
    private static _traceDataRay;
    static volumeRay(stack: any, origin: any, direction: any, maxDistance: any, hitPosition: any, hitNormal: any): any;
    /**
     * Convert a vector3 from (mm) world space values to (m) world space values
     * @param vector Vector in AMI World Space (mm)
     */
    static toAframeSpace(vector: THREE.Vector3): THREE.Vector3;
}
