import React, { useEffect, useRef } from 'react';

function WebGLCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Get the WebGL context from the canvas
    const canvas = canvasRef.current;
    let gl = canvas.getContext('webgl');

    if (!gl) {
      console.log('WebGL not supported, falling back to experimental-webgl');
      gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
      alert('Your browser does not support WebGL');
      return;
    }

    // Clear the canvas with a color (black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Define the vertices for a triangle
    const vertices = new Float32Array([
      1.0,  1.0,
     -1.0,  1.0,
     -1.0, -1.0,
    ]);

    // Create a buffer and put the vertices in it
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Vertex shader
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
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
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);

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

