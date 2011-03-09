BGOL = function(div){
	this.__init__(div);
};

BGOL.NUM_ROW_COL = 100;
BGOL.DEFAULT_WIDTH = 600;
BGOL.DEFAULT_HEIGHT = 600;

BGOL.prototype.__init__ = function(div){
	this.m_div = div;
	this.createCanvas(div);
	this.createGameSurface();
};

BGOL.prototype.createGameSurface = function(){
	this.m_gameSurface = new GameSurface(BGOL.NUM_ROW_COL, this.m_canvas_);
	this.m_gameSurface.draw();
};

BGOL.prototype.reset = function() {
	this.stop();
	this.__init__(this.m_div);
};

BGOL.prototype.start = function(){
	thisObject = this;
	this.m_gameSurface.update();
	this.timer = setTimeout(function(){thisObject.start();}, 100);
};

BGOL.prototype.stop = function(){
	clearTimeout(this.timer);
};

BGOL.prototype.random = function(){
	this.m_gameSurface.populateGrid();
};

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