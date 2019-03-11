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
	  	var exportRoot = new lib.trener();
	  	var stage = scope.stage = new createjs.Stage(scope.canvas_id);
			stage.addChild(exportRoot);
	  	stage.update();

	  	createjs.Ticker.setFPS(25);
			createjs.Ticker.addEventListener("tick", stage);
		}
  }


  createAnimationObject() {

  }
}
    
