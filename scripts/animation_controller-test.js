var animation_config = {  
  width: 1,
  height: 1,
  scale: 1,
  path: 'assets/',
  manifest: [
    {src:"images/Tr_1_head.png", id:"Tr_1_head"},
    {src:"images/Tr_1_head_closed.png", id:"Tr_1_head_closed"},
    {src:"images/Tr_1_rukav.png", id:"Tr_1_rukav"},
    {src:"images/Tr_1_tors.png", id:"Tr_1_tors"},
    {src:"images/Tr_C_Hand_1.png", id:"Tr_C_Hand_1"},
    {src:"images/Tr_C_hand_2.png", id:"Tr_C_hand_2"},
    {src:"images/Tr_C_hand_3.png", id:"Tr_C_hand_3"},
    {src:"images/Tr_C_head.png", id:"Tr_C_head"},
    {src:"images/Tr_C_tors.png", id:"Tr_C_tors"},
    {src:"images/Tr_S_hand_1.png", id:"Tr_S_hand_1"},
    {src:"images/Tr_S_hand_2.png", id:"Tr_S_hand_2"},
    {src:"images/Tr_S_Hand_3.png", id:"Tr_S_Hand_3"},
    {src:"images/Tr_S_hand_s.png", id:"Tr_S_hand_s"},
    {src:"images/Tr_S_head.png", id:"Tr_S_head"},
    {src:"images/Tr_S_tors.png", id:"Tr_S_tors"},
    {src:"images/Tr_Z_hand_1.png", id:"Tr_Z_hand_1"},
    {src:"images/Tr_Z_hand_2.png", id:"Tr_Z_hand_2"},
    {src:"images/Tr_Z_hand_3.png", id:"Tr_Z_hand_3"},
    {src:"images/Tr_Z_head.png", id:"Tr_Z_head"},
    {src:"images/Tr_Z_tors.png", id:"Tr_Z_tors"}
  ],
  animation_file: "trener.js"
};

//
var newScript = document.createElement("script");
newScript.type = "text/javascript";
newScript.src = animation_config.path + animation_config.animation_file;
var body = document.getElementsByTagName("body")[0];
body.appendChild(newScript);

//create canvas for animation
var canvas = document.createElement('canvas');
canvas.id = "animationCanvas";
canvas.width = 900;
canvas.height = 900;
body.appendChild(canvas);


//add animation object
// animation_config.animation_object = new lib.trener();

//create animation controller
let animationController = new AnimationController( animation_config, canvas.id );
var timestamp = 0;


// animationController.createAnimationObject();
// animationController.playAnimation(timestamp);
// animationController.pauseAnimation();
// animationController.resumeAnimation();
// animationController.removeObject();

