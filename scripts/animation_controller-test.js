 $(function(){
  let animationHelper = new AnimationHelper();
  var animations_by_id = {}

  var TRENER = 'Trener';
  var SCARFMAN = 'Scarfman';
  
  var animations_id = [ TRENER, SCARFMAN ]
  //send animation object
  $(window).on('assets_loaded', function(e) {
    var trener_animations = [];
    var scarfman_animations = [];
    for ( var i = 0; i < 10; i++ ) {
      trener_animations.push(new lib.Trener());
      scarfman_animations.push(new lib.Scarfman());
    }
    animations_by_id[TRENER] = trener_animations;
    animations_by_id[SCARFMAN] = scarfman_animations;
    animationHelper.initAnimationsContainers(animations_by_id, animations_id);
  });


 });
