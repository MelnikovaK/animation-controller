 $(function(){
  let animationHelper = new AnimationHelper();

  var animations_by_id = {};
  
  //send animation object
  $(window).on('assets_loaded', function(e) {
    animations_by_id['Trener'] = new lib.Trener();
    animations_by_id['Scarfman'] = new lib.Scarfman();
    console.log(animations_by_id[e.detail.id]);
    animationHelper.initAnimationConfig(e.detail.id, animations_by_id[e.detail.id]);
  });
 });
