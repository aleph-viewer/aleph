export interface AframeShader {
    schema: {};
    vertexShader: string;
    fragmentShader: string;
    init: (data?: any) => void;
}
