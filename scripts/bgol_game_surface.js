GameSurface = function(numRowCol, canvas){
	this.m_canvas = canvas;
	this.m_numRowCol = numRowCol; 
	this.m_table = this.generateGrid();
	
	var x_step = canvas.width / this.m_numRowCol;
	var y_step = canvas.height / this.m_numRowCol;
	var game_surface = this;
	var x = null;
	var y = null;
	
	canvas.onmousedown = function(e) {
	    x = e.clientX - game_surface.m_canvas.offsetLeft;
	    y = e.clientY - game_surface.m_canvas.offsetTop;
	    cellX = Math.floor(x / x_step);
	    cellY = Math.floor(y / y_step);
	    game_surface.m_table[cellX][cellY] = !game_surface.m_table[cellX][cellY];
	    game_surface.draw();
	};
	
	canvas.onmousemove = function(e) {
		if (x == null || y == null) {
			return;
		}
		x = e.clientX - game_surface.m_canvas.offsetLeft;
		y = e.clientY - game_surface.m_canvas.offsetTop;
		cellX = Math.floor(x / x_step);
		cellY = Math.floor(y / y_step);
		 game_surface.m_table[cellX][cellY] = true;
		game_surface.draw();
  	};
  	
  	canvas.onmouseup = function(e) {
  		x = null;
  		y = null;
  	};
};

GameSurface.prototype.draw = function(){
	var x_step = this.m_canvas.width / this.m_numRowCol;
	var y_step = this.m_canvas.height / this.m_numRowCol;
	var x = 0;
	var y = 0;
	
	context = this.m_canvas.getContext("2d");
	
	context.clearRect(0,0,this.m_canvas.width, this.m_canvas.height);
	context.strokeRect(0,0,this.m_canvas.width, this.m_canvas.height);
	
	for (i=0; i < this.m_numRowCol; i++){
		for (j=0; j < this.m_numRowCol; j++){
			if (this.m_table[i][j]){
				context.fillRect(x, y, x_step, y_step);
			} 
			
			y += y_step;
		}
		x += x_step;
		y = 0;
	}
};

GameSurface.prototype.generateGrid = function(){
	var grid = new Array(this.m_numRowCol);
	for (i = 0; i < grid.length; i++){
		grid[i] = new Array(this.m_numRowCol);
	}
	return grid;
};

GameSurface.prototype.populateGrid = function(){
	grid = this.m_table;
	for(i = 0; i < grid.length; i++){
		for (j = 0; j < grid[i].length; j++){
			var num = Math.floor(Math.random()*2);
			grid[i][j] = num;
		}
	}
	this.draw();
};

GameSurface.prototype.update = function(){
	newState = this.generateGrid();	
	
	for(i = 0; i < this.m_numRowCol; i++){
		for (j = 0; j < this.m_numRowCol; j++){
			newState[i][j] = this.checkCoord(i, j);
		}
	}
	
	this.m_table = newState;
	this.draw();
};

GameSurface.prototype.checkCoord = function(x, y){
	numNeighbours = 0;
	numNeighbours = this.countNeighbours(x,y);
	
	if(this.m_table[x][y] && (numNeighbours < 2 || numNeighbours > 3)){
			return false;
	}
	
	if(!this.m_table[x][y] && numNeighbours == 3){
		return true;
	}
	
	return this.m_table[x][y];
};

GameSurface.prototype.countNeighbours = function(x, y) {
	num = 0;
	x_minus_1 = (x - 1 >= 0) ? x - 1 : this.m_numRowCol - 1;
	num += this.countY(x_minus_1, y);
	
	x_plus_1 = (x + 1 < this.m_numRowCol) ? x + 1 : 0;
	num += this.countY(x_plus_1, y);
	
	num += this.countY(x, y);
	
	if(this.m_table[x][y]){
		num--;
	}
			
	return num;
};

/**
 * counts all true y values for a given column
 */
GameSurface.prototype.countY = function(x,y){
	num = 0;
	
	y_minus_1 = (y - 1 >= 0) ? y - 1 : this.m_numRowCol - 1;
	if(this.m_table[x][y_minus_1]){
		num++;
	}
	
	y_plus_1 = (y + 1 < this.m_numRowCol) ? y + 1 : 0;
	if(this.m_table[x][y_plus_1]){
		num++;
	}
	
	if(this.m_table[x][y]){
		num++;
	}
	
	return num;
};