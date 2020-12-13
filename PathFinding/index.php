<html>

<head>
    <title> Project </title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="style/select.css">

    <script src="https://preview.babylonjs.com/babylon.js"></script>
    <!-- Link to the last version of BabylonJS loaders to enable loading filetypes such as .gltf -->
    <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
    <!-- Link to pep.js to ensure pointer events work consistently in all browsers -->
    <script src="https://code.jquery.com/pep/0.4.1/pep.js"></script>

</head>
	<body>
	  <canvas id ="renderCanvas" class="render-canvas"></canvas>
      <script src="3d/js/script.js" type = "text/javascript">
      </script>
		<div class="nav">
			<a class="logo"> PathFinding Project </a>
			
			<a class="dropdown">
  				<button class="dropbtn">Select Alogarithm:</button>
  				▼
  				<div class="dropdown-content">
    				<div class="item" href="#">Dijkstra</div>
    				<div class="item" href="#">soon...</div>
    				<div class="item" href="#">Soon...</div>
  				</div>
			</a>

			<a id="startPointBtn" onClick="onBtnClick(this)" class="node-settings">Set Start Point</a>
			<a id="endPointBtn" onClick="onBtnClick(this)"  class="node-settings">Set End Point </a>
			<a id="wallPointsBtn" onClick="onBtnClick(this)"  class="node-settings">Set Walls </a>
			<a id="strt" onClick="StartPathFinding()" class="visual">Start Finding </a>
			<a id="clear" onClick="ClearPoints()" class="visual">Clear </a>
			<a id="switch" onClick="switchD(this)" class="node-settings">Switch to 2D </a>
		</div>

		<div class="grid" id="2d-grid">
		<?php for ($i = 0; $i < 18; $i++) : ?>
			<div class="row">
				<?php for ($x = 0; $x < 28; $x++) : ?>
				<div class="col" id=<?php echo "$i"."x"."$x"?>
				 onmouseover="mouseOver(this)" onclick="onNodeClick(this)" colspan=1> 
					<br> &nbsp &nbsp &nbsp
				</div>
				<?php endfor?>
			</div>
			<?php endfor; ?>
		</div>
	<!--	<table id="2d-grid">
			<?php for ($i = 0; $i < 18; $i++) : ?>
			<tr>
				<?php for ($x = 0; $x < 28; $x++) : ?>
				<td id=<?php echo "$i"."x"."$x"?> onmouseover="mouseOver(this)" onclick="onNodeClick(this)" colspan=1> <br> &nbsp &nbsp &nbsp</td>
				<?php endfor?>
			</tr>
			<?php endfor; ?>
		</table>-->

		<div class="fixed-footer">
    	    <div class="container">Copyright &copy; 2020-2021 SnowyDragon 😅 😂</div>        
  	    </div>
	</body>
 <script>
 	var is2D = true;
 	document.getElementById("2d-grid").style.display = "none";
	document.getElementById("renderCanvas").style.display = "block";
 	function switchD(id){
		id = id.id;
		if (is2D){
			document.getElementById("2d-grid").style.display = "none";
			document.getElementById("renderCanvas").style.display = "block";
			document.getElementById(id).innerHTML = "Switch to 2D";
			is2D = false;
		}else{
			document.getElementById("renderCanvas").style.display = "none";
			document.getElementById("2d-grid").style.display = "block";
			document.getElementById(id).innerHTML = "Switch to 3D";
			is2D = true;
		}
	}
 </script>
 <script src="script.js"></script>
 <script src="scripts/selector.js"></script>
</html>
