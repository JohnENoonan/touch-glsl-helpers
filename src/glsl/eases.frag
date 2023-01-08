#ifndef PI
#define PI 3.14159265359
#endif

float cubicInOut(float t) {
	return t < 0.5
		? 4.0 * t * t * t
		: 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

float cubicIn(float t) {
	return t * t * t;
}

float cubicOut(float t) {
	float f = t - 1.0;
	return f * f * f + 1.0;
}

float exponentialInOut(float t) {
	return t == 0.0 || t == 1.0
		? t
		: t < 0.5
			? +0.5 * pow(2.0, (20.0 * t) - 10.0)
			: -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

float exponentialIn(float t) {
	return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float exponentialOut(float t) {
	return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

float quadraticInOut(float t) {
	float p = 2.0 * t * t;
	return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
}

float quadraticIn(float t) {
	return t * t;
}

float quadraticOut(float t) {
	return -t * (t - 2.0);
}

float circularInOut(float t) {
	return t < 0.5
		? 0.5 * (1.0 - sqrt(1.0 - 4.0 * t * t))
		: 0.5 * (sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
}

float circularIn(float t) {
	return 1.0 - sqrt(1.0 - t * t);
}

float circularOut(float t) {
	return sqrt((2.0 - t) * t);
}

float parabolic(float t) {
	return (sin(2.0 * PI * (t - 1/4)) + 1) / 2;
}

// - - - CUSTOMIZEABLE EASES

float quadraticBezier (float x, float a, float b){
	// adapted from BEZMATH.PS (1993)
	// by Don Lancaster, SYNERGETICS Inc. 
	// http://www.tinaja.com/text/bezmath.html

	float epsilon = 0.00001;
	a = max(0, min(1, a)); 
	b = max(0, min(1, b)); 
	if (a == 0.5){
	a += epsilon;
	}

	// solve t from x (an inverse operation)
	float om2a = 1 - 2*a;
	float t = (sqrt(a*a + om2a*x) - a)/om2a;
	float y = (1-2*b)*(t*t) + (2*b)*t;
	return y;
}


// - - - CUBIC Bezier

float slopeFromT (float t, float A, float B, float C){
	float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C); 
	return dtdx;
}

float xFromT (float t, float A, float B, float C, float D){
	float x = A*(t*t*t) + B*(t*t) + C*t + D;
	return x;
}

float yFromT (float t, float E, float F, float G, float H){
	float y = E*(t*t*t) + F*(t*t) + G*t + H;
	return y;
}

float cubicBezier (float x, float a, float b, float c, float d){

	float y0a = 0.00; // initial y
	float x0a = 0.00; // initial x 
	float y1a = b;    // 1st influence y   
	float x1a = a;    // 1st influence x 
	float y2a = d;    // 2nd influence y
	float x2a = c;    // 2nd influence x
	float y3a = 1.00; // final y 
	float x3a = 1.00; // final x 

	float A =   x3a - 3.0*x2a + 3.0*x1a - x0a;
	float B = 3.0*x2a - 6.0*x1a + 3.0*x0a;
	float C = 3.0*x1a - 3.0*x0a;   
	float D =   x0a;

	float E =   y3a - 3.0*y2a + 3.0*y1a - y0a;    
	float F = 3.0*y2a - 6.0*y1a + 3.0*y0a;             
	float G = 3.0*y1a - 3.0*y0a;             
	float H =   y0a;

	// Solve for t given x (using Newton-Raphelson), then solve for y given t.
	// Assume for the first guess that t = x.
	float currentt = x;
	int nRefinementIterations = 5;
	for (int i=0; i < nRefinementIterations; i++){
		float currentx = xFromT (currentt, A,B,C,D); 
		float currentslope = slopeFromT (currentt, A,B,C);
		currentt -= (currentx - x)*(currentslope);
		currentt = clamp(currentt, 0.0,1.0);
	} 

	float y = yFromT (currentt,  E,F,G,H);
	return y;
}