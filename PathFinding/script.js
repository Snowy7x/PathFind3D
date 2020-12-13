var points = [];
for (var y = 0; y < 18; y++){
	for (var x = 0; x < 28; x++){
		points[y+"."+x] = y + "x" + x;
	}
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 18; row++) {
    const currentRow = [];
    for (let col = 0; col < 28; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col: col,
    row: row,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithStartToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: !node.isStart,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};



var grid = getInitialGrid();

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

function is3D(){
	var display = document.getElementById("renderCanvas").style.display;
	console.log("display: " + display);
	if (display == "block"){
		return true;
	}else{
		return false;
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
			grid[GetY(id)][GetX(id)].isStart = true;
			grid[GetY(id)][GetX(id)].isFinish = false;
			element.style.backgroundColor = "yellow";
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
			grid[GetY(id)][GetX(id)].isStart = false;
			grid[GetY(id)][GetX(id)].isFinish = true;
			element.style.backgroundColor = "green";

		break;

		case "wall":
			element.style.backgroundColor = "rgb(12, 53, 71)";
			document.getElementById(id).classList.remove("zoomStart");
			if (Walls != null){
				if (Walls.includes(id)){
				}
			}
			document.getElementById(id).classList.add("zoomStart");
			if (typeof Walls === "undefined") {
				console.log("it is und");
			}
			grid = getNewGridWithWallToggled(grid, GetY(id), GetX(id));
			Walls[Walls.length] = id;
			element.style.backgroundColor = "black";
		break;
	}
}

function mouseOver(id){

	element = document.getElementById(id.id);
	if(element != null){
		element.classList.remove("zoomStart");
		if(currentSitting == "wall" && mouseDown == 1){
			element.classList.add("zoomStart");
			element.style.backgroundColor = "rgb(12, 53, 71)";
			if (Walls.includes(id)){
			}
			grid = getNewGridWithWallToggled(grid, GetY(id.id), GetX(id.id));
			Walls[Walls.length] = id.id;
		}
	}
}

function ClearPoints(withWalls = true, withse = true) {
	if (is3D()){
        Clear3DPoints(withWalls, withse);
        return;
    }
	for (var key in points) {
		if (!withse){
				if (points[key] == startPointId || points[key] == endPointId){
					continue;
				}
		}else{
			startPointId = null;
			endPointId = null;
		}
		if(withWalls){
			document.getElementById(points[key]).classList.remove("visitedAnimation");
			document.getElementById(points[key]).classList.remove("findingAnimation");
			document.getElementById(points[key]).style.backgroundColor = "transparent";
		}else{
			if(Walls.includes(points[key]) == false && points[key] != startPointId && points[key] != endPointId){
				document.getElementById(points[key]).classList.remove("visitedAnimation");
			    document.getElementById(points[key]).classList.remove("findingAnimation");
				document.getElementById(points[key]).style.backgroundColor = "transparent";
			}
		}
	}
	visited = [];
	blockedNodes = [];
}

function StartPathFinding() {

	if (is3D()){
		Start3DPathFinding();
		return;
	}

	ClearPoints(false, false);
	var newGrid = getInitialGrid();
	newGrid = getNewGridWithStartToggled(newGrid, GetY(startPointId), GetX(startPointId));
	if (typeof(Walls) != undefined){
		for (var i = 0; i <= Walls.length - 1; i++){
			var nd = GetNodeFromID(Walls[i]);
			newGrid = getNewGridWithWallToggled(newGrid, nd.row, nd.col);
		}
	}
	grid = newGrid;

	GetWay();
}

function Draw(points, color="blue", speed1 = 25, anim1 = "visitedAnimation", nodes2=null, color2="yellow", speed2 = 30, anim2 = "findingAnimation"){
	var i = 0;
	var draws = setInterval(function(){
		var element = document.getElementById(points[i]);
		element.classList.remove(anim1);
		element.classList.add(anim1);
		element.style.backgroundColor = color;
		i++;
		if(i == points.length){
			clearInterval(draws);
			if (nodes2 != null){
				Draw(nodes2, color2, speed2, anim2);
			}
		}
	}, speed1);
}

function GetDistance(x1=0, y1=0, x2=0, y2=0){
	var x = x2 - x1;
	var y = y2 - y1;
	var dis = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	return dis;
}

function GetWay() {
	var visitedNodesInOrder = [];

	visitedNodesInOrder = dijkstra();
	console.log(visitedNodesInOrder);

	visitedNodesInOrder.shift();

	const nodez = [];
	for (var i = 0; i <= visitedNodesInOrder.length - 2; i++) {
		nodez[i] = GetIDFromNode(visitedNodesInOrder[i]);
	}


	const pointz = [];
	
	const pathNodes = getNodesInShortestPathOrder(GetNodeFromID(endPointId));
	pathNodes.shift();
	for (var i = 0; i <= pathNodes.length - 2; i++) {
		pointz[i] = GetIDFromNode(pathNodes[i]);
	}
	
	Draw(nodez, "rgba(224, 0, 0, 0.75)", 0.1, "visitedAnimation",  pointz, "rgb(255, 254, 106)", 50);
}

function GetX(point){
	var ver = point.split("x");
	return ver[1];
}

function GetY(point){
	var ver = point.split("x");
	return ver[0];
}

function dijkstra() {

	const visitedNodesInOrder = [];
	startNode = GetNodeFromID(startPointId);
  	startNode.distance = 0;
  	if (startNode.isStart){
  		console.log("it is startNode: " + startNode.row + "x" + startNode.col);
  	}else{
  		console.log("not startNode: " + startNode.row + "x" + startNode.col);
  	}
 	const unvisitedNodes = getAllNodes(grid);
 	while (!!unvisitedNodes.length) {
    	sortNodesByDistance(unvisitedNodes);
    	const closestNode = unvisitedNodes.shift();
    	
    	if (isWall(closestNode)) continue;
   		
    	if (closestNode.distance === Infinity) return visitedNodesInOrder;

    	closestNode.isVisited = true;
    	visitedNodesInOrder.push(closestNode);
   		if (closestNode === GetNodeFromID(endPointId)) return visitedNodesInOrder;
    	updateUnvisitedNeighbors(closestNode, grid);
  }
}

function isWall(node){
	if (node.isWall){
		console.log("found wall");
		return true;
	}
	var point = GetIDFromNode(node);
	var element = document.getElementById(point);
	if (typeof(element) != undefined){
		var color = element.style.backgroundColor;
		console.log(color);
		if (color != "red" && color != "transparent" && color != "yellow" && color != "green"){
			console.log("found wall");
			return true;
		}
	}
	return false;
	
}


function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

function GetNodeFromID(id){
	return grid[GetY(id)][GetX(id)];
}

function GetIDFromNode(node){
	return node.row + "x" + node.col;
}

class Node {


	constructor(xx, yy, points){
	 	this.x = xx;
	 	this.y = yy;
	 	this.point = yy+"x"+xx;
	 	this.points = points;
	}

	setColor(color){
		console.log(this.point);
		document.getElementById(this.point).style.backgroundColor = color;
	}

	getPoint() {
		return this.points[this.y+"."+this.x];
	}

	getLeft (){
		return new Node(this.x-1, this.y, this.points);
	}

	getRight(){
		return new Node(this.x-(-1), this.y, this.points);
	}

	getUp(){
		return new Node(this.x, this.y-1, this.points);
	}

	getBottom(){
		return new Node(this.x, this.y-(-1), this.points);
	}
}

