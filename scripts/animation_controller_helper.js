  //TODO: инициализация контроллера без html
   class AnimationHelper {
    constructor() {

      var scope = this;

      //CONSTANTS
      this.CONFIG_FILE = 'config.json';

      //animation objects
      this.containers = {};

      this.animations_set = new Set();
      
      //ASSETS MANAGER
      this.AM = new AssetManager(this);
      
      this.getAssetsConfig();

      $(window).on("animation_object_changed", function(e) {
        var new_animation_name = e.detail.new_animation_id;
        var obj = e.detail.obj;
        var animation = e.detail.animation;
        scope.updateAnimationObject(new_animation_name, animation, obj);
      });
    }

    updateAnimationObject(new_id, animation, obj) {
      var new_animation = this.AM.pullAsset( new_id );
      this.AM.putAsset( animation );
      obj.changeAnimationObject( new_animation );
    }

    getAssetsConfig() {
      var scope = this;
      $(function(){
        scope.$containers = $('.animator-container');
        scope.$controller = $('.animator-controller');

        if( !scope.$controller ) {
          scope.$controller = $('<div class="animator-controller"></div>')
        }

        var el_data = scope.$controller.data('animator');
        var containers_array = el_data.split(',');
        if ( containers_array )
        {
          containers_array.forEach(function(x) {
            $.getJSON( x + scope.CONFIG_FILE, function ( _data ) {
              if( !_data ) return;
              scope.containers[ _data.animation_name ] = new AnimationController( _data );
            })
          })  
        }
     });
    }


    initAnimationConfig(id, animations) {
      var scope = this;
      if ( !this.$containers ) return;
      var animation_obj;
      this.$containers.each(function(i,e) {
        var $e = $(e);
        var container_data = $e.data('animator');
        var animation_name = container_data.animation_name;
        //adding animation name for selector
        scope.animations_set.add(animation_name);
        if ( id == animation_name ) {
          animation_obj = scope.containers[animation_name];
          scope.containers[animation_name] = {
            config: container_data,
            animation_object: animation_obj,
            $container_element: $e
          };
          animations.forEach(function(x) {
            scope.AM.addAsset( id , function() { return x; }, 1);
          })
          animation_obj.addAnimationObject(container_data, scope.AM.pullAsset( id ), $e, scope.animations_set);
        }
      });
    } 
  }
