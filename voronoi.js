let shader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

vec2 random2( vec2 p ) {
    p *= 8.0;
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec3 hash32(vec2 p){
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}

varying vec2 uv;
uniform float grid_size;
uniform float dist_curve;
uniform int draw_type;
uniform bool invert;

float voronoiEdge(vec2 mn, vec2 md, vec2 st_i, vec2 st_f){
    float m_dist = 8.0;
    
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        vec2 n = mn + vec2(float(i),float(j));
        vec2 p = random2( mod(st_i + n, grid_size) );
        vec2 diff = n + p - st_f;

        float d = dot(0.5*(md+diff), normalize(diff-md));

        m_dist = min( m_dist, d );
    }
    return m_dist;
}

void main() {
    vec2 st = uv;
    vec3 color = vec3(.0);
    
    st = (st*grid_size)+0.5;

    vec2 st_i = floor(st);
    vec2 st_f = fract(st);

    float m_dist = 10.0;  // minimum distance
    vec2 m_point;        // minimum point
    vec2 m_neighbor;        // minimum point
    vec2 m_diff;
    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 n = vec2(float(i),float(j));
            vec2 p = random2( mod(st_i + n, grid_size) );
            vec2 diff = n + p - st_f;
            float dist = dot(diff,diff);

            if( dist < m_dist ) {
                m_point = p;
                m_neighbor = n;
                m_dist = dist;
                m_diff = diff;
            }
        }
    }



    if(draw_type == 0){
        color = hash32(m_point+0.04);
    }
    else if(draw_type == 1){
        color = vec3( pow(m_dist,0.5*dist_curve) );
    }
    else {
        float edge_dist = voronoiEdge(m_neighbor,m_diff,st_i,st_f);
        edge_dist = pow(edge_dist,dist_curve);
        color = vec3( edge_dist );
    }
    
    if (invert) { color = 1.0-color; }
    gl_FragColor = vec4(color,1.0);
}
`

// vec2 random2( vec2 p ) {
//     return fract(
//         sin(
//             vec2(
//                 dot(p,vec2(127.1,311.7)),
//                 dot(p,vec2(269.5,183.3)
//                 )
//         )
//     *43758.5453);
// }

function hash(xy){
    let xD = xy.dot( new vec2(127.1,311.7) )
    let yD = xy.dot( new vec2(269.5,183.3) )
    let xDyD = new vec2(xD,yD)
    return xDyD.sin().fract()
}

function voronoiJS(ctx,fragcoord,uv,uniforms){
    var grid_size = Number( uniforms["grid_size"].value )
    console.log(grid_size)
    var xy_grid = uv.mul( new vec2(grid_size,grid_size) )

    var xy_floor = xy_grid.floor()
    var xy_fract = xy_grid.fract()

    var m_point = new vec2(0.0,0.0)
    var m_dist = 10.0;
    xy_floor.mod( new vec2(grid_size,grid_size) )
    
    for(var j=-1; j<=1; j++) {
      for(var i=-1; i<=1; i++) {
        let neighbor = new vec2(i,j)
        var hashes = xy_floor.add(neighbor).mod(new vec2(grid_size,grid_size))
        hashes = hashes.hash2();
        var xy_diff = neighbor.add(hashes).sub(xy_fract)
        
        var dist = xy_diff.dot(xy_diff)
        if (dist < m_dist)
        {
          m_dist = dist
          m_point = hashes
        }

      }
    }

    let col = new vec3(0.0,0.0,0.0)
    switch (uniforms["draw_type"].value){
        case 0: // Color Hash
            col = m_point.add( new vec2(0.04,0.04) ).hash3()
            break;
        case 1: // Distance to Point
            // 1 * 0.5 = sqrt
            col = new vec3( Math.pow(m_dist,uniforms["dist_curve"].value*0.5) )
            break;
    }
    
    col = col.mul( new vec3(255) )
    ctx.fillStyle = 'rgb('+col.x+','+col.y+','+col.z+')'
    
    ctx.fillRect(fragcoord.x,fragcoord.y,1,1);
  }

var voronoiKernel = {
    name: "voronoi",
    glslShader: shader,
    jsShader: voronoiJS,
    uniforms: {
        "grid_size": {
            ui_name: "Grid Size",
            type: "floatEntry",
            default: 10,
            step: 1
        },
        "draw_type":{
            ui_name: "Draw Type",
            type: "intOptions",
            options: [
                "Color Hash",
                "Distance To Point",
                "Distance To Edge"
            ],
            default: 0
        },
        "dist_curve": {
            ui_name: "Distance Curve",
            type: "floatEntry",
            default: 1,
            showIf: {
                uniform: "draw_type",
                op: ">",
                value: 0
            }
        },
        "invert": {
            ui_name: "Inverted",
            type: "checkbox",
            default: false,
            showIf: {
                uniform: "draw_type",
                op: ">",
                value: 0
            }
        }
        
    }
}

addKernel(voronoiKernel)