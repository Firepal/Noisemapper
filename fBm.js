function noiseinit(){
    let shader = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    

    float random12(vec2 p, float s){
        p = mod(p,s);
        p += 0.5;

        vec3 p3  = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    float noise2d(vec2 st, float s) {
        st *= s;
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random12(i, s);
        float b = random12(i + vec2(1.0, 0.0), s);
        float c = random12(i + vec2(0.0, 1.0), s);
        float d = random12(i + vec2(1.0, 1.0), s);
        
        vec2 u = smoothstep(0.,1.,f);
        
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    varying vec2 uv;
    uniform float scale;
    uniform float roughness;
    uniform int octaves;

    float fBm(vec2 x) {
        float v = 0.0;
        float a = 0.5;
        float s = scale;
        vec2 shift = vec2(100.0);
        
        for (int i = 0; i < 10; i++) {
            if (i >= octaves) { break; } 
            v += a * noise2d(x,s);
            s = s * 2.0;
            a *= roughness;
        }
        return v;
    }

    void main(){
        gl_FragColor.rgb = vec3( fBm(uv) );
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
                default: 10
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
        }
    }

    addKernel(ye)
}

noiseinit()