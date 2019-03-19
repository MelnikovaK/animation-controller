 $(function(){
  let animationHelper = new AnimationHelper();

  var animations_by_id = {};

  //передавать несколько анимаций
  
  //send animation object
  $(window).on('assets_loaded', function(e) {
    var animations = [];
    animations_by_id['Trener'] = new lib.Trener();
    animations_by_id['Scarfman'] = new lib.Scarfman();
    var id = e.detail.id;
    for (var i = 0; i < 10; i++) {
      if ( id == "Trener") animations.push(new lib.Trener());
      else animations.push(new lib.Scarfman());
    }
    animationHelper.initAnimationConfig(id,animations);
  });
 });
