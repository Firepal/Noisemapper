let shader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

vec3 uv_to_uvw(vec2 uv, vec2 tiling) {
    uv.y = 1.0-uv.y;
	vec3 uvw = vec3(mod(uv * tiling, vec2(1.0)), 0.0);
	uvw.z = floor(uv.x * tiling.x) + floor(uv.y * tiling.y) * tiling.x;
	uvw.z /= tiling.x * tiling.y;
	return uvw;
}

vec2 random2( vec2 p ) {
    p *= 8.0;
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy + p3.yxx)*p3.zyx);

}

vec3 sphericalUv(vec2 sphCoord)
{
    sphCoord *= vec2(2.0 * 3.1415, 3.1415);
    return -vec3(
    	sin(sphCoord.y) * cos(sphCoord.x),
        sin(sphCoord.y) * sin(sphCoord.x),
        cos(sphCoord.y)
    );
}

float voronoi_distance(vec3 a, vec3 b, float metric, float exponent)
	{
	  if (metric < 0.001)  // SHD_VORONOI_EUCLIDEAN
	  {
	    return distance(a, b);
	  }
	  else if (metric < 1.001)  // SHD_VORONOI_MANHATTAN
	  {
	    return abs(a.x - b.x) + abs(a.y - b.y) + abs(a.z - b.z);
	  }
	  else if (metric < 2.001)  // SHD_VORONOI_CHEBYCHEV
	  {
	    return max(abs(a.x - b.x), max(abs(a.y - b.y), abs(a.z - b.z)));
	  }
	  else if (metric < 3.001)  // SHD_VORONOI_MINKOWSKI
	  {
	    return pow(pow(abs(a.x - b.x), exponent) + pow(abs(a.y - b.y), exponent) +
	                   pow(abs(a.z - b.z), exponent),
	               1.0 / exponent);
	  }
	  else {
	    return 0.0;
	  }
	}

varying vec2 uv;
uniform float slice_count;
uniform float grid_size;
uniform float randomness;
uniform float dist_curve;
uniform int draw_type;
uniform bool invert;
uniform bool is_equirect;

void main() {
    vec2 st = uv;
    
    vec3 stu = uv_to_uvw(st,vec2(slice_count));
    if ( is_equirect ) {
        stu = sphericalUv(st);
    }

    stu = stu*grid_size;


    vec3 stu_i = floor(stu);
    vec3 stu_f = stu - stu_i;

    float m_dist = 200.0;  // minimum distance
    vec3 m_point;        // minimum point
    vec3 m_neighbor;        // minimum point
    vec3 m_diff;
    for (int k=-1; k<=1; k++ )
    for (int j=-1; j<=1; j++ )
    for (int i=-1; i<=1; i++ )
    {
        vec3 n = vec3(float(i),float(j),float(k));
        
        vec3 p = (n + hash33( mod(stu_i + n, grid_size) ) * randomness);
        vec3 diff = p - stu_f;
        
        float dist = dot(diff,diff);

        if( dist < m_dist ) {
            m_point = p;
            m_neighbor = n;
            m_dist = dist;
            m_diff = diff;
        }
    }

    float voro_center_dist = m_dist;

    m_dist = 8.0;
    
    for( int k=-1; k<=1; k++ )
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec3 n = vec3(float(i),float(j),float(k));
        vec3 v_to_point = n + hash33( mod(stu_i + n, grid_size) ) * randomness - stu_f;

        vec3 perp = v_to_point - m_diff;
        if (dot(perp,perp) > 0.0001)
        {
            float d = dot((m_diff + v_to_point) / 2.0, normalize(perp));
            m_dist = min( m_dist, d );
        }
    }

    float voro_edge_dist = m_dist;


    vec3 color = vec3(.0);

    if(draw_type == 0){
        color = hash33( mod( stu_i+m_neighbor, grid_size )+1.0 );
        //color = vec3( float(stu.z > 1.0) );
        //color = vec3( stu.z );
    }
    else if(draw_type == 1){
        vec3 cell_pos = (stu_i+m_point) / grid_size;

        // [-1,1] -> [0,1]
        if (is_equirect) {
            cell_pos = (cell_pos * 0.5) + 0.5;
        }
        
        color = vec3( cell_pos );
    }
    else if(draw_type == 2){
        color = vec3( pow(voro_center_dist,dist_curve) );
    }
    else {
        color = vec3( pow(voro_edge_dist,dist_curve) );
    }
    
    if (invert) { color = 1.0-color; }
    // color = ;
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
    
    var xy_grid = uv.mul( new vec2(grid_size,grid_size) ).add(new vec2(0.5,0.5))

    var xy_floor = xy_grid.floor()
    var xy_fract = xy_grid.fract()

    var m_point = new vec2(0.0,0.0)
    var m_dist = 10.0;
    xy_floor.mod( new vec2(grid_size,grid_size) )
    let randuni = uniforms["randomness"].value
    for(var j=-1; j<=1; j++) {
      for(var i=-1; i<=1; i++) {
        let neighbor = new vec2(i,j)
        var hashes = xy_floor.add(neighbor).mod(new vec2(grid_size,grid_size))
        hashes = hashes.hash2()
        var xy_diff = neighbor.add(hashes.mul(new vec2(randuni,randuni))).sub(xy_fract)
        
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
            // pow 0.5 = sqrt
            col = new vec3( Math.pow(m_dist,uniforms["dist_curve"].value*0.5) )
            if (uniforms["invert"].value) {
                col = new vec3(1.0).sub(col)
            }
            break;
    }

    
    col = col.mul( new vec3(255) )
    return [col.x, col.y, col.z, 255]
    // ctx.fillStyle = 'rgb('+col.x+','+col.y+','+col.z+')'
    
    // ctx.fillRect(fragcoord.x,fragcoord.y,1,1);
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

        "randomness": {
            ui_name: "Randomness",
            type: "floatSlider",
            default: 1,
            step: 0.01,
            min: 0,
            max: 1
        },

        "draw_type":{
            ui_name: "Draw Type",
            type: "intOptions",
            options: [
                "Color Hash",
                "Point Coordinate",
                "Distance To Point",
                "Distance To Edge"
            ],
            default: 0
        },

        "is_equirect": {
            ui_name: "Equirectangular",
            type: "checkbox",
            default: false,
        },

        "_label": {
            text: "(Unit vectors are squashed if Equirectangular;<br>restore with \"<i>value * 2.0 - 1.0</i>\")",
            showIf: {
                uniform: "draw_type",
                op: "==",
                value: 1
            }
        },

        "_newline": {},
        
        "dist_curve": {
            ui_name: "Distance Curve",
            type: "floatEntry",
            default: 1,
            showIf: {
                uniform: "draw_type",
                op: ">",
                value: 1
            }
        },
        "invert": {
            ui_name: "Inverted",
            type: "checkbox",
            default: false,
            showIf: {
                uniform: "draw_type",
                op: ">",
                value: 1
            }
        },

        "slice_count": {
            ui_name: "Slice Count",
            type: "floatSlider",
            default: 1,
            step: 1,
            min: 1,
            max: 64,
            isSliceCount: true,
            showIf: {
                uniform: "is_equirect",
                op: "==",
                value: false
            }
        }

    }
}

addKernel(voronoiKernel)