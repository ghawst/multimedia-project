// uneori la salvare se obtine eroarea "failed - network error". aceasta problema pare sa fie legata de chrome si este cauzata de
//faptul ca 'data-URL' devine prea lung. (sursa: https://stackoverflow.com/questions/42958598/failed-network-error-when-trying-to-provide-download-in-html5-using-downloa)

var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");
var fr = new FileReader();
var saveImgBtn = document.getElementById("saveImgButt");
var images= [];
var addedWidth = 0;
var previewHeight = 170;
var previewBorder = 7;
canvas.height = previewHeight + previewBorder * 2;
ctx.font = "30px Arial";
ctx.fillText("Drag and", 5, 40);
ctx.fillText("drop any", 5, 70);
ctx.fillText("number of", 5, 100);
ctx.fillText("images here", 5, 130);
ctx.fillText("(one by one)", 5, 160);

var collageCanvas = document.getElementsByTagName("canvas")[1];
var cCtx = collageCanvas.getContext("2d");
cCtx.beginPath();
cCtx.rect(0, 0, collageCanvas.width, collageCanvas.height);
cCtx.fillStyle = "#808080";
cCtx.fill();
cCtx.font = "30px Arial";
cCtx.fillStyle = "black";
cCtx.fillText("(or here)", 15, 50);

var collageBorder = 15;

var template = 1;

var bColor = "#808080"
var BGImg = new Image();
BGImg.crossOrigin = "anonymous";
var hasBGImg = false;

var rv = 0;
var gv = 0;
var bv = 0;

var pixelsAfterFilters = null;

function getPixels() {
	return cCtx.getImageData(0, 0, collageCanvas.width, collageCanvas.height);
}

function decreaseRed() {
	if(rv >= 10) {
		rv -= 10;
	}
	RGBChange();

	playRGBSound();
}
function addRed() {
	if(rv <= 245) {
		rv += 10;
	}
	RGBChange();

	playRGBSound();
}
function decreaseGreen() {
	if(gv >= 10) {
		gv -= 10;
	}
	RGBChange();

	playRGBSound();
}
function addGreen() {
	if(gv <= 245) {
		gv += 10;
	}
	RGBChange();

	playRGBSound();
}
function decreaseBlue() {
	if(bv >= 10) {
		bv -= 10;
	}
	RGBChange();

	playRGBSound();
}
function addBlue() {
	if(bv <= 245) {
		bv += 10;
	}
	RGBChange();

	playRGBSound();
}

function playRGBSound() {
  var audio = new Audio("media/shortboop.mp3");
  audio.play();
}

function RGBChange() {
	drawCollage(true, true);
	var pixels = getPixels();
	var pixelsData = pixels.data;
	for (var y = 0; y < collageCanvas.height; y++) {
		for (var x = 0; x < collageCanvas.width; x++) {
			var i = (y * collageCanvas.width * 4) + x * 4;
      pixelsData[i] += rv;
      pixelsData[i + 1] += gv;
      pixelsData[i + 2] += bv;
		}
	}
	cCtx.putImageData(pixels, 0, 0);
}

function resetColors() {
	rv = 0;
	gv = 0;
	bv = 0;
}

var convolution = {
	"blur": [
		[ 1, 1, 1 ],
		[ 1, 1, 1 ],
		[ 1, 1, 1 ]
	],
	"sharpen": [
		[ 0, -3, 0 ],
		[ -3, 21, -3 ],
		[ 0, -3, 0 ]
	],
	"emboss": [
		[ -18, -9, 0 ],
		[ -9,  9,  9 ],
		[ 0,  9, 18 ]
	],
	"lighten": [
		[ 0, 0, 0 ],
		[ 0, 12, 0 ],
		[ 0, 0, 0 ]
	],
	"darken": [
		[ 0, 0, 0 ],
		[ 0, 6, 0 ],
		[ 0, 0, 0 ]
	],
	"edge": [
		[ 0, 9, 0 ],
		[ 9, -36, 9 ],
		[ 0, 9, 0 ]
	],
	"grayedge": [
		[ 2, 22, 1 ],
		[ 22, 1, -22 ],
		[ 1, -22, -2 ]
	]
};
var currentFilter = "";

function changeFilter(num) {
	if(num == 1) {
		currentFilter = "blur";
	} else if(num == 2) {
		currentFilter = "sharpen";
	} else if(num == 3) {
		currentFilter = "emboss";
	} else if(num == 4) {
		currentFilter = "lighten";
	} else if(num == 5) {
		currentFilter = "darken";
	} else if(num == 6) {
		currentFilter = "edge";
	} else if(num == 7) {
		currentFilter = "grayedge";
	}
	if(currentFilter.length > 0) {
		addFilter();
	}

  var audio = new Audio("media/sploosh.mp3");
  audio.play();
}

function addFilter() {
	var i, j, ch, sum, centerRedIndex, upRedIndex, downRedIndex, channelIndex;
	var sPixels = getPixels();
	var dPixels = getPixels();
	var sPixelsData = sPixels.data;
	var dPixelsData = dPixels.data;
	var matrix = convolution[currentFilter];
	var width = collageCanvas.width;
	var height = collageCanvas.height;
	var width4 = width * 4;
	//aici, in referinta, height si width erau invers (ceea ce facea efectul sa apara ca un patrat)
	for(i=1; i<height-1 ; i++) {
		centerRedIndex = i * width4 + 4;
		upRedIndex = centerRedIndex - width4;
		downRedIndex = centerRedIndex + width4;
		for(j=1; j<width-1; j++) {
			for(ch=0; ch<3; ch++) {
				sum = 0;

				channelIndex = (upRedIndex - 4) + ch;
				sum += sPixelsData[channelIndex] * matrix[0][0];

				channelIndex += 4;
				sum += sPixelsData[channelIndex] * matrix[0][1];

				channelIndex += 4;
				sum += sPixelsData[channelIndex] * matrix[0][2];

				channelIndex = (centerRedIndex - 4) + ch;
				sum += sPixelsData[channelIndex] * matrix[1][0];

				channelIndex += 4;
				sum += sPixelsData[channelIndex] * matrix[1][1];

				channelIndex += 4;
				sum += sPixelsData[channelIndex] * matrix[1][2];

				channelIndex = (downRedIndex - 4) + ch;
				sum += sPixelsData[channelIndex] * matrix[2][0];

				channelIndex += 4;
				sum += sPixelsData[channelIndex] * matrix[2][1];

				channelIndex += 4;
				sum += sPixelsData[channelIndex] * matrix[2][2];

				sum /= 9;
				sum = Math.min(Math.max(sum, 0), 255);

				dPixelsData[centerRedIndex + ch] = sum;
			}
			dPixelsData[centerRedIndex + 3] = 0xff;

			centerRedIndex += 4;
			upRedIndex += 4;
			downRedIndex += 4;
		}
	}
	cCtx.putImageData(dPixels, 0, 0);
	pixelsAfterFilters = dPixels;

	resetColors();
}

function resetFilters() {
	drawCollage();

  var audio = new Audio("media/delete.mp3");
  audio.play();
}

function changeCollageWidth(value) {
	collageCanvas.width = value;
	drawCollage();
}
function changeCollageHeight(value) {
	collageCanvas.height = value;
	drawCollage();
}
function changeBorder(value) {
	collageBorder = value;
	drawCollage();
}

function pickBackground(num) {
	if(num == 1) {
		bColor = "#808080";
		hasBGImg = false;
	} else if(num == 2) {
		bColor = "#0094FF";
		hasBGImg = false;
	} else if(num == 3) {
		bColor = "#FF0000";
		hasBGImg = false;
	} else if(num == 4) {
		bColor = "#FFD800";
		hasBGImg = false;
	} else if(num == 5) {
		bColor = "#1ECE3E";
		hasBGImg = false;
	} else if(num == 6) {
		bColor = "black";
		hasBGImg = false;
	} else if(num == 7) {
		bColor = "white";
		hasBGImg = false;
	} else if(num == 8) {
		// BGImg.src = "./media/background8.png";
		// obisnuiam sa iau imaginile din folder-ul media dar primeam eroarea 'Tainted canvases may not be exported.'
		//cand incercam sa salvez, asa ca le-am incarcat pe 'imgur' si am adaugat 'BGImg.crossOrigin = "anonymous"' dupa crearea imaginii
		BGImg.onload = drawCollage;
		BGImg.src = "https://i.imgur.com/B53X1DV.png";
		hasBGImg = true;
	} else if(num == 9) {
		BGImg.onload = drawCollage;
		BGImg.src = "https://i.imgur.com/RSvrnLP.jpg";
		hasBGImg = true;
	} else if(num == 10) {
		BGImg.onload = drawCollage;
		BGImg.src  = "https://i.imgur.com/RV7EAg9.png";
		hasBGImg = true;
	} else if(num == 11) {
		BGImg.onload = drawCollage;
		BGImg.src  = "https://i.imgur.com/O7Ctg9k.jpg";
		hasBGImg = true;
	} else if(num == 12) {
		BGImg.onload = drawCollage;
		BGImg.src  = "https://i.imgur.com/hyQHIWp.jpg";
		hasBGImg = true;
	} else if(num == 13) {
		BGImg.onload = drawCollage;
		BGImg.src  = "https://i.imgur.com/RVtS0ZO.jpg";
		hasBGImg = true;
	} else if(num == 14) {
		BGImg.onload = drawCollage;
		BGImg.src  = "https://i.imgur.com/BET7RQJ.jpg";
		hasBGImg = true;
	}
	if(!hasBGImg) {
		drawCollage();
	}

  var audio = new Audio("media/highboop.mp3");
  audio.play();
}
function pickTemplate(num) {
	template = num;
	drawCollage();

  var audio = new Audio("media/crank.mp3");
  audio.play();
}

function allowDrop(e) {
	e.preventDefault();
}
function drop(e) {
  e.preventDefault();
  let dt = e.dataTransfer;
  let files = dt.files;
	fr.readAsDataURL(files[0]);
	fr.onload = addImage;

  var audio = new Audio("media/boop.mp3");
  audio.play();
}
function addImage() {
	let img = new Image();
  img.onload = function() {
  	images.push(img);
		addedWidth += img.width * previewHeight / img.height + previewBorder * 2;
		canvas.width = addedWidth;
  	addedWidth = 0;
  	images.forEach(function(img) {
  		ctx.drawImage(img, addedWidth + previewBorder, previewBorder, img.width * previewHeight / img.height, previewHeight);
  		addedWidth += img.width * previewHeight / img.height;
  	});
		drawCollage();
  }
	img.src = fr.result;
}
function saveImage() {
	saveImgBtn.setAttribute("href", collageCanvas.toDataURL("image/png"));
	saveImgBtn.setAttribute("download", "mycollage.png");

  var audio = new Audio("media/save.mp3");
  audio.play();
}
function clearImages() {
	images = [];
	addedWidth = 0;
	canvas.height = previewHeight + previewBorder * 2;
	canvas.width = 184;
	ctx.font = "30px Arial";
	ctx.fillText("Drag and", 5, 40);
	ctx.fillText("drop any", 5, 70);
	ctx.fillText("number of", 5, 100);
	ctx.fillText("images here", 5, 130);
	ctx.fillText("(one by one)", 5, 160);
	drawCollage();

  var audio = new Audio("media/delete.mp3");
  audio.play();
}

function drawCollage(withFilters, dontResetColors) {
	cCtx.beginPath();
	cCtx.rect(0, 0, collageCanvas.width, collageCanvas.height);
	cCtx.fillStyle = bColor;
	cCtx.fill();
	if(hasBGImg) {
		cCtx.drawImage(BGImg, 0, 0, collageCanvas.width, collageCanvas.height);
	}
	if(images.length > 0) {
		if(template == 1) {
			images.forEach(function(img, index) {
				var topBorder = 0;
				if(index == 0) {
					topBorder = collageBorder;
				}
				cCtx.drawImage(img, collageBorder, collageCanvas.height / images.length * index + topBorder, collageCanvas.width - collageBorder * 2, collageCanvas.height / images.length - collageBorder - topBorder);
			});
		} else if(template == 2) {
			// aici am mers din greseala in greseala pana a iesit cum mi-am propus, asa ca se poate sa fie putin cam incurcat
			images.forEach(function(img, index) {
				var topBorder = 0;
				if(index <= 1) {
					topBorder = collageBorder;
				}
				if(images.length % 2 == 0) {
					if((index + 1) % 2 == 0) {
						cCtx.drawImage(img, collageCanvas.width / 2, collageCanvas.height / images.length * (index - 1) + topBorder, collageCanvas.width / 2 - collageBorder, collageCanvas.height / Math.round(images.length / 2) - collageBorder - topBorder);
					} else {
						cCtx.drawImage(img, collageBorder, collageCanvas.height / images.length * index + topBorder, collageCanvas.width / 2 - collageBorder * 2, collageCanvas.height / Math.round(images.length / 2) - collageBorder - topBorder);
					}
				} else {
					if(index < images.length - 1) {
						if((index + 1) % 2 == 0) {
							cCtx.drawImage(img, collageCanvas.width / 2, collageCanvas.height / (images.length + 1) * (index - 1) + topBorder, collageCanvas.width / 2 - collageBorder, collageCanvas.height / Math.round(images.length / 2) - collageBorder - topBorder);
						} else {
							cCtx.drawImage(img, collageBorder, collageCanvas.height / (images.length + 1) * index + topBorder, collageCanvas.width / 2 - collageBorder * 2, collageCanvas.height / Math.round(images.length / 2) - collageBorder - topBorder);
						}
					} else {
						cCtx.drawImage(img, collageBorder, collageCanvas.height / (images.length + 1) * index + topBorder, collageCanvas.width - collageBorder * 2, collageCanvas.height / Math.round(images.length / 2) - collageBorder - topBorder);
					}
				}
			});
		} else if(template == 3) {
			images.forEach(function(img, index) {
				var topBorder = 0;
				if(index == 0) {
					topBorder = collageBorder;
				}
				cCtx.drawImage(img, collageCanvas.width / images.length * index + topBorder, collageBorder, collageCanvas.width / images.length - collageBorder - topBorder, collageCanvas.height - collageBorder * 2);
			});
		}
	}
	if(withFilters == true && pixelsAfterFilters != null) {
		cCtx.putImageData(pixelsAfterFilters, 0, 0);
	} else {
		pixelsAfterFilters = null;
	}
	if(dontResetColors != true) {
		resetColors();
	}
}