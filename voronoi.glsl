#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec3 hash32(vec2 p){
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}

varying vec2 uv;
uniform float grid_size;
uniform bool show_dist;
void main() {
    vec2 st = uv;
    vec3 color = vec3(.0);
    
    st = (st*grid_size)+0.5;

    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 10.;  // minimum distance
    vec2 m_point;        // minimum point
    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = random2( mod(i_st + neighbor,grid_size) );
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            if( dist < m_dist ) {
                m_point = point;
                m_dist = dist;
            }
        }
    }

    if(show_dist){
    color = vec3(m_dist);
    }else{
    // Assign a color using the closest point position as a seed for a PRNG
    color += hash32(m_point+0.04);
    }
    gl_FragColor = vec4(color,1.0);
}