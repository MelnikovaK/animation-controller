  //TODO: инициализация контроллера без html
  // Отрисовка контейнера должна происходить только при работающей анимации
  // Нужен АссетМенеджер для хранения созданных экземплеров анимаций

  //TODO: json parse
 $(function(){
   class AnimationHelper {
    constructor() {
      //CONSTANTS
      this.CONFIG_FILE = 'config.json';

      this.startAnimationLoading();

      //
      $(window).on('assets_loaded', function() {
        console.log('assets_loaded');
      });
    }

    startAnimationLoading() {
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
          new AnimationController( _data );
        });
      }); 
    }
   }

  let animationHelper = new AnimationHelper();

})
  

