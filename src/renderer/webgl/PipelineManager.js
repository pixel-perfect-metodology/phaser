/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CustomMap = require('../../structs/Map');
var CONST = require('./pipelines/const');

//  Default Phaser 3 Pipelines
var BitmapMaskPipeline = require('./pipelines/BitmapMaskPipeline');
var CameraPipeline = require('./pipelines/CameraPipeline');
var GraphicsPipeline = require('./pipelines/GraphicsPipeline');
var LightPipeline = require('./pipelines/LightPipeline');
var MultiPipeline = require('./pipelines/MultiPipeline');
var RopePipeline = require('./pipelines/RopePipeline');
var SinglePipeline = require('./pipelines/SinglePipeline');

/**
 * @classdesc
 * The Pipeline Manager is responsible for the creation, activation, running and destruction
 * of WebGL Pipelines in Phaser 3.
 *
 * The `WebGLRenderer` owns a single instance of the Pipeline Manager, which you can access
 * via the `WebGLRenderer.pipelines` property.
 *
 * By default, there are 5 pipelines installed into the Pipeline Manager when Phaser boots:
 *
 * 1. The Multi Pipeline. Responsible for all multi-texture rendering, i.e. Sprites, Shapes.
 * 2. The Single Pipeline. Responsible for rendering Game Objects that explicitly require one bound texture.
 * 3. The Rope Pipeline. Responsible for rendering the Rope Game Object.
 * 4. The Light Pipeline. Responsible for rendering the Light Game Object.
 * 5. The Bitmap Mask Pipeline. Responsible for Bitmap Mask rendering.
 *
 * You can add your own custom pipeline via the `PipelineManager.add` method. Pipelines are
 * identified by unique string-based keys.
 *
 * @class PipelineManager
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the WebGL Renderer that owns this Pipeline Manager.
 */
var PipelineManager = new Class({

    initialize:

    function PipelineManager (renderer)
    {
        /**
         * A reference to the Game instance.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#game
         * @type {Phaser.Game}
         * @since 3.50.0
         */
        this.game = renderer.game;

        /**
         * A reference to the WebGL Renderer instance.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 3.50.0
         */
        this.renderer = renderer;

        /**
         * This map stores all pipeline instances in this manager.
         *
         * This is populated with the default pipelines in the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#pipelines
         * @type {Phaser.Structs.Map.<string, Phaser.Renderer.WebGL.WebGLPipeline>}
         * @since 3.50.0
         */
        this.pipelines = new CustomMap();

        /**
         * Current pipeline in use by the WebGLRenderer.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#current
         * @type {Phaser.Renderer.WebGL.WebGLPipeline}
         * @default null
         * @since 3.50.0
         */
        this.current = null;

        /**
         * The previous WebGLPipeline that was in use.
         *
         * This is set when `clearPipeline` is called and restored in `rebindPipeline` if none is given.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#previous
         * @type {Phaser.Renderer.WebGL.WebGLPipeline}
         * @default null
         * @since 3.50.0
         */
        this.previous = null;

        /**
         * Current post pipeline in use by the WebGLRenderer.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#currentPost
         * @type {Phaser.Renderer.WebGL.WebGLPipeline}
         * @default null
         * @since 3.50.0
         */
        this.currentPost = null;

        /**
         * The previous post pipeline that was in use.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#previousPost
         * @type {Phaser.Renderer.WebGL.WebGLPipeline}
         * @default null
         * @since 3.50.0
         */
        this.previousPost = null;

        /**
         * A constant-style reference to the Multi Pipeline Instance.
         *
         * This is the default Phaser 3 pipeline and is used by the WebGL Renderer to manage
         * camera effects and more. This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#MULTI_PIPELINE
         * @type {Phaser.Renderer.WebGL.Pipelines.MultiPipeline}
         * @default null
         * @since 3.50.0
         */
        this.MULTI_PIPELINE = null;

        /**
         * A constant-style reference to the Bitmap Mask Pipeline Instance.
         *
         * This is the default Phaser 3 mask pipeline and is used Game Objects using
         * a Bitmap Mask. This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#BITMAPMASK_PIPELINE
         * @type {Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline}
         * @default null
         * @since 3.50.0
         */
        this.BITMAPMASK_PIPELINE = null;

        /**
         * A constant-style reference to the Camera Pipeline Instance.
         *
         * This is the default Phaser 3 camera pipeline and is used by cameras to handle
         * their pre and post render effects. This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#CAMERA_PIPELINE
         * @type {Phaser.Renderer.WebGL.Pipelines.CameraPipeline}
         * @default null
         * @since 3.50.0
         */
        this.CAMERA_PIPELINE = null;
    },

    /**
     * Internal boot handler, called by the WebGLRenderer durings its boot process.
     *
     * Adds all of the default pipelines, based on the game config, and then calls
     * the `boot` method on each one of them.
     *
     * Finally, the default pipeline is set.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#boot
     * @since 3.50.0
     */
    boot: function ()
    {
        var game = this.game;

        this.MULTI_PIPELINE = this.add(CONST.MULTI_PIPELINE, new MultiPipeline({ game: game }));
        this.BITMAPMASK_PIPELINE = this.add(CONST.BITMAPMASK_PIPELINE, new BitmapMaskPipeline({ game: game }));
        this.CAMERA_PIPELINE = this.add(CONST.CAMERA_PIPELINE, new CameraPipeline({ game: game }));

        this.add(CONST.SINGLE_PIPELINE, new SinglePipeline({ game: game }));
        this.add(CONST.ROPE_PIPELINE, new RopePipeline({ game: game }));
        this.add(CONST.LIGHT_PIPELINE, new LightPipeline({ game: game }));
        this.add(CONST.GRAPHICS_PIPELINE, new GraphicsPipeline({ game: game }));
    },

    /**
     * Adds a pipeline instance to this Pipeline Manager.
     *
     * The name of the instance must be unique within this manager.
     *
     * Make sure to pass an instance to this method, not a base class.
     *
     * For example, you should pass it like this:
     *
     * ```javascript
     * this.add('yourName', new CustomPipeline());`
     * ```
     *
     * and **not** like this:
     *
     * ```javascript
     * this.add('yourName', CustomPipeline);`
     * ```
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#addPipeline
     * @since 3.50.0
     *
     * @param {string} name - A unique string-based key for the pipeline within the manager.
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - A pipeline _instance_ which must extend `WebGLPipeline`.
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} The pipeline instance that was passed.
     */
    add: function (name, pipeline)
    {
        var pipelines = this.pipelines;
        var renderer = this.renderer;

        if (!pipelines.has(name))
        {
            pipeline.name = name;
            pipeline.manager = this;

            pipelines.set(name, pipeline);
        }
        else
        {
            console.warn('Pipeline exists: ' + name);
        }

        if (!pipeline.hasBooted)
        {
            pipeline.boot();
        }

        if (renderer.width !== 0 && renderer.height !== 0)
        {
            pipeline.resize(renderer.width, renderer.height);
        }

        return pipeline;
    },

    /**
     * Resizes handler.
     *
     * This is called automatically by the `WebGLRenderer` when the game resizes.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#resize
     * @since 3.50.0
     *
     * @param {number} [width] - The new width of the renderer.
     * @param {number} [height] - The new height of the renderer.
     */
    resize: function (width, height)
    {
        var pipelines = this.pipelines;

        pipelines.each(function (pipelineName, pipelineInstance)
        {
            pipelineInstance.resize(width, height);
        });
    },

    /**
     * Calls the `onPreRender` method on each pipeline in this manager.
     *
     * This is called automatically by the `WebGLRenderer.preRender` method.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#preRender
     * @since 3.50.0
     */
    preRender: function ()
    {
        var pipelines = this.pipelines;

        pipelines.each(function (pipelineName, pipelineInstance)
        {
            pipelineInstance.onPreRender();
        });
    },

    /**
     * Calls the `onRender` method on each pipeline in this manager.
     *
     * This is called automatically by the `WebGLRenderer.render` method.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#render
     * @since 3.50.0
     *
     * @param {Phaser.Scene} scene - The Scene to render.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Scene Camera to render with.
     */
    render: function (scene, camera)
    {
        var pipelines = this.pipelines;

        pipelines.each(function (pipelineName, pipelineInstance)
        {
            pipelineInstance.onRender(scene, camera);
        });
    },

    /**
     * Calls the `onPostRender` method on each pipeline in this manager.
     *
     * This is called automatically by the `WebGLRenderer.postRender` method.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#postRender
     * @since 3.50.0
     */
    postRender: function ()
    {
        this.flush();

        var pipelines = this.pipelines;

        pipelines.each(function (pipelineName, pipelineInstance)
        {
            pipelineInstance.onPostRender();
        });
    },

    /**
     * Flushes the current pipeline, if one is bound.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#flush
     * @since 3.50.0
     */
    flush: function ()
    {
        if (this.current)
        {
            this.current.flush();
        }
    },

    /**
     * Checks if a pipeline is present in this Pipeline Manager.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#has
     * @since 3.50.0
     *
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} pipeline - Either the string-based name of the pipeline to get, or a pipeline instance to look-up.
     *
     * @return {boolean} `true` if the given pipeline is loaded, otherwise `false`.
     */
    has: function (pipeline)
    {
        var pipelines = this.pipelines;

        if (typeof pipeline === 'string')
        {
            return pipelines.has(pipeline);
        }
        else if (pipelines.contains(pipeline))
        {
            return true;
        }

        return false;
    },

    /**
     * Returns the pipeline instance based on the given name, or instance.
     *
     * If no instance, or matching name, exists in this manager, it returns `undefined`.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#get
     * @since 3.50.0
     *
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} pipeline - Either the string-based name of the pipeline to get, or a pipeline instance to look-up.
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} The pipeline instance, or `undefined` if not found.
     */
    get: function (pipeline)
    {
        var pipelines = this.pipelines;

        if (typeof pipeline === 'string')
        {
            return pipelines.get(pipeline);
        }
        else if (pipelines.contains(pipeline))
        {
            return pipeline;
        }
    },

    /**
     * Removes a pipeline based on the given name.
     *
     * If no pipeline matches the name, this method does nothing.
     *
     * Note that the pipeline will not be flushed or destroyed, it's simply removed from
     * this manager.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#remove
     * @since 3.50.0
     *
     * @param {string} name - The name of the pipeline to be removed.
     */
    remove: function (name)
    {
        this.pipelines.delete(name);
    },

    /**
     * Sets the current pipeline to be used by the `WebGLRenderer`.
     *
     * This method accepts a pipeline instance as its parameter, not the name.
     *
     * If the pipeline isn't already the current one it will call `WebGLPipeline.bind` and then `onBind`.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#set
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The pipeline instance to be set as current.
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object that invoked this pipeline, if any.
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} The pipeline that was set.
     */
    set: function (pipeline, gameObject)
    {
        if (!this.isCurrent(pipeline))
        {
            this.flush();

            if (this.current)
            {
                this.current.unbind();
            }

            this.current = pipeline;

            pipeline.bind();
        }

        pipeline.onBind(gameObject);

        return pipeline;
    },

    preBatch: function (gameObject)
    {
        if (!gameObject || !gameObject.postPipeline)
        {
            return;
        }

        this.flush();

        gameObject.postPipeline.postBind(gameObject);
    },

    postBatch: function (gameObject)
    {
        if (!gameObject || !gameObject.postPipeline)
        {
            return;
        }

        this.flush();

        gameObject.postPipeline.postFlush(gameObject);
    },

    /**
     * Checks to see if the given pipeline is already the active pipeline, both within this
     * Pipeline Manager, and also has the same vertex buffer and shader set within the Renderer.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#isCurrent
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The pipeline instance to be checked.
     *
     * @return {boolean} `true` if the given pipeline is already the current pipeline, otherwise `false`.
     */
    isCurrent: function (pipeline)
    {
        var renderer = this.renderer;
        var current = this.current;

        return !(
            current !== pipeline ||
            current.vertexBuffer !== renderer.currentVertexBuffer ||
            current.currentShader.program !== renderer.currentProgram
        );
    },

    /**
     * Sets the Multi Pipeline to be the currently bound pipeline.
     *
     * This is the default Phaser 3 rendering pipeline.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#setMulti
     * @since 3.50.0
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.MultiPipeline} The Multi Pipeline instance.
     */
    setMulti: function ()
    {
        return this.set(this.MULTI_PIPELINE);
    },

    /**
     * Sets the Camera Pipeline to be the currently bound pipeline.
     *
     * This is the default Phaser 3 pipeline for cameras.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#setCameraPipeline
     * @since 3.50.0
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.CameraPipeline} The Camera Pipeline instance.
     */
    setCameraPipeline: function ()
    {
        return this.set(this.CAMERA_PIPELINE);
    },

    /**
     * Use this to reset the gl context to the state that Phaser requires to continue rendering.
     *
     * Calling this will:
     *
     * * Disable `DEPTH_TEST`, `CULL_FACE` and `STENCIL_TEST`.
     * * Clear the depth buffer and stencil buffers.
     * * Reset the viewport size.
     * * Reset the blend mode.
     * * Bind a blank texture as the active texture on texture unit zero.
     * * Rebinds the given pipeline instance.
     *
     * You should call this if you have previously called `clear`, and then wish to return
     * rendering control to Phaser again.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#rebind
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} [pipeline] - The pipeline instance to be rebound. If not given, the previous pipeline will be bound.
     */
    rebind: function (pipeline)
    {
        if (pipeline === undefined && this.previous)
        {
            pipeline = this.previous;
        }

        if (!pipeline)
        {
            return;
        }

        var renderer = this.renderer;
        var gl = renderer.gl;

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

        if (renderer.hasActiveStencilMask())
        {
            gl.clear(gl.DEPTH_BUFFER_BIT);
        }
        else
        {
            //  If there wasn't a stencil mask set before this call, we can disable it safely
            gl.disable(gl.STENCIL_TEST);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        }

        gl.viewport(0, 0, renderer.width, renderer.height);

        renderer.currentProgram = null;
        renderer.currentVertexBuffer = null;
        renderer.currentIndexBuffer = null;

        renderer.setBlendMode(0, true);

        renderer.resetTextures();

        this.current = pipeline;

        pipeline.bind(true);
        pipeline.onBind();
    },

    /**
     * Flushes the current pipeline being used and then clears it, along with the
     * the current shader program and vertex buffer from the `WebGLRenderer`.
     *
     * Then resets the blend mode to NORMAL.
     *
     * Call this before jumping to your own gl context handler, and then call `rebind` when
     * you wish to return control to Phaser again.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#clear
     * @since 3.50.0
     */
    clear: function ()
    {
        var renderer = this.renderer;

        this.flush();

        this.previous = this.current;
        this.current = null;

        renderer.currentProgram = null;
        renderer.currentVertexBuffer = null;
        renderer.currentIndexBuffer = null;

        renderer.setBlendMode(0, true);
    },

    /**
     * Destroy the Pipeline Manager, cleaning up all related resources and references.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        this.flush();

        this.pipelines.clear();

        this.renderer = null;
        this.game = null;
        this.pipelines = null;
        this.current = null;
        this.previous = null;
    }

});

module.exports = PipelineManager;
