//TODO: инициализация контроллера без html
//TODO: передача массива со списком загруженных анимаций
//!!!не заводить массивы контейнеров а обеспечить работу с ними через события
  $(function(){
    //controller
    var $controller = $('.animator-controller');
    if( !$controller.length ) return;

    var el_data = $controller.data('animator');
    var animations_array = el_data && el_data.split(',');   
    if( !animations_array || !animations_array.length ) {
      console.warn('Animator: animations data required.');
      return;
    }
    var animatorController = new AnimatorController();
    var path = 'config.json';
    animatorController.loadConfig( animations_array, path );
  });
    

class AnimatorController {
  constructor() {
    var scope = this;   
    
    //ASSETS MANAGER
    this.AM = new AssetManager(this);

    $(window).on("animation_object_changed", function(e) {
      var obj = e.detail.obj;
      var new_animation = scope.AM.pullAsset( e.detail.new_animation_id );
      scope.AM.putAsset( e.detail.animation );
      obj.changeAnimationObject( new_animation );
    });
  }

  loadConfig( configs, path ){
    var scope = this;

    configs.forEach(function(x, i) {
        $.getJSON( x + path, function ( _data ) {
          if( !_data ) return;
          scope.preloadAssets( _data, configs.length - i - 1)
        })
      });  
    }


  preloadAssets(animation_config, assets_rem) {
    var scope = this;
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", handleFileLoad);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(animation_config.manifest);

    function handleFileLoad(evt) {
      if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
    }

    function handleComplete() {
      var $containers = $('.animator-container');

      $containers.each( function(i, e) {
        var container_config = $(e).data('animator');
        if ( container_config.animation_name == animation_config.animation_name ) {
          var config = Object.assign( animation_config, container_config );
          scope.AM.addAsset(animation_config.animation_name, function(){ return new lib[animation_config.animation_name]();}, 10)
          new AnimatorContainer(config, scope.AM.pullAsset(config.animation_name), $(e));
        }
      });
    }   
  }
}
