var ARDUINO_URL = "file:///Users/arn/Projects/AGETIC%20FIPAZ/fake_status.json";
var buttonStatus = {};

window.onload = function () {
	var tags = [ // all the videos
		"choza","llama","piedras","quipus",
		"aretes","chunho","costales","pato",
		"tintero","herradura","monedas","rieles",
		"parabolica","nubes"];

	var vids = document.getElementById("vids");

	// first create all video tag widgets	
	for(var i=0;i<tags.length;i++) {
		// build main tag widget
		var divWidget = document.createElement("div");
		divWidget.classList.add("vid-widget");
		if(tags[i]=="nubes")
			divWidget.classList.add("play");
		divWidget.id = tags[i];

		// build static image tag
		var divBg = document.createElement("div");
		divBg.classList.add("static-image");
		divBg.setAttribute("style","background-image:url('vid/"+tags[i]+".png');");
		divWidget.appendChild(divBg);

		// build video tag
		var tagVideo = document.createElement("video");
		tagVideo.innerHTML = '<source src="vid/'+tags[i]+'.webm" type="video/webm">';

		if(tags[i]=="nubes"){
			tagVideo.setAttribute("autoplay","");
		} else {
			tagVideo.addEventListener('ended',function(e){
				this.parentNode.classList.remove("play");
				fakeStatus[this.parentNode.id] = false;
			},false);	
		}

		divWidget.appendChild(tagVideo);

		vids.appendChild(divWidget);
	}

	BuildFakeButtons(tags);

	setInterval(UpdateArduinoStatus, 200);
}

function ClickFakeArduino(sender, parm)
{
	fakeStatus[parm] = true;

}

var requesting = false;
function UpdateArduinoStatus()
{
	if(requesting===true)
		return;

	requesting = true;
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE){
			if(req.status === 200) {
				buttonStatus = JSON.parse(req.responseText);
				console.log(buttonStatus);
				requesting = false;

				for(var key in status) {
					if(status[key]===true) {
						var video = document.querySelectorAll("#vids .vid-widget#"+key)[0];
						video.classList.add("play");
						video.querySelector("video").play(); // reproduce		
					}
				}
			}
		}
	};

	req.open("GET", ARDUINO_URL, true);
	req.send();
}

function BuildFakeButtons(tags)
{
	var container = document.querySelector("#fake_buttons");
	for(var i=0;i<tags.length;i++) {
		if(tags[i]=="nubes")  // not allowed
			continue;
		var btn = document.createElement("div");
		btn.classList.add("btn");
		btn.id = "btn_" + tags[i];
		btn.setAttribute("onclick",'ClickFakeArduino(this,"'+tags[i]+'")');
		btn.innerHTML = tags[i];

		container.appendChild(btn);
	}
}