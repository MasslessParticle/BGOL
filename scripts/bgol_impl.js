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
 * BGOL constructor. Takes div where canvas will be located.
 */
BGOL = function(div){
	this.__init__(div);
};

// BGOL Defaults
BGOL.NUM_ROW_COL = 100;
BGOL.DEFAULT_WIDTH = 600;
BGOL.DEFAULT_HEIGHT = 600;

/**
 * Creates a new canvas and gamesurface at div
 */
BGOL.prototype.__init__ = function(div){
	this.m_div = div;
	this.createCanvas(div);
	this.createGameSurface();
};

/**
 * Creates the game surface
 */
BGOL.prototype.createGameSurface = function(){
	this.m_gameSurface = new GameSurface(BGOL.NUM_ROW_COL, this.m_canvas_);
	this.m_gameSurface.draw();
};

/**
 * Stops the timer and creates a new game surface
 */
BGOL.prototype.reset = function() {
	this.stop();
	this.__init__(this.m_div);
};

/**
 * Starts the timer to update the board.
 */
BGOL.prototype.start = function(){
	thisObject = this;
	this.m_gameSurface.update();
	this.timer = setTimeout(function(){thisObject.start();}, 100);
};

/**
 * Stops the timer.
 */
BGOL.prototype.stop = function(){
	clearTimeout(this.timer);
};

/**
 * populates the game board with a random array of life
 */
BGOL.prototype.random = function(){
	this.m_gameSurface.populateGrid();
};

/**
 * creates the drawing canvas
 * @param div the div where the canvas is located in the html page
 */
BGOL.prototype.createCanvas = function(div) {
	div.innerHTML = "";

	// If the div isn't already sized then inherit from our attrs or
	// give it a default size.
	if (div.style.width == '') {
		div.style.width = BGOL.DEFAULT_WIDTH + "px";
	}

	if (div.style.height == '') {
		div.style.height = BGOL.DEFAULT_HEIGHT + "px";
	}

	this.m_width_ = parseInt(div.style.width, 10);
	this.m_height_ = parseInt(div.style.height, 10);
	// The div might have been specified as percent of the current window size,
	// convert that to an appropriate number of pixels.
	if (div.style.width.indexOf("%") == div.style.width.length - 1) {
		this.m_width_ = div.offsetWidth;
	}
	if (div.style.height.indexOf("%") == div.style.height.length - 1) {
		this.m_height_ = div.offsetHeight;
	}

	// Create the canvas for interactive parts of the chart.
	this.m_canvas_ = document.createElement("canvas");
	this.m_canvas_.style.position = "absolute";
	this.m_canvas_.width = this.m_width_;
	this.m_canvas_.height = this.m_height_;
	
	

	// The interactive parts of the graph are drawn on top of the chart.
	div.appendChild(this.m_canvas_);
};