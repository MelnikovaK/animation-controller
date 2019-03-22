//TODO: инициализация контроллера без html
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
    var $containers = $('.animator-container');
    $containers.each( function(i,e) {
      var container_data = $(e).data('animator');
      animatorController.createContainer($(e), container_data);
    });

    animatorController.loadConfig( animations_array, path );
  });
    

class AnimatorController {
  constructor() {
    var scope = this;   

    const ASSETS_LOADED = this.ASSETS_LOADED = 'assets_loaded';

    this.animations_id = new Set();

    this.configs = [];
    
    //ASSETS MANAGER
    this.AM = new AssetManager(this);

    $(window).on("animation_object_changed", function(e) {
      var obj = e.detail.obj;
      var new_animation = scope.AM.pullAsset( e.detail.new_animation_id );
      scope.AM.putAsset( e.detail.animation );
      obj.changeAnimationObject( new_animation );
    });
  }

  createContainer( $element, config) {
    new AnimatorContainer( $element, config );
  }

  loadConfig( configs, path ){
    var scope = this;
    configs.forEach(function(x, i) {
      $.getJSON( x + path, function ( _data ) {
        if( !_data ) return;
        scope.animations_id.add(_data.animation_name);
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
      scope.AM.addAsset(animation_config.animation_name, function(){ return new lib[animation_config.animation_name]();}, 10)
      var event = new CustomEvent( scope.ASSETS_LOADED, { detail: {config: animation_config, obj: scope.AM.pullAsset(animation_config.animation_name), animations_id: scope.animations_id}});
      window.dispatchEvent(event);
    }   
  }
}
