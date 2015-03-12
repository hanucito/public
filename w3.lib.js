// Loader de Scripts
var studiolib = new Object();
    studiolib.Path = "http://w3pc0007.trulala.w3.com.ar/@/js/";
    studiolib.count = 0;
    studiolib.Load = function (library) {
	this.count += 1;
	var s = document.createElement("script");
	//s.src = studiolib.Path + "script.php?src=" + library;
	s.src = studiolib.Path + library +".js";
	document.documentElement.insertBefore(s, document.documentElement.firstElementChild);
	s.onload = function () {
		studiolib.count -= 1;
		if (studiolib.count == 0 && studiolib.onload) {
			studiolib.onload();
		}
	}
}