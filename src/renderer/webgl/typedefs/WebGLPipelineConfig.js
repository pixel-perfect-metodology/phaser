/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineConfig
 * @since 3.50.0
 *
 * @property {Phaser.Game} game - The Phaser.Game instance that owns this pipeline.
 * @property {string} [name] - The name of the pipeline.
 * @property {GLenum} [topology=gl.TRIANGLES] - How the primitives are rendered. The default value is GL_TRIANGLES. Here is the full list of rendering primitives: (https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants).
 * @property {string} [vertShader] - The source code, as a string, for the vertex shader. If you need to assign multiple shaders, see the `shaders` property.
 * @property {string} [fragShader] - The source code, as a string, for the fragment shader. Can include `%count%` and `%forloop%` declarations for multi-texture support. If you need to assign multiple shaders, see the `shaders` property.
 * @property {number} [vertexCapacity] - The number of vertices to hold in the batch. Defaults to `RenderConfig.batchSize` * 6.
 * @property {number} [vertexSize] - The size, in bytes, of a single entry in the vertex buffer. Defaults to Float32Array.BYTES_PER_ELEMENT * 6 + Uint8Array.BYTES_PER_ELEMENT * 4.
 * @property {ArrayBuffer} [vertices] - An optional Array Buffer full of pre-calculated vertices data.
 * @property {Phaser.Types.Renderer.WebGL.WebGLPipelineAttributesConfig} [attributes] - An array of shader attribute data. All shaders bound to this pipeline must use the same attributes.
 * @property {string[]} [uniforms] - An array of shader uniform names that will be looked-up to get the locations for. If you need to assign multiple shaders, see the `shaders` property.
 * @property {Phaser.Types.Renderer.WebGL.WebGLPipelineShaderConfig[]} [shaders] - An array of shaders, all of which are created for this one pipeline. Uses the `vertShader`, `fragShader`, `attributes` and `uniforms` properties of this object as defaults.
 * @property {boolean} [forceZero=false] - Force the shader to use just a single sampler2d? Set for anything that extends the Single Pipeline.
 */
