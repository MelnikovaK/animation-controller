class AnimationController {

  constructor(animation_config) {
  	//CONSTANTS
  	this.ASSETS_LOADED = 'assets_loaded';
  	this.LABEL_CHANGED = 'label_changed';
  	this.ANIMATION_FINISHED = 'animation_cycle_finished';
    this.ANIMATION_OBJECT_CHANGED = 'animation_object_changed';

    //loop parameters
    this.INFINITY = 'infinity';

  	//DEBUGGER
  	this.show_debug_buttons = false;
    this.ON_DEBUG = false;

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


  addAnimationObject(config, obj) {
		this.config = Object.assign( this.config, config );
		this.animation_name = this.config.animation_name;
		this.animation_object = obj;
		if ( this.config.show_debug ) this.ON_DEBUG = true;
  }

  addAnimationToScreen($container) {
  	//add canvas
  	var newCanvas = $('<canvas id="' + this.config.canvas_id + '"></canvas>');
		$container.append(newCanvas);
		this.$animation_cont = $container;

		//add stage
		var stage = this.stage = new createjs.Stage(this.config.canvas_id);
		var height = stage.canvas.height = this.config.container_height;
		var width = stage.canvas.width = this.config.container_width;

		//add container
		var animation_container = this.container = new createjs.Container();
  	stage.addChild(animation_container);
  	animation_container.regX = width / 2; 
  	animation_container.regY = height / 2; 
  	animation_container.x = width / 2;
  	animation_container.y = height / 2;

		this.container.addChild(this.animation_object);
  	stage.update();

  	this.setAnimationParameteres();
  }

  setAnimationParameteres() {
    if ( this.animation_name != this.config.animation_name ) {
      var event = new CustomEvent( this.ANIMATION_OBJECT_CHANGED, { detail: {new_animation_id: this.config.animation_name, prev_animation_id: this.animation_name, animation: this.animation_object}} );
      window.dispatchEvent(event);
      this.animation_name = this.config.animation_name;
    }
  	//width
  	if ( this.config.width ) this.animation_object.scaleX = this.config.width / this.animation_object.getBounds().width;
  	//height
  	if ( this.config.height ) this.animation_object.scaleY = this.config.height / this.animation_object.getBounds().height;
  	//scale
  	if ( typeof this.config.scale != 'number' ) this.$animation_cont.children().css('object-fit', this.config.scale);
 		else if( this.config.scale ) this.animation_object.scale = this.config.scale;
 		//loop
 		if ( this.config.loop ) this.loop_amount = this.config.loop;

 		//labels
    var labels = this.animation_object.labels;
 		this.label_start = this.config.label_start || labels[0].label;
 		this.label_end = this.config.label_end || labels[labels.length - 1].label;

  	this.playFromLabel(this.label_start);//-
  }

  changeAnimationObject(new_obj) {
    this.container.removeChild(this.animation_object);
    this.container.addChild(new_obj);
    this.animation_object = new_obj;
  }

  playAnimation() {
  	var scope = this;
  	this.FPS = this.config.fps || 25;

  	var current_label;
  	createjs.Ticker.setFPS(this.FPS)
		createjs.Ticker.addEventListener('tick', tick_stage)

    function tick_stage() {
      scope.stage.update();
      //label changed
      if ( current_label != scope.animation_object.currentLabel) {
        var event = new CustomEvent( scope.LABEL_CHANGED, { detail: {previous_label: current_label, current_label: scope.animation_object.currentLabel}} );
        window.dispatchEvent(event);
        current_label = scope.animation_object.currentLabel;
      }
      
      //end of animation loop
      if ( current_label == scope.label_end && scope.loop_amount != scope.INFINITY) {
        if ( scope.loop_amount ) {
          scope.loop_amount--;
          if ( scope.loop_amount <= 0 ) {
            if ( scope.config.onfinish ) {
              scope.config = scope.config.onfinish;
              scope.setAnimationParameteres();
              //if onfinish doesn't exist
            } else scope.animation_object.tickEnabled = false;
          } else { // if loop amount > 0
            scope.playFromLabel(scope.label_start);
          } // if loop_amount doesn't exist        
        } else scope.animation_object.tickEnabled = false;
      }
    }
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
    
