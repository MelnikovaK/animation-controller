  //TODO: инициализация контроллера без html
  // Отрисовка контейнера должна происходить только при работающей анимации
  // Нужен АссетМенеджер для хранения созданных экземплеров анимаций

  //TODO: загрузку из data атрибута в отдельную функцию
  //TODO: относительный путь для скриптов
 $(function(){
   class AnimationHelper {
    constructor() {

      var scope = this;

      //CONSTANTS
      this.CONFIG_FILE = 'config.json';

      //
      this.animations = {};


      this.getAssetsConfig();

      //
      $(window).on('assets_loaded', function() {
        scope.getAnimationConfig();
        console.log('assets_loaded');
      });
    }

    getAssetsConfig() {
      var scope = this;
 
      var $element = $('.animator-controller');
      if( !$element ) return;

      var el_data = $element.data('animator');
      console.log($element)
      var animations_array = el_data.split(',');
      // el_data = JSON.parse( el_data );

      animations_array.forEach(function(x) {
        $.getJSON( x + scope.CONFIG_FILE, function ( _data ) {
          if( !_data ) return;
          _data = Object.assign( _data, el_data );
          scope.animations[ _data.animation_name ] = new AnimationController( _data );
        });
      });
    }

    //по id сопоставлять анимации
    getAnimationConfig() {
      var scope = this;
      var $containers = $('.animator-container');
      $containers.each(function(i,e) {
        var $e = $(e);
        var container_data = $e.data('animator');
        var animation_object = scope.animations[container_data.animation_name];
        animation_object.addAnimationObject(container_data, $e)
      });
    }
  }

  let animationHelper = new AnimationHelper();

})
  

