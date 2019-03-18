  // Отрисовка контейнера должна происходить только при работающей анимации
  // Нужен АссетМенеджер для хранения созданных экземплеров анимаций

  //TOOD: устранить урезание анимации
  //TODO: загрузку из data атрибута в отдельную функцию
  //TODO: относительный путь для скриптов
  //Универсальная передача объекта анимации
  //TODO: show debug default
  // где сделать assets manager????
  //TODO: инициализация контроллера без html
  // при дебаге включить tickenabled  и заканчивтаь анимацию при смене лейбла
 $(function(){
   class AnimationHelper {
    constructor() {

      var scope = this;

      //CONSTANTS
      this.CONFIG_FILE = 'config.json';

      //
      this.animations = {};
      this.$containers = $('.animator-container');
      this.$controller = $('.animator-controller');

      //ASSETS MANAGER
      this.AM = new AssetManager(this);

      this.getAssetsConfig();

      //
      $(window).on('assets_loaded', function(e) {
        scope.initAnimationConfig(e.detail.id);
      });

      $(window).on("label_changed", function(e) {
        // console.log( 'Label has been changed from: ' + e.detail.previous_label + ' to: ' + e.detail.current_label );
      });

      $(window).on("animation_cycle_finished", function(e) {
        console.log( 'ANIMATION CYCLE FINISHED' );
      });
              
    }

    getAssetsConfig() {
      var scope = this;
      if( !this.$controller ) return;

      var el_data = this.$controller.data('animator');
      var animations_array = el_data.split(',');

      animations_array.forEach(function(x) {
        $.getJSON( x + scope.CONFIG_FILE, function ( _data ) {
          if( !_data ) return;
          scope.animations[ _data.animation_name ] = new AnimationController( _data );
        })
      })
    }


    initAnimationConfig(id) {
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
          }
          if( id == 'Trener') {
            // scope.AM.addAsset(id , function() {return new lib.Trener}, 3);
            obj.addAnimationObject(container_data, $e, new lib.Trener());
          }
          else if( id == 'Scarfman') obj.addAnimationObject(container_data, $e, new lib.Scarfman());

          scope.initDebugButtons(obj, id, e);
        }
      });
    }

    // >>> DEBUG >>>

    initDebugButtons(animation_obj, obj_id, container) {
      var scope = this;
      var $container = $(container);
      this.$hidden_content = $('<div id="hidden-content-'+ obj_id +'"></div>');
      $container.append(this.$hidden_content);

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

      $('#play-' + obj_id).on('click', function() {
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

      $container.append($('<button id="close'+ obj_id +'"> x </button>'));

      $('#close' + obj_id).on('click', function() {
        animation_obj.debugger_on = animation_obj.debugger_on ? false : true;
        if ( animation_obj.debugger_on ) scope.showDebugButtons(obj_id);
        else scope.hideDebugButtons(obj_id);
      });

      this.hideDebugButtons();
    }

    showDebugButtons(id) {
      $('#hidden-content-' + id).css('display', 'inherit');
    }

    hideDebugButtons(id) {
      $('#hidden-content-' + id).css('display', 'none');
    }
  }

  let animationHelper = new AnimationHelper();

})
  

