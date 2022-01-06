function modulo(x,n) {
    return ((x % n) + n) % n;
};

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
            modulo(this.x,b.x),
            modulo(this.y,b.y)
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
        let a = p3.dot( p3.sw("yzx").add( new vec3( 33.33 ) ) );
        p3 = p3.add( new vec3(a) );
        return p3.sw2("xx").add( p3.sw2("yz") ).mul( p3.sw2("zy") ).fract();
    }
    hash3(){
        let p3 = this.sw3("xyx").mul( new vec3(.1031, .1030, .0973) ).fract();
        let a = p3.dot( p3.sw("yxz").add( new vec3( 33.33 ) ) );
        p3 = p3.add( new vec3(a) );
        return p3.sw("xxy").add( p3.sw("yzz") ).mul( p3.sw("zyx") ).fract();
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
    sw(s = "xyy"){
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
    fract() { return this.mod( new vec3(1.0,1.0,1.0) ); }
    floor() { return new vec3( Math.floor(this.x), Math.floor(this.y), Math.floor(this.z) ); }
    ceil()  { return new vec3( Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z) ); }
    sin()   { return new vec3( Math.sin(this.x), Math.sin(this.y), Math.sin(this.z) ); }
}

var didYouKnowEl = document.getElementById("didukno")
var facts = [
    "Mali's GPUs are made from gluing Pentiums with the FDIV bug together",
    "GPUs do not have infinite precision. <i>CPUs do</i>",
    "Gaming laptops have integrated handwarmers on the keyboard",
    "This would be going faster if I built it in WASM",
    "Ken Perlin probably had no clue what he was doing, given how complicated his noise is",
    "You should hydrate",
    "They call it the oven because you of in the cold food of out hot eat the food",
    "Anisotropic mipmaps weren't officially in OpenGL until 4.0 because it was too powerful",
    "Unity has more features than an aircraft"
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

function setupUniforms(uniforms) {
    // Clear uniform elements already present
    var uniDiv = document.getElementById("uni")
    uniDiv.innerHTML = ""

    for (const key in uniforms){
        let this_uniform = uniforms[key]
        
        // New element for uniform
        let newInput

        let myDiv = uniDiv

        let inputChangedFunc


        switch(this_uniform["type"]){
            // Boolean checkbox
            case "checkbox":
                newInput = document.createElement("input")
                newInput.type = "checkbox"
                
                inputChangedFunc = function() {
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
                
                inputChangedFunc = function(){
                    this_uniform.value = this.selectedIndex
                }

                break;
            // Float spinbox
            case "floatEntry":
            case "intEntry":
                newInput = document.createElement("input")
                newInput.type = "number"
                newInput.step = 1

                if (this_uniform.step || this_uniform.type !== "intEntry") {
                    newInput.step = this_uniform.step
                }
                
                newInput.min = this_uniform.min
                newInput.max = this_uniform.max

                inputChangedFunc = function(){
                    this_uniform.value = this.value
                }
                
                break;
        }

        this_uniform.element = newInput

        if(this_uniform.default){
            newInput.value = this_uniform.default
        }

        
        let showIfFunc
        let uniToCheck
        if(this_uniform["showIf"]){
            let showdef = this_uniform["showIf"]
            
            uniToCheck = uniforms[ showdef["uniform"] ]
            let valueToCompare = showdef["value"]

            myDiv = document.createElement("div")
            uniDiv.appendChild(myDiv)

            let showOrHide = function(){
                let res = "none"
                if (arguments[0] == true)
                { res = "block" }
                
                myDiv.style.display = res
            }
            
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
        
        

        myDiv.appendChild(document.createTextNode(this_uniform.ui_name +": "))
        myDiv.appendChild(newInput)
        myDiv.appendChild(document.createElement("br"))

        newInput.addEventListener("change",inputChangedFunc)
        newInput.dispatchEvent(new Event("change"))
        newInput.addEventListener("change",render)
    }
}

function updateUniformsGL() {
    if (current_kernel == undefined) {
        console.log("KERNEL UNDEFINED")
        return
    }
    for (const key in current_kernel.uniforms) {
        let uniform = current_kernel.uniforms[key]
        switch(uniform["type"]) {
            case "intEntry":
            case "intOptions":
            case "checkbox":
                gl.uniform1i(uniform.uniloc,uniform.value)
                break;
            case "floatEntry":
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

function renderGL() { 
    canvasGL.width = document.getElementById("imgsize").value
    canvasGL.height = canvasGL.width
    
    updateUniformsGL()
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function renderJS() {
    canvasJSK.width = document.getElementById("imgsize").value
    canvasJSK.height = canvasJSK.width
    showDidYouKnow()
    setTimeout(function(){
        let res = new vec2(1.0/canvasJSK.width,1.0/canvasJSK.height)
        for (let j=0; j < canvasJSK.height; j++){
            for (let i=0; i < canvasJSK.width; i++){
                let p = new vec2(i,j)
                current_kernel.jsShader(ctx,p,p.mul(res),current_kernel.uniforms)
            }
        }
    },100)
    setTimeout(hideDidYouKnow,1000)
    
}

function render() {
    if (rendererSelector.selectedIndex == 0) { renderGL() }
    else { renderJS() }
    setTimeout(updateBackground,100)
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
    let rect = c.getBoundingClientRect()
    console.log(rect.right, rect.top)
    bgEl.style.backgroundImage = 'url('+ imag + ')'
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

var image_size = document.getElementById("imgsize")
image_size.onchange = function(){
    image_size.value = Math.min(image_size.max,image_size.value)
    image_size.value = Math.max(0,image_size.value)
    render()
}

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
}
rendererSelector.onchange()