define(["Tone/core/Tone"], function(Tone){

	/**
	 *  Threshold an incoming signal between -1 to 1
	 *
	 *  Set the threshold value such that signal above the value will equal 1, 
	 *  and below will equal 0.
	 *  
	 *  Values below 0.5 will return 0 and values above 0.5 will return 1
	 *  
	 *  @constructor
	 *  @param {number=} thresh threshold value above which the output will equal 1 
	 *                          and below which the output will equal 0
	 *                          @default 0
	 *  @extends {Tone}
	 */
	Tone.Threshold = function(thresh){
		
		/**
		 *  @type {WaveShaperNode}
		 *  @private
		 */
		this._thresh = this.context.createWaveShaper();

		/**
		 *  make doubly sure that the input is thresholded by 
		 *  passing it through two waveshapers
		 *  
		 *  @type {WaveShaperNode}
		 *  @private
		 */
		this._doubleThresh = this.context.createWaveShaper();

		/**
		 *  @type {WaveShaperNode}
		 */
		this.input = this._thresh;
		this.output = this._doubleThresh;

		this._thresh.connect(this._doubleThresh);

		this._setThresh(this._thresh, this.defaultArg(thresh, 0));
		this._setThresh(this._doubleThresh, 1);
	};

	Tone.extend(Tone.Threshold);

	/**
	 *  @param {number} thresh 
	 *  @private
	 */
	Tone.Threshold.prototype._setThresh = function(component, thresh){
		var curveLength = 1024;
		var curve = new Float32Array(curveLength);
		for (var i = 0; i < curveLength; i++){
			var normalized = (i / (curveLength - 1)) * 2 - 1;
			var val;
			if (normalized < thresh){
				val = 0;
			} else {
				val = 1;
			}
			curve[i] = val;
		}
		component.curve = curve;
	};

	/**
	 *  sets the threshold value
	 *  
	 *  @param {number} thresh number must be between -1 and 1
	 */
	Tone.Threshold.prototype.setThreshold = function(thresh){
		this._setThresh(this._thresh, thresh);
	};

	/**
	 *  dispose method
	 */
	Tone.Threshold.prototype.dispose = function(){
		this._thresh.disconnect();
		this._doubleThresh.disconnect();
		this._thresh = null;
		this._doubleThresh = null;
	};

	return Tone.Threshold;
});