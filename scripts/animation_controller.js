class AnimatorContainer {

  constructor( $container, config ) {
    var scope = this;
  	//CONSTANTS
  	this.LABEL_CHANGED = 'label_changed';
  	this.ANIMATION_FINISHED = 'animation_cycle_finished';
    this.ANIMATION_OBJECT_CHANGED = 'animation_object_changed';

    //loop parameters
    const INFINITY  = this.INFINITY = 'infinity';

    //debug parameters
    this.on_debug = false;

    this.config = config;
    this.animation_name = config.animation_name;
    this.$animation_cont = $container;

    $(window).on("assets_loaded", function(e) {
      scope.animations_list = e.detail.animations_id;
      if ( e.detail.config.animation_name == scope.animation_name ) scope.initContainer(e.detail.config, e.detail.obj);
    });
  }


  initContainer(config, animation) {
    this.config = Object.assign(config, this.config);

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
    this.animation_object = animation;
    this.animation_name = this.config.animation_name;

    this.container.addChild(this.animation_object);
    stage.update();


		//debug
    this.id = this.config.canvas_id;
		if ( this.config.on_debug ) {
      this.on_debug = true;
      this.initDebugButtons();
    }
    else {
      this.setAnimationParameteres();
      //play
      this.playAnimation();
    }

  }

  changeAnimation(new_id) {
    var event = new CustomEvent( this.ANIMATION_OBJECT_CHANGED, { detail: {new_animation_id: new_id, prev_animation_id: this.animation_name, animation: this.animation_object, obj: this}} );
    window.dispatchEvent(event);
    this.animation_name = new_id;
    this.updateLabelSelector(this.animation_name);
    this.updateAnimationSelector(this.animation_name);
    this.stage.update();
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
 		if ( this.config.loop ) this.loop_amount = this.config.loop || 1;

 		//labels
    var labels = this.animation_object.labels;

 		this.label_start = this.config.label_start || labels[0].label;
 		this.label_end = this.config.label_end || labels[labels.length - 1].label;

  	this.playFromLabel(this.label_start);
  }

  changeAnimationObject(new_obj) {
    this.container.removeChild(this.animation_object);
    this.container.addChild(new_obj);
    this.animation_object = new_obj;
  }

  playAnimation() {
  	var scope = this;
  	this.FPS = this.config.fps || 25;
    var stop_animation_on_next_step = false;
  	var current_label;
  	createjs.Ticker.setFPS(this.FPS)
		createjs.Ticker.addEventListener('tick', tick_stage);
    function tick_stage() {
      scope.stage.update();
      //label changed
      if ( current_label != scope.animation_object.currentLabel) {
        var event = new CustomEvent( scope.LABEL_CHANGED, { detail: {previous_label: current_label, current_label: scope.animation_object.currentLabel}} );
        window.dispatchEvent(event);
        current_label = scope.animation_object.currentLabel;

        if ( stop_animation_on_next_step ) {
          if (typeof scope.loop_amount === 'number') scope.loop_amount--;
            if ( scope.loop_amount <= 0 ) {
              if ( scope.config.onfinish && !scope.on_debug ) {
                  scope.config = scope.config.onfinish;
                  scope.setAnimationParameteres();
              }
            } else scope.playFromLabel(scope.label_start);
          if ( scope.loop_amount <= 0 && (!scope.config.onfinish || scope.on_debug)) {
            scope.playFromLabel(scope.label_start);
            scope.animation_object.tickEnabled = false;
            var event = new CustomEvent( scope.ANIMATION_FINISHED);
            window.dispatchEvent(event);
          }
          stop_animation_on_next_step = false;
        }

      if (current_label == scope.label_end) stop_animation_on_next_step = true;
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

  playFromLabel(label) {
  	this.animation_object.gotoAndPlay(label);
  }

  // >>> DEBUG >>>
  initDebugButtons() {
    var scope = this;
    var $debugger_container = $('<div class="debugger-container" id="debugger-container-'+ this.id +'"></div>');
    this.$animation_cont.prepend($debugger_container);

    //CLOSE BUTTON
    $debugger_container.append($('<button class="close-btn" id="close'+ this.id +'">+</button>'));

    $('#close' + this.id).on('click', function() {
      $(this).text( $(this).text() == '+' ? '-' : '+' );
      $('#hidden-able-content-' + scope.id).toggleClass('hidden-able-content_hide', $(this).text() == '-')
    });

    //CONTAINER FOR ELEMENTS WHICH CAN BE HIDDEN
    var $hidden_able_content = $('<div class="hidden-able-content" id="hidden-able-content-'+ this.id +'"></div>');
    $debugger_container.append($hidden_able_content);

    //ANIMATION SELECTOR 
    var animation_selector = '<select class="close-able" id="animation-selector-'+ this.id +'">';
    this.animations_list.forEach(function(x) {
      animation_selector += '<option>' + x + '</option>';
    })
    animation_selector += '</select>';

    $hidden_able_content.append($(animation_selector));

    this.updateAnimationSelector(this.animation_name);
  
    $('#animation-selector-' + this.id).change( function() {
      scope.changeAnimation($(this).val());
    })

    //START LABELS SELECTOR
    $hidden_able_content.append($('<select class="close-able" id="start-labels-selector-'+ this.id+'"></select>'));

    $('#start-labels-selector-' + this.id).change( function() {
      scope.label_start = $(this).val();
      scope.playFromLabel(scope.label_start);
    })

    //FINISH LABELS SELECTOR
    $hidden_able_content.append($('<select class="close-able" id="finish-labels-selector-'+ this.id+'"></select>'));
    $('#finish-labels-selector-' + this.id).change( function() {
      scope.label_end = $(this).val();
    })

    this.updateLabelSelector();

    //LOOP SELECTOR 
    var selector = '<select class="close-able" id="loop-selector-'+ this.id +'">';
    for (var i = 0; i < 6; i++) {
      if ( i == 0 ) selector += '<option>' + scope.INFINITY + '</option>';
      else selector += '<option>' + i + '</option>';
    }
    selector += '</select>';

    $hidden_able_content.append($(selector));
    $('#loop-selector-' + this.id).change( function() {
      scope.loop_amount = +$(this).val();
    })
    this.loop_amount = $('#loop-selector-' + this.id + ' option:selected').text();

    //BUTTONS
    this.debug_buttons = [
      $('<button class="close-able" id="play-'+ this.id +'">play</button>'),
      $('<button class="close-able" id="mirrorX-'+ this.id +'"> Mirror X </button>'),
      $('<button class="close-able" id="mirrorY-'+ this.id +'"> Mirror Y </button>')
    ]

    this.debug_buttons.forEach(function(x) {
      $hidden_able_content.append(x);
    });

    $('#play-' + this.id).on('click', function() {
      if ($(this).text() == 'play') scope.playAnimation();
      if ($(this).text() == 'resume') scope.resumeAnimation();
      if ($(this).text() == 'pause') scope.pauseAnimation();
      $(this).text( $(this).text() == 'play' ? 'pause' : $(this).text() == 'pause' ? 'resume' : 'pause' );
    });

    $('#mirrorX-' + this.id).on('click', function() {
      if ( !scope.container ) return;
      scope.mirrorX();
    });

    $('#mirrorY-' + this.id).on('click', function() {
      if ( !scope.container ) return;
      scope.mirrorY();
    });
    console.log(this)
  }

  updateLabelSelector() {
    var labels = this.getAnimationLabels();
    updateSelector($('#start-labels-selector-' + this.id));
    updateSelector($('#finish-labels-selector-' + this.id));

    function updateSelector($selector) {
      $selector.find('option').remove();
      labels.forEach( function(x) {
        $selector.append($('<option>', { text: x.label}));
      });
    }
    $('#finish-labels-selector-' + this.id + ' option').prop('selected', function() { return $(this).text() == labels[labels.length - 1].label; });
    this.label_start = $('#start-labels-selector-' + this.id + ' option:selected').text();
    this.label_end = $('#finish-labels-selector-' + this.id + ' option:selected').text();
  }

  updateAnimationSelector(animation_id) {
    $('#animation-selector-' + this.id + ' option').prop('selected', function() { return $(this).text() == animation_id; });
  }
}
    
