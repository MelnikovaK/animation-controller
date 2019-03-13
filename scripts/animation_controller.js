class AnimationController {

  constructor(animation_config, canvas_id) {
  	if ( animation_config ) {
	  	this.width = animation_config.width;
	  	this.height = animation_config.height;
	  	this.scale = animation_config.scale;  		

	  	this.animation_object = animation_config.animation_object;

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
			console.log('animation downloaded')
	  	var exportRoot = scope.animation_object = new lib.trener();
	  	console.log(exportRoot)
	  	var stage = scope.stage = new createjs.Stage(scope.canvas_id);

	  	//scaling
	  	exportRoot.scale = scope.scale;
	  	exportRoot.scaleX = scope.width;
	  	exportRoot.scaleY = scope.height;

			stage.addChild(exportRoot);
	  	stage.update();
		}
  }

  playAnimation() {
  	createjs.Ticker.setFPS(25);
		createjs.Ticker.addEventListener("tick", this.stage);
  }

  removeAnimationObject() {
		this.stage.removeChild(this.animation_object);
  }

  addAnimationObject() {
		this.stage.addChild(this.animation_object);
  }

  pauseAnimation() {
  	this.animation_object.tickChildren = false;
  	// this.stage.gotoAndPlay('Tr_C_Hand_1');
  }

  resumeAnimation() {
  	this.animation_object.tickChildren = true;
  }

  mirrorX() {
  	this.animation_object.scale = -1;
  	// var object_matrix = this.animation_object.getMatrix();
  	// object_matrix.translate(1, -1);
  	// this.animation_object.addChild(object_matrix);
  	// this.stage.update();
  	// console.log(this.animation_object.getMatrix());
  }
}
    
