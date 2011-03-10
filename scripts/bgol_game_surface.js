/**
 * Copyright 2011 Travis Patterson
 *  
 * This file is part of BGOL.
 * 
 * BGOL is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * BGOL is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with BGOL.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Creates a new game surface. Takes size of game board and the canvas to
 * draw on
 */
GameSurface = function(numRowCol, canvas){
	this.m_canvas = canvas;
	this.m_numRowCol = numRowCol; 
	this.m_table = this.generateGrid();
	
	var x_step = canvas.width / this.m_numRowCol;
	var y_step = canvas.height / this.m_numRowCol;
	var game_surface = this;
	var x = null;
	var y = null;
	
	//Mouse down listener, adds/removes life
	canvas.onmousedown = function(e) {
	    x = e.clientX - game_surface.m_canvas.offsetLeft;
	    y = e.clientY - game_surface.m_canvas.offsetTop;
	    cellX = Math.floor(x / x_step);
	    cellY = Math.floor(y / y_step);
	    game_surface.m_table[cellX][cellY] = !game_surface.m_table[cellX][cellY];
	    game_surface.draw();
	};
	
	//Allows "paintin" of life on the canvas
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
  	
  	//Resets mouse environment.
  	canvas.onmouseup = function(e) {
  		x = null;
  		y = null;
  	};
};

/**
 * Draws the game surface.
 */
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

/**
 * Creates a new, empty, game representation
 * @returns {Array} game representation
 */
GameSurface.prototype.generateGrid = function(){
	var grid = new Array(this.m_numRowCol);
	for (i = 0; i < grid.length; i++){
		grid[i] = new Array(this.m_numRowCol);
	}
	return grid;
};

/**
 * Populates a game representation with a random assortment of life
 */
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

/**
 * Applies the rules from Conway's Game of Life to the board
 * to determine next generation.
 */
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

/**
 * Checks to see if a cell is alive or not.
 * @param x X coordinate of cell on gameboard
 * @param y Y coordinate of cell on gameboard
 * @returns True if this cell contains life
 */
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

/**
 * Determines the number of neighbour cells to x,y is alive
 * @param x X coordinate of cell on gameboard
 * @param y Y coordinate of cell on gameboard
 * @returns number of living cells surrounding x,y
 */
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