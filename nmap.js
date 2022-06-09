class vec2 {
    x;
    y;
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    sw(s = "xy"){
        let arr = []
        arr.length = 2
        for(let i=0; i<2; i++){
            if (s[i] == "x"){ arr[i] = this.x }
            else { arr[i] = this.y }
        }
        return new vec2(arr[0],arr[1])
    }
    sw3(s = "xyy"){
        let arr = []
        arr.length = 3
        for(let i=0; i<3; i++){
            if (s[i] == "x"){ arr[i] = this.x }
            else { arr[i] = this.y }
        }
        return new vec3(arr[0],arr[1],arr[2])
    }
    add(b){
        return new vec2(
            this.x + b.x,
            this.y + b.y
        )
    }
    sub(b){
        return new vec2(
            this.x - b.x,
            this.y - b.y
        )
    }
    mul(b){
        return new vec2(
            this.x * b.x,
            this.y * b.y
        )
    }
    dot(b){ return this.x * b.x + this.y * b.y; }
    // Modulo operator
    mod(b){
        // console.log("a = ", this, "b =", b)
        return new vec2(
            ( (this.x % b.x) + b.x ) % b.x,
            ( (this.y % b.y) + b.y ) % b.y
        );
    }
    // Remainder operator
    rem(b)  { return new vec2( this.x % b.x, this.y % b.y ); }
    fract() { return this.mod( new vec2(1.0,1.0) ); }
    floor() { return new vec2( Math.floor(this.x), Math.floor(this.y) ); }
    ceil()  { return new vec2( Math.ceil(this.x), Math.ceil(this.y) ); }
    sin()   { return new vec2( Math.sin(this.x), Math.sin(this.y) ); }
    hash2(){
        let p3 = this.sw3("xyx").mul( new vec3(.1031, .1030, .0973) ).fract();
        let a = p3.dot( p3.sw3("yzx").add( new vec3( 33.33 ) ) );
        p3 = p3.add( new vec3(a) );
        return p3.sw2("xx").add( p3.sw2("yz") ).mul( p3.sw2("zy") ).fract();
    }
    hash3(){
        let p3 = this.sw3("xyx").mul( new vec3(.1031, .1030, .0973) ).fract();
        let a = p3.dot( p3.sw3("yxz").add( new vec3( 33.33 ) ) );
        p3 = p3.add( new vec3(a) );
        return p3.sw3("xxy").add( p3.sw3("yzz") ).mul( p3.sw3("zyx") ).fract();
    }
}

class vec3 {
    x;
    y;
    z;
    constructor(){
        switch (arguments.length){
            case 1:
                this.x = arguments[0];
                this.y = arguments[0];
                this.z = arguments[0];
                break;
            case 3:
                this.x = arguments[0];
                this.y = arguments[1];
                this.z = arguments[2];
                break;
        }
    }
    sw3(s = "xyy"){
        let arr = []
        arr.length = 3
        for(let i=0; i<3; i++){
            if (s[i] == "x")        { arr[i] = this.x }
            else if (s[i] == "y")   { arr[i] = this.y }
            else                    { arr[i] = this.z }
        }
        return new vec3(arr[0],arr[1],arr[2])
    }
    sw2(s = "xy"){
        let arr = []
        arr.length = 2
        for(let i=0; i<2; i++){
            if (s[i] == "x")        { arr[i] = this.x }
            else if (s[i] == "y")   { arr[i] = this.y }
            else                    { arr[i] = this.z }
        }
        return new vec2(arr[0],arr[1])
    }
    add(b){
        return new vec3(
            this.x + b.x,
            this.y + b.y,
            this.z + b.z
        )
    }
    sub(b){
        return new vec3(
            this.x - b.x,
            this.y - b.y,
            this.z - b.z
        )
    }
    mul(b){
        return new vec3(
            this.x * b.x,
            this.y * b.y,
            this.z * b.z
        )
    }
    dot(b){ return this.x * b.x + this.y * b.y + this.z * b.z; }
    // Modulo operator
    mod(b){
        return new vec3(
            ( (this.x % b.x) + b.x ) % b.x,
            ( (this.y % b.y) + b.y ) % b.y,
            ( (this.z % b.z) + b.z ) % b.z
        );
    }
    // Remainder operator
    rem(b)  {
        return new vec3(
            this.x % b.x,
            this.y % b.y,
            this.z % b.z
        );
    }
    fract() { return this.mod( new vec3(1.0) ); }
    floor() { return new vec3( Math.floor(this.x), Math.floor(this.y), Math.floor(this.z) ); }
    ceil()  { return new vec3( Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z) ); }
    sin()   { return new vec3( Math.sin(this.x), Math.sin(this.y), Math.sin(this.z) ); }
    sqrt()   { return new vec3( Math.sqrt(this.x), Math.sqrt(this.y), Math.sqrt(this.z) ); }
}

var didYouKnowEl = document.getElementById("didukno")
var facts = [
    "Mali GPUs are made from gluing Pentiums with the FDIV bug together",
    "GPUs do not have infinite precision. <i>CPUs do</i>",
    "Gaming laptops have integrated handwarmers on the keyboard",
    "This would be going faster if I built it in WASM",
    "Ken Perlin probably had no clue what he was doing, given how complicated his noise is",
    "You should hydrate",
    "They call it the oven because you of in the cold food of out hot eat the food",
    "Anisotropic mipmaps weren't officially in OpenGL until 4.0 because it was too powerful",
    "Unity has more features than an aircraft",
    "Inigo Quilez created GLSL. To fuel his god complex",
    "Using trigonometry functions in code is a sign you've lost someone close to you and are trying to cope",
    "WebGL renders scenes in sRGB. Or linear color. Nope, probably sRGB. Eh, maybe lin...",
    "Violence isn't the answer to this one.",
    "Gaming",
    "Live-update rendering was added on 2022-03-11.<br>Before that, you had to wait in silence while your browser froze.",
    "This tool was created because I wanted a texture generator, but was too lazy to learn desktop OpenGL",
    "All output images from this tool are 8-bit color.",
    "Programming socks: they make a difference.",
    "Shadertoy is good competition.",
]

function showDidYouKnow(){
    didYouKnowEl.style.display = "block"
    let picker = Math.floor(Math.random()*facts.length)
    
    didYouKnowEl.innerHTML = "Did you know? " + facts[picker]
}

function hideDidYouKnow(){
    didYouKnowEl.style.display = "none"
}

var default_vert = `
attribute vec4 position;
// attribute vec2 texcoord0;

varying vec2 uv;
void main(){
    gl_Position = position;
    uv = (position.xy+1.0)*0.5;
    // uv = texcoord0;
}
`
var default_frag = `
precision mediump float;
varying vec2 uv;
void main(){
    gl_FragColor.rgba = vec4(uv,0.0,1.0);
}
`

var canvasGL = document.getElementById("glview")
var canvasJSK = document.getElementById("jskview")
var gl = canvasGL.getContext("webgl",{preserveDrawingBuffer:true})
var ctx = canvasJSK.getContext('2d')

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

let resMul = 1

function showUniformElementIf(uniforms, this_uniform, this_div) {
    let showdef = this_uniform["showIf"]
    
    let uniToCheck = uniforms[ showdef["uniform"] ]
    let valueToCompare = showdef["value"]

    let showOrHide = function(){
        let res = "none"
        if (arguments[0] == true)
        { res = "block" }
        
        this_div.style.display = res
    }
    
    let showIfFunc
    switch ( showdef["op"] )
    {
        case ">":
            showIfFunc = function(){
                return showOrHide(uniToCheck.value > valueToCompare)
            }
            break;
        default: // Assume you want Equals operator
            showIfFunc = function(){
                return showOrHide(uniToCheck.value == valueToCompare)
            }
            break;
    }
    showIfFunc()
    uniToCheck.element.addEventListener("change",showIfFunc)
}

function setupUniforms(uniforms) {
    // Clear uniform elements already present
    var uniDiv = document.getElementById("uni")
    uniDiv.innerHTML = ""

    for (const key in uniforms){
        let this_uniform = uniforms[key]
        
        // New element for uniform
        let newInput

        let myDiv = document.createElement("div")
        let mySibling
        

        let changeFunc
        let inputFunc

        // Special styling uniforms with reserved keywords
        let isStylingChange = false
        switch(key) {
            case "_newline": 
                uniDiv.appendChild( document.createElement("br") )
                continue
            case "_label":
                myDiv.innerHTML = this_uniform.text
                myDiv.style.opacity = 0.5
                showUniformElementIf(uniforms,this_uniform,myDiv)
                uniDiv.appendChild( myDiv )
                continue
        }

        switch(this_uniform["type"]){
            // Boolean checkbox
            case "checkbox":
                newInput = document.createElement("input")
                newInput.type = "checkbox"
                
                changeFunc = function() {
                    this_uniform.value = this.checked
                }

                break;
            // Optionbox (represented internally as an integer starting at 0)
            case "intOptions":
                newInput = document.createElement("select")

                for (const opt in this_uniform.options){
                    let name = this_uniform.options[opt]
                    let optEl = document.createElement("option")
                    optEl.innerHTML = name

                    newInput.appendChild(optEl)
                }
                
                changeFunc = function(){
                    this_uniform.value = this.selectedIndex
                }

                break;
            // Float spinbox
            case "floatEntry":
            case "intEntry":
                newInput = document.createElement("input")
                newInput.type = "number"

                if (this_uniform.type == "intEntry") {
                    newInput.step = 1;
                } else if (this_uniform.step) {
                    newInput.step = this_uniform.step;
                } else {
                    newInput.step = 0.1
                }
                
                newInput.min = this_uniform.min
                newInput.max = this_uniform.max

                changeFunc = function(){
                    this_uniform.value = this.value
                }
                
                break;
            // Number slider
            case "floatSlider":
            case "intSlider":
                newInput = document.createElement("input")
                newInput.type = "range"

                let numberDisplay = document.createElement("span")
                mySibling = numberDisplay

                if (this_uniform.type == "intSlider") {
                    newInput.step = 1;
                } else if (this_uniform.step) {
                    newInput.step = this_uniform.step;
                } else {
                    newInput.step = 0.1
                }
                
                newInput.min = this_uniform.min;
                newInput.max = this_uniform.max;

                inputFunc = function(){
                    this_uniform.value = this.value;
                    numberDisplay.innerHTML = String( this.value );
                    renderGL();
                }

                if (this_uniform.isSliceCount) {
                    inputFunc = function(){
                        resMul = this.value;
                        this_uniform.value = this.value;
                        numberDisplay.innerHTML = String( this.value );
                        renderGL();
                    }
                }
                
                break;
        }

        this_uniform.element = newInput

        if(this_uniform.default){
            console.log(this_uniform.default)
            newInput.value = this_uniform.default
        }

        
        if(this_uniform["showIf"]){
            showUniformElementIf(uniforms,this_uniform,myDiv)
        }
        
        

        myDiv.appendChild(document.createTextNode(this_uniform.ui_name +": "))
        myDiv.appendChild(newInput)
        if (mySibling) {
            myDiv.appendChild(mySibling)
        }
        myDiv.appendChild(document.createElement("br"))
        uniDiv.appendChild(myDiv)

        newInput.addEventListener("change",changeFunc)
        newInput.addEventListener("input",inputFunc)

        // Force set default values to GL uniforms
        newInput.dispatchEvent(new Event("change"))
        newInput.dispatchEvent(new Event("input"))

        newInput.addEventListener("change",render)
    }
}

function updateUniformsGL() {
    if (!current_kernel) {
        console.log("KERNEL UNDEFINED")
        return
    }
    for (const key in current_kernel.uniforms) {
        let uniform = current_kernel.uniforms[key]
        switch(uniform["type"]) {
            case "intEntry":
            case "intSlider":
            case "intOptions":
            case "checkbox":
                gl.uniform1i(uniform.uniloc,uniform.value)
                break;
            case "floatEntry":
            case "floatSlider":
                gl.uniform1f(uniform.uniloc,uniform.value)
                break;
        }
    }
}

function setupUniformLocationsGL(uniforms,prog) {
    for (const key in uniforms){
        uniforms[key].uniloc = gl.getUniformLocation(prog,key)
    }
}

function useShader(shadertext,uniforms){
            fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,shadertext)
            let newProgram = createProgram(gl, vertexShader, fragmentShader)
            if(newProgram){
                program = newProgram
                gl.useProgram( program );

                setupUniformLocationsGL(uniforms,program)
            }
}

var _render_id = 0

function renderGL() {
    _render_id = -1
    setCanvasResolution(canvasGL)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    updateUniformsGL()
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    setTimeout(updateBackground,100)
}

function renderJS() {
    setCanvasResolution(canvasJSK)
    if (!current_kernel.jsShader) {
        didYouKnowEl.innerHTML = "No JS function defined for this kernel.<br>(see /voronoi.js for an example kernel with a JS implementation)"
        return
    }

    let res = new vec2(1.0/canvasJSK.width,1.0/canvasJSK.height)

    let img = ctx.createImageData(canvasJSK.width, 1);
    let cur_y = 0

    let drawLine = function() {
        let offset = 0
        for ( var x=0; x<canvasJSK.width; x++ ) {
            let p = new vec2(x,cur_y)
            let col = current_kernel.jsShader(ctx,p,p.mul(res),current_kernel.uniforms)
            img.data[offset++] = col[0]
            img.data[offset++] = col[1]
            img.data[offset++] = col[2]
            img.data[offset++] = col[3]
        }
    }
    
    _render_id += 1
    let _this_renderid = _render_id
    let _last_now = (new Date).getTime()

    let scanline = function() {
        if ( _render_id != _this_renderid ) {
            return;
        }
        
        var now = (new Date).getTime()

        drawLine()
        ctx.putImageData(img,0,cur_y)
        cur_y++

        if (cur_y < canvasJSK.height) {
            if ( now - _last_now > 100 ) {

                _last_now = now
                setTimeout(scanline,0)
            } else {
                scanline();
            }
        } else {
            hideDidYouKnow();
            updateBackground();
        }
    }


    showDidYouKnow();
    scanline();
}

function render() {
    if (rendererSelector.selectedIndex == 0) { renderGL() }
    else { renderJS() }
}

function getCanvas() {
    if (rendererSelector.selectedIndex == 0) {
        return canvasGL;
    }
    else {
        return canvasJSK;
    }
}

var bgEl = document.getElementById("bg")
function updateBackground(){
    let c = getCanvas()
    let imag = c.toDataURL('image/png')
    bgEl.style.backgroundImage = 'url('+ imag + ')'
    positionBackground()
}
function positionBackground(){
    let c = getCanvas()
    let rect = c.getBoundingClientRect()
    bgEl.style.backgroundPositionX = rect.x + "px"
    bgEl.style.backgroundPositionY = rect.y + "px"
}

function showBackground(show) {
    bgEl.style.opacity = 1.0
}
function hideBackground(show) {
    bgEl.style.opacity = 0.0
}

canvasJSK.addEventListener("mouseenter",showBackground)
canvasJSK.addEventListener("mouseleave",hideBackground)
canvasGL.addEventListener("mouseenter",showBackground)
canvasGL.addEventListener("mouseleave",hideBackground)

var image_size_x = document.getElementById("imgsizeX")
var image_size_y = document.getElementById("imgsizeY")

var img_square_box = document.getElementById("squareXYcheckbox")

img_square_box.addEventListener("change",function(){
    image_size_y.disabled = img_square_box.checked
    if ( image_size_y.disabled ) {
        image_size_y.value = image_size_x.value
    }

    image_size_y.dispatchEvent(new Event("change"))
})

function setCanvasResolution(c) {
    c.width = image_size_x.value * resMul
    c.height = image_size_y.value * resMul
}

function clampSize(self){
    self.value = Math.min(self.max,self.value)
    self.value = Math.max(0.0,     self.value)
}

image_size_x.addEventListener("change",function(){
    if (image_size_y.disabled) {
        image_size_y.value = image_size_x.value
        image_size_y.dispatchEvent(new Event("change"))
    }
    clampSize(this)
    render()
})

image_size_y.addEventListener("change",function(){
    
    clampSize(this)
    render()
})



function setKernel(kernel){
    current_kernel = kernel
    console.log(kernel)

    setupUniforms(kernel.uniforms)
    useShader(current_kernel.glslShader,current_kernel.uniforms)
}
var shaderSelector = document.getElementById("shaderSelector")
shaderSelector.onchange = function(){
    setKernel(kernels[this.selectedIndex])
    render()
}

function updateShaderSelector() {
    shaderSelector.innerHTML = ""
    for (const i in kernels){
        let newOpt = document.createElement("option")
        newOpt.innerHTML = kernels[i].name
        shaderSelector.appendChild(newOpt)
    }
    setKernel(kernels[0])
    useShader(current_kernel.glslShader,current_kernel.uniforms)
    render()
}

var default_kernels = [
    "voronoi.js",
    "fBm.js"
]

var kernels = []
var current_kernel = null

function loadKernelfromFile(file){
    fetch(file)
        .then(response => response.text())
        .then(function(text){
            var newScript = document.createElement("script")
            newScript.innerHTML = text
            document.body.appendChild(newScript)
        })
}

function addKernel(kernel){
    kernels.push(kernel)
    updateShaderSelector()
}

for (const key in default_kernels){
    loadKernelfromFile(default_kernels[key])
}


var dl = document.getElementById("dl")
dl.onmousedown = function(i){
    let canvas;
    if (rendererSelector.selectedIndex == 0) {
                canvas = canvasGL;
    } else {    canvas = canvasJSK; }

    var a = document.createElement('a')
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    a.href = image
    var faux_hash = Math.floor(Math.random()*Date.now()*0.01)
    a.download = "urnoise"+ faux_hash +".png"
    document.body.appendChild(a)
    a.click()
}

function setRenderer(rendererIndex) {
    if (rendererIndex == 0) {
        canvasJSK.style.display = "none"
        canvasGL.style.display = "block"
        
    } else {
        canvasGL.style.display = "none"
        canvasJSK.style.display = "block"
    }
}

var rendererSelector = document.getElementById("rendererSelector")
rendererSelector.onchange = function(){
    setRenderer(this.selectedIndex)
    render()
}
setRenderer(rendererSelector.selectedIndex)