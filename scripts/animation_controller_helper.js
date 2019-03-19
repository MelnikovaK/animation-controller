  // Отрисовка контейнера должна происходить только при работающей анимации  +
  // Нужен АссетМенеджер для хранения созданных экземплеров анимаций  +


  //TODO: инициализация контроллера без html
   class AnimationHelper {
    constructor() {

      var scope = this;

      //CONSTANTS
      this.CONFIG_FILE = 'config.json';

      //animation objects
      this.animations = {};

      //ASSETS MANAGER
      this.AM = new AssetManager(this);
      
      this.getAssetsConfig();

      $(window).on("label_changed", function(e) {
      });

      $(window).on("animation_cycle_finished", function(e) {
      });

      $(window).on("animation_object_changed", function(e) {
        var new_id = e.detail.new_animation_id;
        var new_animation = scope.AM.pullAsset( new_id );
        scope.AM.pullAsset( e.detail.obj );
        scope.animations[e.detail.prev_animation_id].object.changeAnimationObject( new_animation );
      });
              
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
        var animations_array = el_data.split(',');

        animations_array.forEach(function(x) {
          $.getJSON( x + scope.CONFIG_FILE, function ( _data ) {
            if( !_data ) return;
            scope.animations[ _data.animation_name ] = new AnimationController( _data );
          })
        })
     });
    }


    initAnimationConfig(id, animation_obj) {
      var scope = this;
      if ( !this.$containers ) return;
      this.$containers.each(function(i,e) {
        var obj;
        var $e = $(e);
        var container_data = $e.data('animator');
        var animation_name = container_data.animation_name;
        if ( id == animation_name ) {
          obj = scope.animations[animation_name];
          scope.animations[animation_name] = {
            config: container_data,
            object: obj
          };
          scope.AM.addAsset( id , function() { 
            return animation_obj;
          }, 10);

          obj.addAnimationObject(container_data, scope.AM.pullAsset( id ));
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
        $('<button class="close-able" id="mirrorY-'+ obj_id +'"> Mirror Y </button>'),
        $('<button class="close-able" id="remove-'+ obj_id +'"> Remove </button>')
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

      $('#remove-' + obj_id).on('click', function() {
        scope.AM.putAsset(animation_obj);
        animation_obj.removeAnimationObject();
      });


      //SELECTOR
      var labels = animation_obj.getAnimationLabels();
      
      var labels_selector = '<select class="close-able" id="labels-selector-'+ obj_id +'">';
      labels.forEach(function(x) {
        labels_selector += '<option>' + x.label + '</option>';
      })
      labels_selector += '</select>';

      this.$hidden_content.append($(labels_selector));

      $('#labels-selector-' + obj_id).change( function() {
        var selected_label = $(this).val();
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

    showDebugButtons(id) {
      $('#hidden-content-' + id).css({'width': 'auto', 'height': 'auto'});
    }

    hideDebugButtons(id) {
      $('#hidden-content-' + id).css({'width': 0, 'height': 0, 'overflow': 'hidden'});
    }
  }


  

