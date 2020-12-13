var scene, camera, light;
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var makeOverOut;

var walls = [];
var floor = [];
var blocks = [];

var startNodeID = null;
var endNodeID = null;

function createScene() {
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(1, 0.8, 0.8);
            
  camera = new BABYLON.ArcRotateCamera("Camera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
  scene.activeCamera.attachControl(canvas);
          
  //light = new BABYLON.PointLight("Hemi0", new BABYLON.Vector3(0, 30, -10), scene);
  //light.groundColor = new BABYLON.Color3(0, 0, 0);

  // Over/Out
  makeOverOut = function (mesh) {
    mesh.actionManager.registerAction( new BABYLON.ExecuteCodeAction(
        {
            trigger: BABYLON.ActionManager.OnLeftPickTrigger,
            parameter: 'r'
        },
        function () {
            switch (currentSitting){

              case "start":
                if (startNodeID != null){
                    var n = GetStartNode();
                    if (n.wallBlock != null){
                      setWallBlock(n.row, n.col, false);
                    }
                    grid3D = getNew3DGridWithStartToggled(grid3D, n.row, n.col);
                }
                var node = GetNodeFromBlock(mesh);
                console.log(node);
                setWallBlock(mesh.position.z, mesh.position.x, false);
                node = GetNodeFromBlock(mesh);
                grid3D = getNew3DGridWithStartToggled(grid3D, node.row, node.col);
                node = GetNodeFromBlock(mesh);
                console.log(node);
                if (node.isStart){
                    startNodeID = node.row + "x" + node.col;
                }else{
                  startNodeID = 0 + "x" + 0;
                }
                console.log(startNodeID);

              break;

              case "end":
                if (endNodeID != null){
                    var n = GetEndNode();
                    if (n.wallBlock != null){
                      setWallBlock(n.row, n.col, false);
                    }
                    grid3D = getNew3DGridWithEndToggled(grid3D, n.row, n.col);
                }
                var node = GetNodeFromBlock(mesh);
                setWallBlock(mesh.position.z, mesh.position.x, false);
                node = GetNodeFromBlock(mesh);
                console.log(node);
                grid3D = getNew3DGridWithEndToggled(grid3D, node.row, node.col);
                node = GetNodeFromBlock(mesh);
                console.log(node);
                if (node.isFinish){
                    endNodeID = node.row + "x" + node.col;
                }else{
                  endNodeID = 0 + "x" + 0;
                }
                console.log(endNodeID);

              break;

              case "wall":
                var node = GetNodeFromBlock(mesh);
                setWallBlock(mesh.position.z, mesh.position.x);
                node = GetNodeFromBlock(mesh);
              break;
            }
        }
    ));
    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mesh.material.emissiveColor));
    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.White()));
    mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
    mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
  }
    // scene's actions
  scene.actionManager = new BABYLON.ActionManager(scene);
  return scene;
}

scene = createScene();

engine.runRenderLoop(function() {
    scene.render();
});

const getInitialGrid3D = () => {
    const grid = [];
    for (let row = 0; row <= 9; row++) {
      const currentRow = [];
      for (let col = 0; col <= 9; col++) {
        currentRow.push(create3DNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
};
  
const create3DNode = (col, row) => {
    return {
      col,
      row,
      isStart: false,
      isFinish: false,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      block: null,
      wallBlock: null
    };
};
  
const getNew3DGridWithWallToggled = (grid, row, col, bl) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
      wallBlock: bl,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithBlockUpdated = (grid, row, col, block) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      block: block,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNew3DGridWithStartToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isStart: !node.isStart,
      distance: node.distance == Infinity ? 0 : Infinity,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNew3DGridWithEndToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isFinish: !node.isFinish,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};
  
var grid3D = getInitialGrid3D();

buildFLoor();

function buildFLoor(n=9){
    
	for (var row = 0; row <= n; row++){
        var currRow = [];
        for (var col = 0; col <=n; col++){
            var geometry, material, mesh;
            var box = BABYLON.Mesh.CreateBox("box", 1.0, scene);
            box.material = new BABYLON.StandardMaterial("box", scene);
            box.material.specularColor = new BABYLON.Color3(1, 1, 1);
            box.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
            box.material.diffuseTexture = new BABYLON.Texture("./3d/images/side.png", scene);
            box.material.diffuseTexture.uScale = 1;
            box.material.diffuseTexture.vScale = 1;
            box.position = new BABYLON.Vector3(col, 0, row);
            box.actionManager = new BABYLON.ActionManager(scene);
            floor.push(box);
            currRow.push(box);
            makeOverOut(box);
            grid3D = getNewGridWithBlockUpdated(grid3D, row, col, box);
        }
        blocks.push(currRow);
    } 
}

function setWallBlock(row, col, isWall=true){
    block = grid3D[row][col].wallBlock;
    if (block == null && grid3D[row][col].isWall == false){
        var box = BABYLON.Mesh.CreateBox("box", 1.0, scene);
        box.material = new BABYLON.StandardMaterial("box", scene);
        if (isWall){
            box.material.specularColor = new BABYLON.Color3(1, 1, 0);
            box.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
        }else{
            box.material.specularColor = new BABYLON.Color3(1, 0, 1);
            box.material.emissiveColor = new BABYLON.Color3(1, 0, 1);
        }
        box.material.diffuseTexture = new BABYLON.Texture("./3d/images/side.png", scene);
        box.material.diffuseTexture.uScale = 1;
        box.material.diffuseTexture.vScale = 1;
        box.position = new BABYLON.Vector3(col, 1, row);
        box.actionManager = new BABYLON.ActionManager(scene);
        block = box;
        makeOverOut(box);
        walls.push(box);
    }else{
        block.dispose();
        block = null;
    }
    console.log(block);
    grid3D = getNew3DGridWithWallToggled(grid3D, row, col, block);
}

function Clear3DPoints(withWalls = true, withse = true) {
    var nodes = getAll3DNodes(grid3D);

    for (var key of nodes) {
        if(withWalls && key.isWall){
            if (key.wallBlock != null){
                key.wallBlock.dispose();
            }

            if (GetStartNode().isWall){
                console.log("yes");
            }

            grid3D = getNew3DGridWithWallToggled(grid3D, key.row, key.col, null);
            blocks[key.row][key.col].material.emissiveColor = BABYLON.Color3.White();
        }else{
            if(key.isWall == false){
                blocks[key.row][key.col].material.emissiveColor = BABYLON.Color3.White();
            }
        }
    }
    console.log(withse);
    if (withse){
      setWallBlock(GetStartNode().row, GetStartNode().col);
      grid3D = getNew3DGridWithStartToggled(grid3D, GetStartNode().row, GetStartNode().col);
      grid3D = getNew3DGridWithEndToggled(grid3D, GetEndNode().row, GetEndNode().col);
      endNodeID = null;
      startNodeID = null;
    }
    visited = [];
    blockedNodes = [];
}

function Start3DPathFinding() {

    ClearPoints(false, false);
    var newGrid = getInitialGrid3D();
    if (startNodeID != null){
        var start = GetStartNode();
        newGrid = getNew3DGridWithStartToggled(newGrid, start.row, start.col);
    }
    if (endNodeID != null){
        var end = GetEndNode();
        newGrid = getNew3DGridWithEndToggled(newGrid, end.row, end.col);
    }
    if (typeof(walls) != undefined){
        for (var i = 0; i <= walls.length - 1; i++){
            var nd = GetNodeFromBlock(walls[i]);
            newGrid = getNew3DGridWithWallToggled(newGrid, nd.row, nd.col);
        }
    }
    grid3D = newGrid;

    GetWay3D();
}

function GetWay3D() {
    var visitedNodesInOrder = [];

    visitedNodesInOrder = dijkstra3D();
    
    var pathNodes = getNodesInShortestPathOrder3D(GetEndNode());
    DrawWay3D(pathNodes);

    console.log(startNodeID);
   // Draw(nodez, "rgba(224, 0, 0, 0.75)", 0.1, "visitedAnimation",  pointz, "rgb(255, 254, 106)", 50);
}

function DrawWay3D(nodes){
    var i = 0;
    console.log(nodes[0]);
    var draws = setInterval(function(){
        var row = nodes[i].row; 
        var col = nodes[i].col;
        
        var box = blocks[row][col];
        box.material.specularColor = new BABYLON.Color3(1, 1, 0);
        box.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
        makeOverOut(box);
        i++;
        if(i >= nodes.length - 1){
            clearInterval(draws);
        }
    }, 100);
}

function dijkstra3D() {

    const visitedNodesInOrder = [];
    var startNode = GetStartNode();

    var endNode = GetEndNode();
    endNode.isFinish = true;

    const unvisitedNodes = getAll3DNodes(grid3D);
    
    updateUnvisitedNeighbors(startNode, grid3D, true);
    startNode.previousNode = null;
    while (!!unvisitedNodes.length) {
        sortNodesByDistance3D(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        if (isWall3D(closestNode) && closestNode != endNode){ 
            console.log("wall: " + closestNode.row + "x" + closestNode.col); 
            continue;
        }
        
        if (closestNode.distance === Infinity){
            console.log("closestNodeZ: " + closestNode.row + ", closestNodeX: " + closestNode.col + ", dis: " + closestNode.distance);
            return visitedNodesInOrder;
        }

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode == GetEndNode()){
         return visitedNodesInOrder;
        }
        updateUnvisitedNeighbors3D(closestNode, grid3D);
    }
}

function updateUnvisitedNeighbors3D(node, grid, isStart=false) {
  const unvisitedNeighbors = getUnvisitedNeighbors3D(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    if (!isStart){
        neighbor.previousNode = node;
    }
  }
}

function getUnvisitedNeighbors3D(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function sortNodesByDistance3D(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function isWall3D(node){
    return node.isWall;
}

function getAll3DNodes(grid) {
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
function getNodesInShortestPathOrder3D(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  var i = 0;
  grid3D[GetStartNode().row][GetStartNode().row].previousNode = null;
  while (currentNode != null && i <= 100) {
    i++;
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

function GetBlockFromNode(node){
    return node.block;
}

function GetNodeFromBlock(box){
    return grid3D[box.position.z][box.position.x];
}

function GetStartNode(){
    var split = startNodeID.split("x");
    var row = split[0];
    var col = split[1];
    return grid3D[row][col];
}

function GetEndNode(){
    var split = endNodeID.split("x");
    var row = split[0];
    var col = split[1];
    return grid3D[row][col];
}