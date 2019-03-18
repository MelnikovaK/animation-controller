
let animationHelper = new AnimationHelper();

// //create canvas for animation
// var canvas = document.createElement('canvas');
// var context = canvas.getContext('2d');
// canvas.id = "animationCanvas";
// canvas.width = 324;
// canvas.height = 315;
// var body = document.getElementsByTagName("body")[0];
// body.appendChild(canvas);

// //create animation controller
// let animationController = new AnimationController( animation_config, canvas.id );
// var animation_labels;


// //create animation object
// window.addEventListener("assets_loaded", function() {
//   var animation_object = new lib.Trener();
//   animationController.addAnimationObject(animation_object)
// });


// window.addEventListener("label_changed", function(e) {
//   console.log( 'Label has been changed from: ' + e.detail.previous_label + ' to: ' + e.detail.current_label );
// });

// window.addEventListener("animation_cycle_finished", function(e) {
//   console.log( 'ANIMATION CYCLE FINISHED' );
// });
        

// var play_button = document.getElementsByClassName('Play')[0];
// var pause_button = document.getElementsByClassName('Pause')[0];
// var resume_button = document.getElementsByClassName('Resume')[0];
// var remove_button = document.getElementsByClassName('Remove')[0];
// var add_button = document.getElementsByClassName('Add')[0];
// var mirrorX_button = document.getElementsByClassName('mirrorX')[0];
// var mirrorY_button = document.getElementsByClassName('mirrorY')[0];
// var goClock_button = document.getElementsByClassName('goClocks')[0];
// var goYaw_button = document.getElementsByClassName('goYawning')[0];

// play_button.addEventListener('click', function() {
//   animation_labels = animationController.getAnimationLabels();
//   animationController.playAnimation()});
// pause_button.addEventListener('click', function() {
//   animationController.pauseAnimation()});
// resume_button.addEventListener('click', function() {
//   animationController.resumeAnimation()});
// remove_button.addEventListener('click', function() {
//   animationController.removeAnimationObject()});
// add_button.addEventListener('click', function() {
//   animationController.addAnimationObject(new lib.Trener())});
// mirrorX_button.addEventListener('click', function() {
//    animationController.mirrorX();
// });
// mirrorY_button.addEventListener('click', function() {
//    animationController.mirrorY();
// });

// goClock_button.addEventListener('click', function() {
//   animationController.playFromLabel(animation_labels[1])});
// goYaw_button.addEventListener('click', function() {
//   animationController.playFromLabel(animation_labels[4])});
