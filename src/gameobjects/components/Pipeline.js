/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PIPELINE_CONST = require('../../renderer/webgl/pipelines/const');

/**
 * Provides methods used for setting the WebGL rendering pipeline of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.Pipeline
 * @webglOnly
 * @since 3.0.0
 */

var Pipeline = {

    /**
     * The initial WebGL pipeline of this Game Object.
     *
     * If you call `resetPipeline` on this Game Object, the pipeline is reset to this default.
     *
     * @name Phaser.GameObjects.Components.Pipeline#defaultPipeline
     * @type {Phaser.Renderer.WebGL.WebGLPipeline}
     * @default null
     * @webglOnly
     * @since 3.0.0
     */
    defaultPipeline: null,

    /**
     * The current WebGL pipeline of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Pipeline#pipeline
     * @type {Phaser.Renderer.WebGL.WebGLPipeline}
     * @default null
     * @webglOnly
     * @since 3.0.0
     */
    pipeline: null,

    /**
     * An object to store pipeline specific data in, to be read by the pipeline this Game Object uses.
     *
     * @name Phaser.GameObjects.Components.Pipeline#pipelineData
     * @type {object}
     * @webglOnly
     * @since 3.50.0
     */
    pipelineData: {},

    /**
     * Sets the initial WebGL Pipeline of this Game Object.
     *
     * This should only be called during the instantiation of the Game Object. After that, use `setPipeline`.
     *
     * @method Phaser.GameObjects.Components.Pipeline#initPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} pipeline - Either the string-based name of the pipeline, or a pipeline instance to set.
     *
     * @return {boolean} `true` if the pipeline was set successfully, otherwise `false`.
     */
    initPipeline: function (pipeline)
    {
        if (pipeline === undefined) { pipeline = PIPELINE_CONST.MULTI_PIPELINE; }

        var renderer = this.scene.sys.renderer;
        var pipelines = renderer.pipelines;

        if (pipelines)
        {
            var instance = pipelines.get(pipeline);

            if (instance)
            {
                this.defaultPipeline = instance;
                this.pipeline = instance;

                return true;
            }
        }

        return false;
    },

    /**
     * Sets the active WebGL Pipeline of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Pipeline#setPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} pipeline - Either the string-based name of the pipeline, or a pipeline instance to set.
     *
     * @return {this} This Game Object instance.
     */
    setPipeline: function (pipeline, pipelineData)
    {
        var renderer = this.scene.sys.renderer;
        var pipelines = renderer.pipelines;

        if (pipelines)
        {
            var instance = pipelines.get(pipeline);

            if (instance)
            {
                this.pipeline = instance;
                this.pipelineData = pipelineData;
            }
        }

        return this;
    },

    setPipelineData: function (key, value)
    {
        this.pipelineData[key] = value;

        return this;
    },

    /**
     * Resets the WebGL Pipeline of this Game Object back to the default it was created with.
     *
     * @method Phaser.GameObjects.Components.Pipeline#resetPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @return {boolean} `true` if the pipeline was set successfully, otherwise `false`.
     */
    resetPipeline: function ()
    {
        this.pipeline = this.defaultPipeline;

        return (this.pipeline !== null);
    },

    /**
     * Gets the name of the WebGL Pipeline this Game Object is currently using.
     *
     * @method Phaser.GameObjects.Components.Pipeline#getPipelineName
     * @webglOnly
     * @since 3.0.0
     *
     * @return {string} The string-based name of the pipeline being used by this Game Object.
     */
    getPipelineName: function ()
    {
        return this.pipeline.name;
    }

};

module.exports = Pipeline;
