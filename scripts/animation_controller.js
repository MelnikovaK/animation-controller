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
	  	var exportRoot = scope.animation_object = new lib.trener();
	  	console.log(exportRoot)
	  	var stage = scope.stage = new createjs.Stage(scope.canvas_id);

	  	//scaling
	  	exportRoot.scale = scope.scale;
	  	exportRoot.scaleX = scope.width;
	  	exportRoot.scaleY = scope.height;

			stage.addChild(exportRoot);
	  	stage.update();

	  	createjs.Ticker.setFPS(25);
			createjs.Ticker.addEventListener("tick", stage);
		}
  }

  removeAnimationObject() {
  	this.animation_object.tickChildren = false;
		// this.stage.removeChild(this.animation_object);
  }

  addAnimationObject() {
  	this.animation_object.tickChildren = true;
		// this.stage.addChild(this.animation_object);
  }

  pauseAnimation() {
  	this.animation_time = createjs.Ticker.getTime();
  	// createjs.Ticker.stop();
  	console.log(createjs.Ticker.getTime());
  	createjs.Ticker.removeEventListener("tick", this.stage);
  // 	console.log(createjs.Ticker.getPaused())
		// createjs.Ticker.setPaused(true);
  }

  resumeAnimation() {
		createjs.Ticker.addEventListener("tick", this.stage);	
  }

  mirrorX() {
  	this.animation_object.scaleX = -1;
  }
}
    
