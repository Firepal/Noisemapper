#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

float random12(vec2 p){
	vec3 p3  = fract(vec3(p.xyx) * .1031);
	p3 += dot(p3, p3.yzx + 33.33);
	return fract((p3.x + p3.y) * p3.z);
}

float noise2d(vec2 st,float scale) {
    st *= scale;
	vec2 i = floor(st);
	vec2 f = fract(st);

	float a = random12(i);
	float b = random12(i + vec2(1.0, 0.0));
	float c = random12(i + vec2(0.0, 1.0));
	float d = random12(i + vec2(1.0, 1.0));
	
	vec2 u = smoothstep(0.,1.,f);
	
	return mix(a, b, u.x) +
			(c - a)* u.y * (1.0 - u.x) +
			(d - b) * u.x * u.y;
}

float fBm(vec2 x,float scale) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(200.0);
    const int OCTAVES = 6;
	for (int i = 0; i < OCTAVES; ++i) {
		v += a * noise2d(x,scale);
		x = x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

varying vec2 uv;
uniform float scale;
void main(){
    float s = (scale+0.001); // Weird straight line appears without this bias
    gl_FragColor.rgb = vec3(fBm(uv,s));
    gl_FragColor.a = 1.0;
}