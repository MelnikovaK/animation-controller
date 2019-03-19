  // Отрисовка контейнера должна происходить только при работающей анимации  +
  // Нужен АссетМенеджер для хранения созданных экземплеров анимаций  +


  //TODO: инициализация контроллера без html
   class AnimationHelper {
    constructor() {

      var scope = this;

      //CONSTANTS
      this.CONFIG_FILE = 'config.json';

      //animation objects
      this.containers = {};
      this.animations_id = [];

      //ASSETS MANAGER
      this.AM = new AssetManager(this);
      
      this.getAssetsConfig();

      $(window).on("label_changed", function(e) {
      });

      $(window).on("animation_cycle_finished", function(e) {
      });

      $(window).on("animation_object_changed", function(e) {
        var new_id = e.detail.new_animation_id;
        var prev_id = e.detail.prev_animation_id;
        var animation_obj = scope.containers[prev_id].animation_object;
        var animation = e.detail.animation;
        scope.updateAnimationObject(new_id, prev_id, animation, animation_obj);
      });
    }

    //как начать отрисовку кнопок после заполнения массива

    updateAnimationObject(new_id, prev_id, animation, obj) {
      var new_animation = this.AM.pullAsset( new_id );
      this.AM.pullAsset( animation );
      obj.animation_name = new_id;
      obj.changeAnimationObject( new_animation );
      this.updateLabelSelector(prev_id, obj);
      this.updateAnimationSelector(new_id, prev_id);
    }

    getAssetsConfig() {
      var scope = this;
      $(function(){
        scope.$containers = $('.animator-container');
        scope.$controller = $('.animator-controller');

        if( !scope.$controller ) {
          scope.$container = $('<div class="animator-controller"></div>')
        }

        var el_data = scope.$controller.data('animator');
        var containers_array = el_data.split(',');

        containers_array.forEach(function(x) {
          $.getJSON( x + scope.CONFIG_FILE, function ( _data ) {
            if( !_data ) return;
            scope.containers[ _data.animation_name ] = new AnimationController( _data );
          })
        })
     });
    }


    initAnimationConfig(id, animations) {
      var scope = this;
      var assets_count = animations.length;
      if ( !this.$containers ) return;
      this.$containers.each(function(i,e) {
        var obj;
        var $e = $(e);
        var container_data = $e.data('animator');
        var animation_name = container_data.animation_name;
        if ( id == animation_name ) {
          obj = scope.containers[animation_name];
          scope.containers[animation_name] = {
            config: container_data,
            animation_object: obj
          };
          animations.forEach(function(x) {
            scope.AM.addAsset( id , function() { 
              return x;
            }, assets_count);

          })

          obj.addAnimationObject(container_data, scope.AM.pullAsset( id ));
          scope.animations_id.push(id);
          if (obj.ON_DEBUG) scope.initDebugButtons(obj, id, $e);
        }
      });
    }

    // >>> DEBUG >>>
    initDebugButtons(animation_obj, obj_id, $container) {
      var scope = this;
      var $debugger_container = $('<div id="debugger-container-'+ obj_id +'"></div>');
      $container.append($debugger_container);
      this.$hidden_content = $('<div id="hidden-content-'+ obj_id +'"></div>');
      $debugger_container.append(this.$hidden_content);

      //BUTTONS
      this.debug_buttons = [
        $('<button class="close-able" id="play-'+ obj_id +'"> Play </button>'),
        $('<button class="close-able" id="pause-'+ obj_id +'"> Pause </button>'),
        $('<button class="close-able" id="resume-'+ obj_id +'"> Resume </button>'),
        $('<button class="close-able" id="mirrorX-'+ obj_id +'"> Mirror X </button>'),
        $('<button class="close-able" id="mirrorY-'+ obj_id +'"> Mirror Y </button>')
      ]

      this.debug_buttons.forEach(function(x) {
        scope.$hidden_content.append(x);
      });

      $('#play-' + obj_id).one('click', function() {
        animation_obj.addAnimationToScreen($container);
        animation_obj.playAnimation();
      });

      $('#pause-' + obj_id).on('click', function() {
        animation_obj.pauseAnimation();
      });

      $('#resume-' + obj_id).on('click', function() {
        animation_obj.resumeAnimation();
      });

      $('#mirrorX-' + obj_id).on('click', function() {
        animation_obj.mirrorX();
      });

      $('#mirrorY-' + obj_id).on('click', function() {
        animation_obj.mirrorY();
      });

      //ANIMATION SELECTOR 
      var animation_selector = '<select class="close-able" id="animation-selector-'+ obj_id +'">';
      this.animations_id.forEach(function(x) {
        animation_selector += '<option>' + x + '</option>';
      })
      animation_selector += '</select>';

      this.$hidden_content.append($(animation_selector));

      this.updateAnimationSelector(obj_id, obj_id);
    
      $('#animation-selector-' + obj_id).change( function() {
        var selected_label = $(this).val();
        scope.updateAnimationObject(selected_label, obj_id, animation_obj.animation_object, animation_obj);
        animation_obj.tickEnabled = true;
      })

      //ANIMATION LABELS SELECTOR
      var labels = animation_obj.getAnimationLabels();
      
      var labels_selector = '<select class="close-able" id="labels-selector-'+ obj_id +'">';
      labels.forEach(function(x) {
        labels_selector += '<option>' + x.label + '</option>';
      })
      labels_selector += '</select>';

      this.$hidden_content.append($(labels_selector));

      $('#labels-selector-' + obj_id).change( function() {
        var selected_label = $(this).val();
        animation_obj.tickEnabled = true;
        animation_obj.playFromLabel(selected_label);
      })

      $debugger_container.append($('<button id="close'+ obj_id +'"> + </button>'));

      $('#close' + obj_id).on('click', function() {
        animation_obj.show_debug_buttons = animation_obj.show_debug_buttons ? false : true;
        if ( animation_obj.show_debug_buttons ) { 
          $(this).text('-');
          scope.showDebugButtons(obj_id);
        }
        else {
          $(this).text('+');
          scope.hideDebugButtons(obj_id);
        } 
      });

      if ( !animation_obj.show_debug_buttons ) this.hideDebugButtons(obj_id);
    }

    updateLabelSelector(id, obj) {
      var labels = obj.getAnimationLabels();
      var $selector = $('#labels-selector-' + id);
      $selector.find('option').remove();
      labels.forEach( function(x) {
        $selector.append($('<option>', { text: x.label}));
      });
    }

    updateAnimationSelector(animation_id, selector_id) {
      $('#animation-selector-' + selector_id + ' option').prop('selected', function() { return $(this).text() == animation_id; });
    }

    showDebugButtons(id) {
      $('#hidden-content-' + id).css({'width': 'auto', 'height': 'auto'});
    }

    hideDebugButtons(id) {
      $('#hidden-content-' + id).css({'width': 0, 'height': 0, 'overflow': 'hidden'});
    }
  }


  

