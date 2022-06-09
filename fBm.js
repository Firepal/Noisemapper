function noiseinit(){
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

    float random31(vec3 p3, float s) {
        p3 = mod(p3,vec3(s))+0.5;
        p3  = fract(p3 * .1031);
        p3 += dot(p3, p3.zyx + 31.32);
        return fract((p3.x + p3.y) * p3.z);
    }
    
    float noise3d( vec3 uvw, float s ){
        uvw *= s;
        vec3 u = fract(uvw);
        vec3 i = floor(uvw);
        
        float a = random31( i, s );
        float b = random31( i+vec3(1.0,0.0,0.0), s );
        float c = random31( i+vec3(0.0,1.0,0.0), s );
        float d = random31( i+vec3(1.0,1.0,0.0), s );
        float e = random31( i+vec3(0.0,0.0,1.0), s );
        float f = random31( i+vec3(1.0,0.0,1.0), s );
        float g = random31( i+vec3(0.0,1.0,1.0), s );
        float h = random31( i+vec3(1.0,1.0,1.0), s );
        
        u = smoothstep(0.0,1.0,u); // uncomment for linear
        
        return mix(mix(mix( a, b, u.x),
                           mix( c, d, u.x), u.y),
                       mix(mix( e, f, u.x),
                           mix( g, h, u.x), u.y), u.z);
    }

    varying vec2 uv;
    uniform float scale;
    uniform float roughness;
    uniform int octaves;

    float fBm(vec3 x) {
        float v = 0.0;
        float a = 0.5;
        float s = scale;
        vec3 shift = vec3(100.0);
        
        for (int i = 0; i < 10; i++) {
            if (i >= octaves) { break; } 
            v += a * noise3d(x,s);
            s = s * 2.0;
            a *= roughness;
        }
        return v;
    }
    
    uniform float slice_count;
    void main(){
        vec3 uvw = uv_to_uvw(uv,vec2(slice_count));
        gl_FragColor.rgb = vec3( fBm(uvw) );
        gl_FragColor.a = 1.0;
    }
    `

    function voronoiJS(ctx,fragcoord,uv,uniforms){
        var grid_size = uniforms["Grid Size"].value
        var xy_grid = uv.mul( new vec2(grid_size,grid_size) )

        var xy_floor = xy_grid.floor()

        var xy_fract = xy_grid.fract()

        var m_point = new vec2(0.0,0.0)
        var m_dist = 10.0;
        for(var j=-1; j<=1; j++) {
        for(var i=-1; i<=1; i++) {
            let neighbor = new vec2(i,j)
            var hashes = hash( xy_floor.add(neighbor).rem(new vec2(grid_size,grid_size)) );
            var xy_diff = neighbor.add(hashes).sub(xy_fract)
            
            var dist = xy_diff.dot(xy_diff)
            if (dist < m_dist)
            {
            m_dist = dist
            m_point = hashes
            }

        }
        }
        
        let col = m_point.hash3().mul( new vec3(256) )
        ctx.fillStyle = 'rgb('+col.x+','+col.y+','+col.z+')'
        // console.log('rgb('+col.x+','+col.y+','+col.z+')')
        ctx.fillRect(fragcoord.x,fragcoord.y,1,1);
    }

    var ye = {
        name: "noise",
        glslShader: shader,
        uniforms: {
            "scale": {
                ui_name: "Scale",
                type: "floatEntry",
                default: 10,
                step: 1
            },
            "octaves": {
                ui_name: "Octaves",
                type: "intEntry",
                default: 10,
                min: 0
            },
            "roughness": {
                ui_name: "Roughness",
                type: "floatEntry",
                default: 0.5,
                step: 0.1,
                max: 0.5
            },

            "slice_count": {
                ui_name: "Slice Count",
                type: "floatSlider",
                default: 4,
                step: 1,
                min: 1,
                max: 64,
                isSliceCount: true
            }
        }
    }

    addKernel(ye)
}

noiseinit()