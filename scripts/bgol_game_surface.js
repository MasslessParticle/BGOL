GameSurface = function(numRowCol, canvas){
	this.m_canvas_ = canvas;
	this.m_numRowCol = numRowCol; 
	this.m_table_ = this.generateGrid();
	this.populateGrid(this.m_table_);
};

GameSurface.prototype.draw = function(){
	var x_step = this.m_canvas_.width / this.m_numRowCol;
	var y_step = this.m_canvas_.height / this.m_numRowCol;
	var x = 0;
	var y = 0;
	
	context = this.m_canvas_.getContext("2d");
	
	context.clearRect(0,0,this.m_canvas_.width, this.m_canvas_.height);
	context.strokeRect(0,0,this.m_canvas_.width, this.m_canvas_.height);
	
	for (i=0; i < this.m_numRowCol; i++){
		for (j=0; j < this.m_numRowCol; j++){
			if (this.m_table_[i][j]){
				context.fillRect(x,y,x_step,y_step);
			} 
			//else {
			//	context.strokeStyle = "#eee";
			//	context.strokeRect(x,y,x_step,y_step);
			//}
			
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

GameSurface.prototype.populateGrid = function(grid){
	for(i = 0; i < grid.length; i++){
		for (j = 0; j < grid[i].length; j++){
			var num = Math.floor(Math.random()*2);
			grid[i][j] = num;
		}
	}
	return grid;
};

GameSurface.prototype.update = function(){
	newState = this.generateGrid();	
	
	for(i = 0; i < this.m_numRowCol; i++){
		for (j = 0; j < this.m_numRowCol; j++){
			newState[i][j] = this.checkCoord(i, j);
		}
	}
	
	this.m_table_ = newState;
	this.draw();
};

GameSurface.prototype.checkCoord = function(x, y){
	numNeighbours = 0;
	numNeighbours = this.countNeighbours(x,y);
	
	if(this.m_table_[x][y] && (numNeighbours < 2 || numNeighbours > 3)){
			return false;
	}
	
	if(!this.m_table_[x][y] && numNeighbours == 3){
		return true;
	}
	
	return this.m_table_[x][y];
};

GameSurface.prototype.countNeighbours = function(x, y) {
	num = 0;
	
	if ((x - 1) >= 0){
		num += this.countY(x - 1, y);
	}
	
	if((x + 1) < this.m_numRowCol){
		num += this.countY(x + 1, y);
	}
	
	num += this.countY(x, y);
	
	if(this.m_table_[x][y]){
		num--;
	}
			
	return num;
};

/**
 * counts all true y values for a given column
 */
GameSurface.prototype.countY = function(x,y){
	num = 0;
	
	if((y - 1) >= 0 && this.m_table_[x][y-1]){
		num++;
	}
	
	if((y + 1) < this.m_numRowCol && this.m_table_[x][y+1]){
		num++;
	}
	
	if(this.m_table_[x][y]){
		num++;
	}
	
	return num;
};