import React, { useEffect, useRef } from 'react';

function WebGLCanvas() {
  const canvasRef = useRef(null);
  const positionRef = useRef([0, 0]); // Track translation (x, y)

  useEffect(() => {
    const canvas = canvasRef.current;
    let gl = canvas.getContext('webgl');

    if (!gl) {
      gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
      alert('WebGL not supported');
      return;
    }

    // Clear the canvas with a color (black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Define the vertices for a triangle
    const vertices = new Float32Array([
      -0.1,  0.1,
       0.1,  0.1,
      -0.1, -0.1,
      -0.1, -0.1,
       0.1,  0.1,
       0.1, -0.1,
    ]);

    // Create a buffer and put the vertices in it
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Vertex shader
    const vsSource = `
      attribute vec2 a_position;
      uniform vec2 u_translation;
      void main() {
        gl_Position = vec4(a_position + u_translation, 0.0, 1.0);
      }
    `;
    
    // Fragment shader
    const fsSource = `
      void main() {
        gl_FragColor = vec4(0.6, 0.6, 0.0, 1.0); // Red color
      }
    `;

    // Compile shaders
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create a program and link shaders
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Bind the position buffer
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const translationLocation = gl.getUniformLocation(program, 'u_translation');

    function drawScene() {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2fv(translationLocation, positionRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    drawScene();

    const moveAmount = 0.02;
    function handleKeyDown(e) {
      const pos = positionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          pos[1] += moveAmount;
          break;
        case 'ArrowDown':
        case 's':
          pos[1] -= moveAmount;
          break;
        case 'ArrowLeft':
        case 'a':
          pos[0] -= moveAmount;
          break;
        case 'ArrowRight':
        case 'd':
          pos[0] += moveAmount;
          break;
        default:
          return;
      }

      positionRef.current = [...pos];
      drawScene();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Utility function to compile shader
  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  return (
      <canvas ref={canvasRef} width="1280" height="720" />
  );
}

export default WebGLCanvas;

