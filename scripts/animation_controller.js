class AnimationController {

  constructor(animation_config) {
  	//CONSTANTS
  	this.ASSETS_LOADED = 'assets_loaded';
  	this.LABEL_CHANGED = 'label_changed';
  	this.ANIMATION_FINISHED = 'animation_cycle_finished';

  	this.preloadAssets(animation_config);
  	this.initDebugButtons();
  	this.showDebugButtons();
  }

 //  preloadAssets(animation_config) {
	// console.log(createjs)

 //  	var scope = this;
 //  	var loader = new createjs.LoadQueue(false);
	// 	loader.addEventListener("fileload", handleFileLoad);
	// 	loader.addEventListener("complete", handleComplete);
	// 	loader.loadManifest(animation_config);
	// 	loader.loadFile(animation_config.animation);
	// 	function handleFileLoad(evt) {
	// 		if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
	// 	}

	// 	function handleComplete() {
	//   	var event = new CustomEvent( scope.ASSETS_LOADED );
	//   	window.dispatchEvent(event);
 //  	}		
 //  }

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
    	var event = new CustomEvent( 'assets_loaded' );
	  	window.dispatchEvent(event);
  	}		
  }


  addAnimationObject(config, $container, obj) {
  	//add canvas
  	var newCanvas = $('<canvas id="' + config.animation_name + '"</canvas>').width(config.container_width).height(config.container_height);
		$container.append(newCanvas);

		this.animation_object = obj;

		console.log(this.animation_object);

		//add stage
		var stage = this.stage = new createjs.Stage(config.animation_name);
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

		this.container.addChild(this.animation_object);
  	stage.update();
  	this.playAnimation();
  }

  playAnimation() {

  	var scope = this;
  	var current_label;
  	var last_frame = scope.animation_object.totalFrames - 1;
  	createjs.Ticker.setFPS(25);
		createjs.Ticker.addEventListener("tick", this.stage);
		createjs.Ticker.addEventListener('tick', function() {
			if ( current_label != scope.animation_object.currentLabel) {
				var event = new CustomEvent( scope.LABEL_CHANGED, { detail: {previous_label: current_label, current_label: scope.animation_object.currentLabel}} );
	  		window.dispatchEvent(event);
				current_label = scope.animation_object.currentLabel;
			}
			if ( scope.animation_object.currentFrame == last_frame ) {
				var event = new CustomEvent( scope.ANIMATION_FINISHED );
	  		window.dispatchEvent(event);
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
  	this.animation_object.gotoAndPlay(label.position);
  }

  // >>> DEBUG >>>
  initDebugButtons() {
  	var scope = this;
  	this.$debug_container = $('<div id="debug-container"></div>');
  	$('body').append(this.$debug_container);
  	this.debug_buttons = [
  		$('<button id="play"> Play </button>'),
  		$('<button id="pause"> Pause </button>'),
  		$('<button id="pause"> Resume </button>')
  	]
  	this.debug_buttons.forEach(function(x) {
  		scope.$debug_container.append(x);
  	});
  	this.$debug_container.css('display', 'none');
  }

  showDebugButtons() {
  	this.$debug_container.css('display', 'inherit');
  }

}
    
