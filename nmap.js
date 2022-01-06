var default_vert = `
attribute vec4 position;
varying vec2 uv;
void main(){
    gl_Position = position;
    uv = (position.xy+1.0)*0.5;
}
`
var default_frag = `
precision mediump float;
varying vec2 uv;
void main(){
    gl_FragColor.rgba = vec4(uv,0.0,1.0);
}
`

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
  
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
  
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function render(){ 
    canvas.width = document.getElementById("imgsize").value
    canvas.height = canvas.width
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

var canvas = document.getElementById("nview")
var gl = canvas.getContext("webgl",{preserveDrawingBuffer:true})

var vertexShader = createShader(gl,gl.VERTEX_SHADER,default_vert)
var fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,default_frag)

var program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram( program );

var posAttribLocation = gl.getAttribLocation(program, "position");

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var positions = [
    -1, -3,
    -1, 1,
    3, 1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.enableVertexAttribArray(posAttribLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(posAttribLocation, 2, gl.FLOAT, false, 0, 0);


render()

var shaderSpec = {
    "voronoi":{
        "file":"voronoi.glsl",
        "uniforms":{
            "Grid Size":{
                uniform:"grid_size",
                type:"1f",
                default:10
            },
            "Show Distance":{
                uniform:"show_dist",
                type:"bool"
            }
        }
    },
    "fBm":{
        "file":"fBm.glsl",
        "uniforms":{
            "Size":{
                uniform:"scale",
                type:"1f",
                default:20
            }
        }
    },
}

var selectorEl = document.getElementsByTagName("select")[0]
for (const name in shaderSpec) {
    let newOption = document.createElement("option")
    newOption.innerText = name
    selectorEl.appendChild(newOption)
}

function getAndUseShader(noisespec){
    fetch(noisespec["file"])
        .then(response => response.text())
        .then(function(text){ 
            fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,text)
            let newProgram = createProgram(gl, vertexShader, fragmentShader)
            if(newProgram){
                program = newProgram
                posAttribLocation = gl.getAttribLocation(program, "position");
                gl.useProgram( program );
                setupUniforms(program,noisespec["uniforms"])
                render()
            }
        })
}

function setupUniforms(prog,uniforms){
    var uniDiv = document.getElementById("uni")
    uniDiv.innerHTML = ""
    for (const key in uniforms){
        let newInput = document.createElement("input")
        switch(uniforms[key]["type"]){
            case "1f":
                newInput.type = "number"
                newInput.step = 0.1

                if(uniforms[key]["default"]){
                    newInput.value = uniforms[key]["default"]
                    gl.uniform1f(gl.getUniformLocation(prog,uniforms[key]["uniform"]),newInput.value)
                }
                newInput.addEventListener("change",function(){
                    gl.uniform1f(gl.getUniformLocation(prog,uniforms[key]["uniform"]),this.value)
                    render()
                })
                break;
            case "bool":
                newInput.type = "checkbox"
                
                newInput.addEventListener("change",function(){
                    gl.uniform1i(gl.getUniformLocation(prog,uniforms[key]["uniform"]),this.checked)
                    render()
                })
                break;
        }

        uniDiv.appendChild(document.createTextNode(key+": "))
        uniDiv.appendChild(newInput)
        uniDiv.appendChild(document.createElement("br"))
    }
}

function setNewNoise(noiseName){
    getAndUseShader(shaderSpec[noiseName])
}

setNewNoise(selectorEl.value)

var image_size = document.getElementById("imgsize")
image_size.oninput = function(){
    image_size.value = Math.min(image_size.max,image_size.value)
    image_size.value = Math.max(0,image_size.value)
    render()
}

selectorEl.addEventListener("change",function(){
    setNewNoise(this.value)
})

var dl = document.getElementById("dl")
dl.addEventListener("click",function(i){
    var a = document.createElement('a')
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    a.href = image
    a.download = "noise.png"
    document.body.appendChild(a)
    a.click()
})