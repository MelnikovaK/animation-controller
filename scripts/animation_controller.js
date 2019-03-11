class AnimationController {

  constructor(animation_config, canvas_id) {
  	if ( animation_config ) {
	  	this.width = animation_config.width;
	  	this.height = animation_config.height;
	  	this.scale = animation_config.scale;  		
  	}

  	if ( canvas_id ) {
  		this.initStage(canvas_id);
  	}
  }

  initStage(canvas_id) {
  	var stage = this.stage = new createjs.Stage(canvas_id);

  	//update the stage
  	stage.update();
  }

  createAnimationObject(width, height, animation_scale) {

  }
}
    
