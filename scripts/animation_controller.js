class AnimatorContainer {

  constructor(config, animation, $container) {
  	//CONSTANTS
  	this.LABEL_CHANGED = 'label_changed';
  	this.ANIMATION_FINISHED = 'animation_cycle_finished';
    this.ANIMATION_OBJECT_CHANGED = 'animation_object_changed';

    //loop parameters
    this.INFINITY = 'infinity';

  	//DEBUGGER
  	this.show_debug_buttons = false;
    this.ON_DEBUG = false;

    this.config = config;

    this.$animation_cont = $container;
    this.animation_object = animation;

    //UNCRORRRRRRRRRRRRRRRRRRRRRRECT
    this.animations_list = ['Trener', 'Scarfman'];

    this.initContainer();
  }


  initContainer() {
    //add canvas
    var newCanvas = $('<canvas id="' + this.config.canvas_id + '"></canvas>');
    this.$animation_cont.append(newCanvas);

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

    //add animation
    this.animation_name = this.config.animation_name;

    this.container.addChild(this.animation_object);
    stage.update();

    this.setAnimationParameteres();

		//debug
    this.id = this.config.canvas_id;
		if ( this.config.show_debug ) this.ON_DEBUG = true;
    if (this.ON_DEBUG) this.initDebugButtons();

    //play
    this.playAnimation();

  }

  changeAnimation(new_id) {
    var event = new CustomEvent( this.ANIMATION_OBJECT_CHANGED, { detail: {new_animation_id: new_id, prev_animation_id: this.animation_name, animation: this.animation_object, obj: this}} );
    window.dispatchEvent(event);
    this.animation_name = new_id;
    this.updateLabelSelector(this.animation_name);
    this.updateAnimationSelector(this.animation_name);
  }

  setAnimationParameteres() {
    if ( this.animation_name != this.config.animation_name ) this.changeAnimation(this.config.animation_name);
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
        } else {
          scope.animation_object.tickEnabled = false;
          var event = new CustomEvent( scope.ANIMATION_FINISHED);
          window.dispatchEvent(event);
        }
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

  // >>> DEBUG >>>

  initDebugButtons() {
    var scope = this;
    var $debugger_container = $('<div id="debugger-container-'+ this.id +'"></div>');
    console.log(this.$animation_cont)
    this.$animation_cont.append($debugger_container);

    this.$hidden_content = $('<div id="hidden-content-'+ this.id +'"></div>');
    $debugger_container.append(this.$hidden_content);

    //BUTTONS
    this.debug_buttons = [
      $('<button class="close-able" id="play-'+ this.id +'"> Play </button>'),
      $('<button class="close-able" id="pause-'+ this.id +'"> Pause </button>'),
      $('<button class="close-able" id="resume-'+ this.id +'"> Resume </button>'),
      $('<button class="close-able" id="mirrorX-'+ this.id +'"> Mirror X </button>'),
      $('<button class="close-able" id="mirrorY-'+ this.id +'"> Mirror Y </button>')
    ]

    this.debug_buttons.forEach(function(x) {
      scope.$hidden_content.append(x);
    });

    $('#play-' + this.id).one('click', function() {
      if ( !scope.container ) return;
    });

    $('#pause-' + this.id).on('click', function() {
      if ( !scope.container ) return;
      scope.pauseAnimation();
    });

    $('#resume-' + this.id).on('click', function() {
      if ( !scope.container ) return;
      scope.resumeAnimation();
    });

    $('#mirrorX-' + this.id).on('click', function() {
      if ( !scope.container ) return;
      scope.mirrorX();
    });

    $('#mirrorY-' + this.id).on('click', function() {
      if ( !scope.container ) return;
      scope.mirrorY();
    });

    //ANIMATION SELECTOR 
    var animation_selector = '<select class="close-able" id="animation-selector-'+ this.id +'">';
    this.animations_list.forEach(function(x) {
      animation_selector += '<option>' + x + '</option>';
    })
    animation_selector += '</select>';

    this.$hidden_content.append($(animation_selector));

    this.updateAnimationSelector(this.animation_name);
  
    $('#animation-selector-' + this.id).change( function() {
      if ( !scope.container ) return;
      var selected_label = $(this).val();
      scope.tickEnabled = true;
      scope.changeAnimation(selected_label);
    })


    //ANIMATION LABELS SELECTOR
    var labels = scope.getAnimationLabels();
    
    var labels_selector = '<select class="close-able" id="labels-selector-'+ this.id +'">';
    labels.forEach(function(x) {
      labels_selector += '<option>' + x.label + '</option>';
    })
    labels_selector += '</select>';

    this.$hidden_content.append($(labels_selector));

    $('#labels-selector-' + this.id).change( function() {
      var selected_label = $(this).val();
      scope.tickEnabled = true;
      scope.playFromLabel(selected_label);
    })

    $debugger_container.append($('<button id="close'+ this.id +'"> + </button>'));

    $('#close' + this.id).on('click', function() {
      scope.show_debug_buttons = scope.show_debug_buttons ? false : true;
      if ( scope.show_debug_buttons ) { 
        $(this).text('-');
        scope.showDebugButtons();
      }
      else {
        $(this).text('+');
        scope.hideDebugButtons();
      } 
    });

    if ( !scope.show_debug_buttons ) this.hideDebugButtons(this.id);
  }

  updateLabelSelector() {
    var labels = this.getAnimationLabels();
    var $selector = $('#labels-selector-' + this.id);
    $selector.find('option').remove();
    labels.forEach( function(x) {
      $selector.append($('<option>', { text: x.label}));
    });
  }

  updateAnimationSelector(animation_id) {
    $('#animation-selector-' + this.id + ' option').prop('selected', function() { return $(this).text() == animation_id; });
  }

  showDebugButtons() {
    $('#hidden-content-' + this.id).css({'width': 'auto', 'height': 'auto'});
  }

  hideDebugButtons() {
    $('#hidden-content-' + this.id).css({'width': 0, 'height': 0, 'overflow': 'hidden'});
  }
}
    
