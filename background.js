const canvas = document.getElementById("shader_canvas");
const gl = canvas.getContext('webgl');

let vertexShaderSource, fragmentShaderSource;
let program, vertexBuffer;
let time = 0.0;

init();

async function init() {
    await fetch(canvas.getAttribute("vertex"))
        .then(readResponse)
        .then(source => {
            vertexShaderSource = source;
        });

    await fetch(canvas.getAttribute("fragment"))
        .then(readResponse)
        .then(source => {
            fragmentShaderSource = source;
        });
    
    createProgram();
    createBuffers();
    animate();
}

function readResponse(response) {
    if (!response.ok) {
        throw new Error("Fetch error: " + response.statusText);
    }

    return response.text();
}

function createProgram() {
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const status = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!status) {
        const log = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(log);
    }
}

function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!status) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(log);
    }
    
    return shader;
}

function createBuffers() {
    const vertices = new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        1, 1,
    ]);

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    let timeUniformLocation = gl.getUniformLocation(program, "time");
    gl.uniform1f(timeUniformLocation, time);

    let resolutionUniformLocation = gl.getUniformLocation(program, "resolution");
    gl.uniform2f(resolutionUniformLocation, canvas.offsetWidth / 4, canvas.offsetHeight / 4);

    let positionAttributeLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    time += 0.1;
}