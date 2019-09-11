varying vec3 vNormal;
uniform float r;
uniform float g;
uniform float b;
uniform float a;
uniform float c;

void main()
{
    float intensity = pow( abs(c) - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 );
    gl_FragColor = vec4(r, g, b, a) * intensity;
}