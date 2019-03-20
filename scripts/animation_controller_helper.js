//TODO: инициализация контроллера без html
/*
  если нет контроллера то мы его создаем сами 
*/
class AnimationHelper {
  constructor() {
    var scope = this;

    //CONSTANTS
    this.ASSETS_LOADED = 'assets_loaded';
    this.CONFIG_FILE = 'config.json';

    //data
    this.data = {};
    
    //ASSETS MANAGER
    this.AM = new AssetManager(this);
    
    this.initContainersConfig();

    $(window).on("animation_object_changed", function(e) {
      var obj = e.detail.obj;
      var new_animation = scope.AM.pullAsset( e.detail.new_animation_id );
      scope.AM.putAsset( e.detail.animation );
      obj.changeAnimationObject( new_animation );
    });
  }

  initContainersConfig() {
    var scope = this;
    $(function(){
      scope.$containers = $('.animator-container');
      scope.$controller = $('.animator-controller');

      if( !scope.$controller.length ) {
        var animations_array = [];
        scope.$controller = $('<div class="animator-controller"></div>')
        scope.$containers.each(function(i, e) {
          scope.$controller.wrapAll($(e));
          // animations_array.push($(e).data('animator').config);
        })
      } else {
        var el_data = scope.$controller.data('animator');
        var animations_array = el_data.split(',');   
      }

      scope.getAssetsConfig(animations_array);
    });
  }

  getAssetsConfig(animations_array) {
    var scope = this;
    if ( animations_array ) {
      animations_array.forEach(function(x, i) {
        $.getJSON( x + scope.CONFIG_FILE, function ( _data ) {
          if( !_data ) return;
          scope.data[ _data.animation_name ] = scope.data;
          scope.preloadAssets(_data, animations_array.length - i - 1)
        })
      })  
    }
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
      if ( assets_rem == 0 ) {
        var event = new CustomEvent( scope.ASSETS_LOADED, { detail: {id: animation_config.animation_name}});
        window.dispatchEvent(event);
      }
    }   
  }

  initAnimationsContainers(animations_by_id, ids) {
    var scope = this;
    this.$containers.each(function(i,e) {
      var container_data = $(e).data('animator');
      var animation_name = container_data.animation_name;

      var animation_controller = new AnimationController(scope.data[animation_name]);

      animations_by_id[animation_name].forEach(function(x) {
        scope.AM.addAsset( animation_name , function() { return x; }, 1);
      })

      animation_controller.addAnimationObject(container_data, scope.AM.pullAsset( animation_name ), $(e), ids);
    })
  }
}
