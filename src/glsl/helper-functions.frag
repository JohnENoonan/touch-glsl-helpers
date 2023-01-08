#define P_NORM_EPSILON 0.000001
#define P_NORM P_NORM_EPSILON
#ifndef PI
#define PI 3.14159265359
#endif



// RANDOM FUNCTIONS
float get_random ( float x ) { return fract(sin(x)*1e4); }
float get_random ( vec2 st ) { 
	return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

// REMAP FUNCTIONS
float remap(in float value, in float low1, in float high1, in float low2, in float high2) {
	return float(low2 + (value - low1) * (high2 - low2) / (high1 - low1));
}

vec2 remap(in vec2 value, in vec2 low1, in vec2 high1, in vec2 low2, in vec2 high2) {
	return vec2(low2 + (value - low1) * (high2 - low2) / (high1 - low1));
}

vec3 remap(in vec3 value, in float low1, in float high1, in float low2, in float high2) {
	return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

vec4 remap(in vec4 value, in float low1, in float high1, in float low2, in float high2) {
	return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

// TRANSFORMATIONS
// ROTATION helper
mat2 rotate2d(float _angle) {
	return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}

// Rotate Vec2 Directly Helper
vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	v -= .5;
	v = m * v;
	v += .5;
	return v;
}

mat4 rotationMatrix(vec3 axis, float angle) {
	axis = normalize(axis);
	float s = sin(angle);
	float c = cos(angle);
	float oc = 1.0 - c;
	
	return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
				oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
				oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
				0.0,                                0.0,                                0.0,                                1.0);
}

mat3 rotation_matrix( vec3 axis, float angle ) {
	mat3 m = mat3(
		axis.x*axis.x * (1.0f - cos(angle)) + cos(angle),       // column 1 of row 1
		axis.x*axis.y * (1.0f - cos(angle)) + axis.z * sin(angle), // column 2 of row 1
		axis.x*axis.z * (1.0f - cos(angle)) - axis.y * sin(angle), // column 3 of row 1

		axis.y*axis.x * (1.0f - cos(angle)) - axis.z * sin(angle), // column 1 of row 2
		axis.y*axis.y * (1.0f - cos(angle)) + cos(angle),       // ...
		axis.y*axis.z * (1.0f - cos(angle)) + axis.x * sin(angle), // ...

		axis.z*axis.x * (1.0f - cos(angle)) + axis.y * sin(angle), // column 1 of row 3
		axis.z*axis.y * (1.0f - cos(angle)) - axis.x * sin(angle), // ...
		axis.z*axis.z * (1.0f - cos(angle)) + cos(angle)        // ...
	);
	return m;
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

mat3 rotation3dX(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat3(
	1.0, 0.0, 0.0,
	0.0, c, s,
	0.0, -s, c
  );
}

mat3 rotation3dY(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat3(
		c, 0.0, -s,
		0.0, 1.0, 0.0,
		s, 0.0, c
  	);
}

mat3 rotation3dZ(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat3(
		c, s, 0.0,
		-s, c, 0.0,
		0.0, 0.0, 1.0
  	);
}

mat4 rotation3d(vec3 axis, float angle) {
	axis = normalize(axis);
	float s = sin(angle);
	float c = cos(angle);
	float oc = 1.0 - c;

	return mat4(
		oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
		oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
		oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
		0.0,                                0.0,                                0.0,                                1.0
  	);
}

vec3 rotateX(vec3 v, float angle) {
	return rotation3dX(angle) * v;
}

vec3 rotateY(vec3 v, float angle) {
	return rotation3dY(angle) * v;
}

vec3 rotateZ(vec3 v, float angle) {
	return rotation3dZ(angle) * v;
}

vec2 scale( vec2 _st, vec2 _scale ) {
	_st -= .5;
	_st = mat2(_scale.x,0.0,
				0.0,_scale.y) * _st;
	_st += .5;
	return _st;
}

float angleFromPoint(vec2 uv, vec2 origin){
	// get the angle from the origin position to a given point
	float a = acos(dot(normalize(rotate(uv, -PI/4.0) - origin), normalize(origin)));
	float bottom = step(uv.y, origin.y); // is this below the origin
	return mix(a, PI + (PI - a), bottom);
}

// EQUALITY HELPERS
// Integer Equality Helper
float eq( int i, int j ){
	return
		step( float( j ) - P_NORM_EPSILON, float( i ) ) *
		step( float( i ), float( j ) + P_NORM_EPSILON );
}

float floatEq(float i, float j){
	return float(abs(i-j) < P_NORM_EPSILON);
}

// DISTANCE HELPERS
float distSquared( vec3 A, vec3 B ) {
	vec3 C = A - B;
	return dot( C, C );
}

float distSquared( vec2 A, vec2 B ) {
	vec2 C = A - B;
	return dot( C, C );
}
