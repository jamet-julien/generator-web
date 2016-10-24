(function(){

var oMediaQuery,oTimeline, oOption = {

    breakpoint_mode : true,

    breakpoint : [
                  "300x250",
                  "728x90",
                  "300x600",
                  "320x50",/** **/
                  "160x600",
                  "600x600",
                  "1:1",
                  "16:9",
                  "640x100",
                  "16:10",
                  "5:3",
                  "4:3",
                  "9:16",
                  "10:16",
                  "3:5",
                  "3:4",/** **/
                  "3:2",
                  "2:3",
                  "1:2",
                  "1:3",
                  "2:1",
                  "3:1",
                  "1024x1024",
                  "320x320",
                  "300x50",
                  "468x60",
                  "600x100",
                  "900x150",
                  "970x90",
                  "120x600",
                  "970x250",
                  "970x415"
                ]
  },

  animations = [
      {
          delay    : 500,
          step     : "step-0",
          selector : '.w--main'
      }
  ];

  oMediaQuery = new MediaQuery( oOption);

  oTimeline   = Timeline( animations);
  oTimeline.run();


  window.onresize = function(){

    oMediaQuery.run();
  };

})();
