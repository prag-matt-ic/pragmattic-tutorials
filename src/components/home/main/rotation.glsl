#pragma glslify: rotation3dZ = require(glsl-rotate/rotation-3d-z)
#pragma glslify: rotation3dY = require(glsl-rotate/rotation-3d-y)
#pragma glslify: rotation3dX = require(glsl-rotate/rotation-3d-x)


vec3 rotateTorus(inout vec3 position, in float uTime, in float uRotateSpeed) {
    float timeRotation = uTime * uRotateSpeed;

    position *= rotation3dZ(-timeRotation * 2.0);
    position *= rotation3dY(timeRotation * 2.5);
    position *= rotation3dX(-timeRotation);
    return position;
}

#pragma glslify: export(rotateTorus)