class AnimationController {

  constructor(animation_config, canvas_id, animation_object) {
  	if ( animation_config ) {


	  	this.width = animation_config.width;
	  	this.height = animation_config.height;
	  	this.scale = animation_config.scale;  		

	  	this.canvas_id = canvas_id;
	  	// this.animation_object = animation_object;
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
	  	var exportRoot = scope.animation_object = new lib.Trener();

	  	var stage = scope.stage = new createjs.Stage(scope.canvas_id);
	  	createContainer(stage);

	  	//scaling
	  	scope.animation_object.scale = scope.scale;
	  	scope.animation_object.scaleX = scope.width;
	  	scope.animation_object.scaleY = scope.height;

			scope.container.addChild(scope.animation_object);
	  	stage.update();

		}

		function createContainer(stage) {
			var height = stage.canvas.height;
			var width = stage.canvas.width;
			var animation_container = scope.container = new createjs.Container();
	  	stage.addChild(animation_container);
	  	animation_container.regX = width / 2; 
	  	animation_container.regY = height / 2; 
	  	animation_container.x = width / 2;
	  	animation_container.y = height / 2;
		}
  }

  playAnimation() {
  	createjs.Ticker.setFPS(25);
		createjs.Ticker.addEventListener("tick", this.stage);
		console.log(this.animation_object.getBounds())
  }

  removeAnimationObject() {
		this.container.removeChild(this.animation_object);
  }

  addAnimationObject() {
		this.container.addChild(this.animation_object);
  }

  pauseAnimation() {
  	this.animation_object.tickChildren = false;
  }

  resumeAnimation() {
  	this.animation_object.tickChildren = true;
  }

  mirrorX() {
		this.container.scaleX = (this.container.scaleX < 0 ) ? 1: -1;
  }

  mirrorY() {
		this.container.scaleY = (this.container.scaleY < 0 ) ? 1: -1;
  }

  getAnimationLabels() {
  	return this.animation_object.getLabels();
  }

  playFromLabel(label) {
  	console.log(label);
  	this.animation_object.gotoAndPlay(label.position);
  }
}
    
