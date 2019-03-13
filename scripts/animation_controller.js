class AnimationController {

  constructor(animation_config, canvas_id) {
  	if ( animation_config ) {


	  	this.width = animation_config.width;
	  	this.height = animation_config.height;
	  	this.scale = animation_config.scale;  		

	  	this.canvas_id = canvas_id;
	  	this.animation = animation_config.animation_object;
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
	  	// var exportRoot = scope.animation_object = scope.animation;
	  	console.log('ANIMATION OBJ: ', exportRoot);
	  	// console.log('Created OBJ: ', new lib.Trener());
	  
	  	console.log('LABELS: ', exportRoot.getLabels());

	  	var stage = scope.stage = new createjs.Stage(scope.canvas_id);
	  	createContainer(stage);

	  	//scaling
	  	exportRoot.scale = scope.scale;
	  	exportRoot.scaleX = scope.width;
	  	exportRoot.scaleY = scope.height;

			scope.container.addChild(exportRoot);
	  	stage.update();

		}

		function createContainer(stage) {
			var height = stage.canvas.height;
			var width = stage.canvas.width;
			var animation_container = scope.container = new createjs.Container();
	  	stage.addChild(animation_container);
	  	animation_container.regX = 0; 
	  	animation_container.regY = 0; 
		}
  }

  playAnimation() {
  	createjs.Ticker.setFPS(25);
		createjs.Ticker.addEventListener("tick", this.stage);
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
  	var scale_x = this.container.scaleX;
  	var width = this.container.getBounds().width;
		var animation_x = this.container.getBounds().x;
		var result_x = width + animation_x;

		this.container.scaleX = (this.container.scaleX < 0 ) ? 1: -1;
  	this.container.x = this.container.x + this.container.scaleX * (-1) * result_x;
  }

  mirrorY() {
  	var scale_y = this.container.scaleY;
  	var height = this.container.getBounds().height;
		var animation_y = this.container.getBounds().y;
		var result_y = height + animation_y;

		this.container.scaleY = (this.container.scaleY < 0 ) ? 1: -1;
  	this.container.y = this.container.y + this.container.scaleY * (-1) * result_y;
  }

  getAnimationLabels() {
  	return this.animation_object.getLabels();
  }

  playFromLabel(label) {
  	console.log(label);
  	this.animation_object.gotoAndPlay(label.position);
  }
}
    
