var options = {
	width: '500px',
	height: '500px',
	iAnimate: 1
};

var clock = new Anclock("myclock", options);

/* working code */
/*var el = document.getElementById("stopclock");
el.addEventListener("click", function(e) {
		clock;
        clock.stopClock();
    }, false);*/

clock.stopClock("stopclock");
clock.startClock("startclock");


