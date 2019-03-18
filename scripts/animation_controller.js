class AnimationController {

  constructor(animation_config) {
  	//CONSTANTS
  	this.ASSETS_LOADED = 'assets_loaded';
  	this.LABEL_CHANGED = 'label_changed';
  	this.ANIMATION_FINISHED = 'animation_cycle_finished';

  	//DEBUGGER
  	this.debugger_on = false;

  	this.config = animation_config;

  	this.preloadAssets(animation_config);
  }

 preloadAssets(animation_config) {
  	var scope = this;
  	var loader = new createjs.LoadQueue(false);
		loader.addEventListener("fileload", handleFileLoad);
		loader.addEventListener("complete", handleComplete);
		loader.loadManifest(animation_config.manifest);

		function handleFileLoad(evt) {
			if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
		}

		//init stage
		function handleComplete() {
    	var event = new CustomEvent( scope.ASSETS_LOADED, { detail: {id: animation_config.animation_name}});
	  	window.dispatchEvent(event);
  	}		
  }


  addAnimationObject(config, $container, obj) {
  	//unit data
		this.config = Object.assign( this.config, config );

  	//add canvas
  	var newCanvas = $('<canvas id="' + this.config.animation_name + '"</canvas>').width(this.config.container_width).height(this.config.container_height);
		$container.append(newCanvas);
		this.$animation_cont = $container;

		//add stage
		var stage = this.stage = new createjs.Stage(this.config.animation_name);
		var height = stage.canvas.height;
		var width = stage.canvas.width;
		//add container
		var animation_container = this.container = new createjs.Container();
  	stage.addChild(animation_container);
  	animation_container.regX = width / 2; 
  	animation_container.regY = height / 2; 
  	animation_container.x = width / 2;
  	animation_container.y = height / 2;

  	//add animation
		this.animation_object = obj;

		this.container.addChild(this.animation_object);
  	stage.update();


  	this.setAnimationParameteres();

  }

  setAnimationParameteres() {
  	//width
  	if ( this.config.width ) this.animation_object.scaleX = this.config.width / this.animation_object.getBounds().width;
  	//height
  	if ( this.config.height ) this.animation_object.scaleY = this.config.height / this.animation_object.getBounds().height;
  	//scale
  	if ( typeof this.config.scale != 'number' ) this.$animation_cont.children().css('object-fit', this.config.scale);
 		else if( this.config.scale ) this.animation_object.scale = this.config.scale;
 		//loop
 		if ( this.config.loop ) this.loop_amount = this.config.loop;
 		//show debug
 		// if ( this.config.show_debug ) this.showDebugButtons();
 		//label
 		if ( this.config.label_start ) this.playFromLabel(this.config.label_start);
 		if ( this.config.label_end ) this.label_end = this.config.label_end;
 		// console.log(this.animation_object);

  }

  playAnimation() {
  	var scope = this;

  	this.FPS = this.config.fps || 25;

  	var current_label;
  	var last_frame = scope.animation_object.totalFrames - 1;
  	createjs.Ticker.setFPS(this.FPS)
		createjs.Ticker.addEventListener('tick', function() {			
			scope.stage.update();
			if ( current_label != scope.animation_object.currentLabel) {
				var event = new CustomEvent( scope.LABEL_CHANGED, { detail: {previous_label: current_label, current_label: scope.animation_object.currentLabel}} );
	  		window.dispatchEvent(event);
				current_label = scope.animation_object.currentLabel;
			}
			if ( scope.animation_object.currentFrame == last_frame ) {
				var event = new CustomEvent( scope.ANIMATION_FINISHED );
	  		window.dispatchEvent(event);
			}

			//end of animation
			if ( current_label == scope.label_end) {
				if ( scope.loop_amount ) {
					scope.loop_amount--;
					if ( scope.loop_amount == 0 ) {
						scope.animation_object.tickEnabled = false;
						last_frame = undefined;
					}
				} else scope.animation_object.tickEnabled = false;
			}
		})
  }

  removeAnimationObject() {
		this.container.removeChild(this.animation_object);
  }

  pauseAnimation() {
  	this.animation_object.tickEnabled = false;
  }

  resumeAnimation() {
  	this.animation_object.tickEnabled = true;
  }

  mirrorX() {
		this.container.scaleX = (this.container.scaleX < 0 ) ? 1: -1;
  }

  mirrorY() {
		this.container.scaleY = (this.container.scaleY < 0 ) ? 1: -1;
  }

  getAnimationLabels() {
  	return this.animation_object.labels;
  }

  playFromLabel(label,label_end,loop,onComplete) {
  	this.animation_object.gotoAndPlay(label);
  }
}
    
