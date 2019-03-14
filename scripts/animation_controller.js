class AnimationController {

  constructor(animation_config, canvas_id) {
  	if ( animation_config ) {

	  	this.width = animation_config.width;
	  	this.height = animation_config.height;
	  	this.scale = animation_config.scale;  		
	  	this.canvas_id = canvas_id;
  	}
  	this.preloadAssets(animation_config.manifest);
  }

  preloadAssets(manifest) {
  	var scope = this;
  	var loader = new createjs.LoadQueue(false);
		loader.addEventListener("fileload", handleFileLoad);
		loader.addEventListener("complete", handleComplete);
		loader.loadManifest(manifest);

		function handleFileLoad(evt) {
			if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
		}

		//init stage
		function handleComplete() {
	  	var event = new CustomEvent( 'assets_loaded' );
	  	window.dispatchEvent(event);
  	}		
  }

  createAnimationObject(obj) {
  	var scope = this;
  	this.animation_object = obj;

  	var stage = this.stage = new createjs.Stage(this.canvas_id);
  	createContainer(stage);

  	//scaling
  	this.animation_object.scale = this.scale;
  	this.animation_object.scaleX = this.width;
  	this.animation_object.scaleY = this.height;

		this.container.addChild(this.animation_object);
  	stage.update();

  	function createContainer(stage) {
			var height = stage.canvas.height;
			var width = stage.canvas.width;
			var animation_container = scope.container = new createjs.Container();
	  	stage.addChild(animation_container);
	  	
	  	//container properties
	  	animation_container.regX = width / 2; 
	  	animation_container.regY = height / 2; 
	  	animation_container.x = width / 2;
	  	animation_container.y = height / 2;
		}
  }

  playAnimation() {
  	var scope = this;
  	var current_label;
  	var last_frame = scope.animation_object.totalFrames - 1;
  	createjs.Ticker.setFPS(25);
		createjs.Ticker.addEventListener("tick", this.stage);
		createjs.Ticker.addEventListener('tick', function() {
			if ( current_label != scope.animation_object.currentLabel) {
				var event = new CustomEvent( 'label_changed', { detail: {previous_label: current_label, current_label: scope.animation_object.currentLabel}} );
	  		window.dispatchEvent(event);
				current_label = scope.animation_object.currentLabel;
			}
			if ( scope.animation_object.currentFrame == last_frame ) {
				var event = new CustomEvent( 'animation_cycle_finished');
	  		window.dispatchEvent(event);
			}
		})
  }

  removeAnimationObject() {
		this.container.removeChild(this.animation_object);
  }

  addAnimationObject() {
		this.container.addChild(this.animation_object);
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

  playFromLabel(label) {
  	this.animation_object.gotoAndPlay(label.position);
  }
}
    
