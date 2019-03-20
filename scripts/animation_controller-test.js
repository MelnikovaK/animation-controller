 $(function(){
  let animationHelper = new AnimationHelper();

  var animations_by_id = {};
  
  //send animation object
  $(window).on('assets_loaded', function(e) {
    var animations = [];
    var id = e.detail.id;
    for ( var i = 0; i < 10; i++ ) {
      if ( id == 'Trener') animations.push(new lib.Trener());
      if ( id == 'Scarfman') animations.push(new lib.Scarfman());
    }
    animationHelper.initAnimationConfig(id, animations);
  });
 });
