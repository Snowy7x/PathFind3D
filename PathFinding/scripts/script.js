var points = []
for (var y = 0; y < 18; y++){
	for (var x = 0; x < 28; x++){
		points[y+"."+x] = y + "x" + x;
	}
}
var mouseDown = 0;
document.body.onmousedown = function() { 
    mouseDown = 1;
}
document.body.onmouseup = function() {
    mouseDown = 0;
}
var Walls = new Array();
var blockedNodes = [];
var lastNode = [];
var visited = [];

var currentSitting = "start";

var startPointId;
var endPointId;

function onBtnClick(id){

	switch(id.id){
		case "startPointBtn":
			currentSitting = "start";
		break;
		
		case "endPointBtn":
			currentSitting = "end";
		break;
		
		case "wallPointsBtn":
			currentSitting = "wall";
		break;
	}
}

function onNodeClick(id){
	id = id.id;
	element = document.getElementById(id);
	switch(currentSitting){
		case "start":
			if (startPointId != null){
				document.getElementById(startPointId).style.backgroundColor = "transparent";
			}
			if (Walls != null){
				if (Walls.includes(id)){
					Walls.splice(Walls.indexOf(id), 1);
				}
			}
			startPointId = id;
			console.log("added new start");
			element.style.backgroundColor = "green";
		break;
		
		case "end":
			if (endPointId != null){
				document.getElementById(endPointId).style.backgroundColor = "transparent";
			}
			if (Walls != null){
				if (Walls.includes(id)){
					Walls.splice(Walls.indexOf(id), 1);
				}
			}
			endPointId = id;
			element.style.backgroundColor = "red";
			
		break;
		
		case "wall":
			element.style.backgroundColor = "#2330b4";
			document.getElementById(id).classList.remove("zoomStart");
			if (Walls != null){
				if (Walls.includes(id)){
					console.log("already a wall");
				}
			}
			document.getElementById(id).classList.add("zoomStart");
			 if (typeof Walls === "undefined") {
			 	console.log("it is und");
			 }
			Walls[Walls.length] = id;
		break;
	}
}

function mouseOver(id){
	
	element = document.getElementById(id.id);
	if(element != null){
		console.log("entered: " + id + ", id2: " + id.id);
		element.classList.remove("zoomStart");
		if(currentSitting == "wall" && mouseDown == 1){
			element.classList.add("zoomStart");
			element.style.backgroundColor = "#2330b4";
			if (Walls.includes(id)){
				console.log("already a wall");
			}
			Walls[Walls.length] = id.id;
		}
	}
}

function ClearPoints(withWalls = true) {
	for (var key in points) {
		if(withWalls){
			console.log("cleared: " + key);
			document.getElementById(points[key]).style.backgroundColor = "transparent";
		}else{
			if(Walls.includes(points[key]) == false && points[key] != startPointId && points[key] != endPointId){
				console.log("cleared: " + key);
				document.getElementById(points[key]).style.backgroundColor = "transparent";
			}
		}
		
	}
	visited = [];
	blockedNodes = [];
}

function StartPathFinding() {

	//StartPoint
	var ver = startPointId.split("x");			
	var x1 = ver[1];
	var y1 = ver[0];         	         			
	
	//EndPoint
	var ver = endPointId.split("x");			
	var x2 = ver[1];
	var y2 = ver[0];         	         			
	
	DrawWay(x1, y1, x2, y2);
}

function DrawWay(x, y, px, py){
	ClearPoints(false);
	var currPoint = GetClosestNode(x, y, px, py);
	visited[0] = currPoint;
	var currSplit = currPoint.split("x");
	var currX = currSplit[1];
	var currY = currSplit[0];
	var i = 1;
	while ((currX != px || currY != py) && i < 700){
		//visited.push(currpoint);
		console.log("X: " + currX + " - Y: " + currY + ", i: " + i);
		lastNode = visited[i - 2];
		currPoint = GetClosestNode(currX, currY, px, py);
		if(currPoint == lastNode){
			blockedNodes[blockedNodes.length] = currPoint
		}
		currSplit = currPoint.split("x");
		currX = currSplit[1];
		currY = currSplit[0];
		visited[i] = currPoint;
		i++;
	}
	Draw(visited);
}
function Draw(points){
	var i = 0;
	var draws = setInterval(function(){
		var element = document.getElementById(points[i]);
	
		element.classList.add("zoom");
		element.style.backgroundColor = "yellow";
		i++;
		if(i == points.length - 1){
			clearInterval(draws);
		}
	}, 100);
	
}
function GetClosestNode(x, y, px, py){
	var right; 
	var left;
	var top;
	var bottom;
	var nearH;
	var nearV;
	
	y = Number(y);
	x = Number(x);
	console.log("Getting nearest from:" + "x: " + x + ", y:" + y + " To: " + "px: " + px + ", py:" + py);
	
	if (x == 0 || x == 27){

		switch (x) {
			case 0:
				right = points[(y) + "." + (x+1)];
				nearH = right;
				break;
			case 27:
				left = points[(y) + "." + (x-1)];
				nearH = left;
				break;
				
		}
	}else{
		
		left = points[(y) + "." + (x-1)];
		right = points[(y) + "." + (x+1)];
		
		if(Walls.includes(left)  || blockedNodes.includes(left)){
			nearH = right;
			blockedNodes[blockedNodes.length] = left;
		}else if(Walls.includes(right) || blockedNodes.includes(right)){
			nearH = left;
			blockedNodes[blockedNodes.length] = right;
		}
		else{
			console.log("right: " + right + ", left: " + left);
			rSp = right.split("x");
			lSp = left.split("x");
			disR = GetDistance(rSp[1], rSp[0], px, py);
			disL = GetDistance(lSp[1], lSp[0], px, py);
			nearH = right;

			if(disL < disR){
				nearH = left;
			}
		}
	}
	
	if (y == 0 || y == 17){
		
		switch (y) {
			case 0:
				var ny = y + 1;
				bottom = points[ny + "." + (x)];
				nearV = bottom;
				break;
			case 17:
				var ny = y - 1; 
				top = points[(ny) + "." + (x)];
				nearV = top;
				break;
		}


	}else{
		var ny = y + 1;
		bottom = points[(ny) + "." + (x)];
		ny = y - 1;
		top = points[(ny) + "." + (x)];
		if(Walls.includes(top) || blockedNodes.includes(top)){
			nearV = bottom;
			blockedNodes[blockedNodes.length] = top;
		}else if (Walls.includes(bottom) || blockedNodes.includes(bottom)){
			nearV = top;
			blockedNodes[blockedNodes.length] = bottom;
		}
		else{
			console.log("bottom: " + bottom + ", top: " + top);
			tSp = top.split("x");
			bSp = bottom.split("x");
			disT = GetDistance(tSp[1], tSp[0], px, py);
			disB = GetDistance(bSp[1], bSp[0], px, py);
			nearV = top;

			if(disB < disT){
				nearV = bottom;
			}
		}
	}

	vS = nearV.split("x");
	disV = GetDistance(vS[1], vS[0], px, py);
	
	hS = nearH.split("x");
	disH = GetDistance(hS[1], hS[0], px, py);

	
	

	var nearest = nearH;
	if(disV < disH){
		nearest = nearV;
	} 
	
	if (Walls.includes(nearV) || blockedNodes.includes(nearV)){
		nearest = nearH;
		blockedNodes[blockedNodes.length] = nearV;
	}else if (Walls.includes(nearH) || blockedNodes.includes(nearH)){
		nearest = nearV;
		blockedNodes[blockedNodes.length] = nearH;
	}

	console.log("nearest: " + nearest.toString() + ", last: " + lastNode);
	return nearest;
}

function GetDistance(x1=0, y1=0, x2=0, y2=0){ 
	var x = x2 - x1;
	var y = y2 - y1;
	var dis = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	return dis;
	
}
