function Bomber(x, y, id)
{
	objedex.bombers.add(this);
	this.id = id;
	
	this.x = x * SCALE + (SCALE / 2);
	this.y = y * SCALE + (SCALE / 2);
	
	this.tile = stage.tiles[x][y];
	this.tile.removeBomber(this);
	this.tile.addBomber(this);
	
	this.radius = SCALE / 2.5;
	
	this.speed = 1 / 6;
	this.bombcount = 2;
	this.bombpower = 2;
	
	this.controlscheme = Bomber.controlschemes[id];
	this.color = Bomber.colors[id];
}

Bomber.prototype.reconnectTile = function()
{
	var north = pixel2tile(this.getNorthestPosition());
	var south = pixel2tile(this.getSouthestPosition());
	var east = pixel2tile(this.getEastestPosition());
	var west = pixel2tile(this.getWestestPosition());
	
	stage.tiles[east][north].bombers[this.id] = this;
	stage.tiles[east][south].bombers[this.id] = this;
	stage.tiles[west][north].bombers[this.id] = this;
	stage.tiles[west][south].bombers[this.id] = this;
}

Bomber.prototype.collectPowerups = function()
{
	var x = pixel2tile(this.x);
	var y = pixel2tile(this.y);
	
	if(stage.tiles[x][y].hasPowerup())
	{
		this.apply(stage.tiles[x][y].getPowerup())
	}
}

Bomber.prototype.getNorthestPosition = function() {return this.y - this.radius;}
Bomber.prototype.getSouthestPosition = function() {return this.y + this.radius;}
Bomber.prototype.getEastestPosition = function() {return this.x + this.radius;}
Bomber.prototype.getWestestPosition = function() {return this.x - this.radius;}

var wallish = 4.7;

Bomber.prototype.moveNorth = function(delta)
{
	var step = tile2pixel(this.speed);
	
	var x1 = pixel2tile(this.getEastestPosition());
	var x2 = pixel2tile(this.getWestestPosition());
	var y = pixel2tile(this.getNorthestPosition() - step);
	
	if(stage.tiles[x1][y].isWalkable(this)
	&& stage.tiles[x2][y].isWalkable(this))
	{
		this.y -= step;
		this.reconnectTile();
		this.collectPowerups();
	}
	else
	{
		this.y = tile2pixel(y+1) + Math.floor(SCALE / 2) - wallish;
	}
}

Bomber.prototype.moveSouth = function(delta)
{
	var step = (this.speed * SCALE);
	
	var x1 = pixel2tile(this.getEastestPosition());
	var x2 = pixel2tile(this.getWestestPosition());
	var y = pixel2tile(this.getSouthestPosition() + step);
	
	if(stage.tiles[x1][y].isWalkable(this)
	&& stage.tiles[x2][y].isWalkable(this))
	{
		this.y += step;
		this.reconnectTile();
		this.collectPowerups();
	}
	else
	{
		this.y = tile2pixel(y-1) + Math.ceil(SCALE / 2) + wallish;
	}
}

Bomber.prototype.moveEast = function(delta)
{
	var step = (this.speed * SCALE);
	
	var x = pixel2tile(this.getEastestPosition() + step);
	var y1 = pixel2tile(this.getNorthestPosition());
	var y2 = pixel2tile(this.getSouthestPosition());
	
	if(stage.tiles[x][y1].isWalkable(this)
	&& stage.tiles[x][y2].isWalkable(this))
	{
		this.x += step;
		this.reconnectTile();
		this.collectPowerups();
	}
	else
	{
		this.x = tile2pixel(x-1) + Math.ceil(SCALE / 2) + wallish;
	}
}

Bomber.prototype.moveWest = function(delta)
{
	var step = (this.speed * SCALE);
	
	var x = pixel2tile(this.getWestestPosition() - step);
	var y1 = pixel2tile(this.getNorthestPosition());
	var y2 = pixel2tile(this.getSouthestPosition());
	
	if(stage.tiles[x][y1].isWalkable(this)
	&& stage.tiles[x][y2].isWalkable(this))
	{
		this.x -= step;
		this.reconnectTile();
		this.collectPowerups();
	}
	else
	{
		this.x = tile2pixel(x+1) + Math.floor(SCALE / 2) - wallish;
	}
}

Bomber.prototype.dropBomb = function()
{
	if(this.bombcount > 0)
	{
		if(!stage.getTile(this.x, this.y).hasBomb())
		{
			this.bombcount--;
			
			stage.getTile(this.x, this.y).spawnBomb(this);
		}
	}
}

var MAX_BOMBCOUNT = 5;
var MAX_BOMBPOWER = 7;
var MAX_SPEED = 2 / 6;

Bomber.prototype.apply = function(powerup)
{
	if(powerup.type == "amount")
	{
		this.bombcount++;
		if(this.bombcount > MAX_BOMBCOUNT)
		{
			this.bombcount = MAX_BOMBCOUNT;
		}
	}
	else if(powerup.type == "power")
	{
		this.bombpower++;
	}
	else if(powerup.type == "speed")
	{
		this.speed += 1 / 24;
		
		if(this.speed > MAX_SPEED)
		{
			this.speed = MAX_SPEED;
		}
	}
}

Bomber.prototype.update = function(delta)
{
	if(this.status != "blownup")
	{
		if(Keystate.get(this.controlscheme["move east"])) {this.moveEast(delta);}
		else if(Keystate.get(this.controlscheme["move west"])) {this.moveWest(delta);}
		
		if(Keystate.get(this.controlscheme["move south"])) {this.moveSouth(delta);}
		else if(Keystate.get(this.controlscheme["move north"])) {this.moveNorth(delta);}
		
		if(Keystate.get(this.controlscheme["drop bomb"])) {this.dropBomb();}
	}
}

Bomber.prototype.render = function(camera)
{
	var rendering = {};
	
	if(this.status != "blownup")
	{
		rendering.type = "image";
		rendering.source = "images/" + this.color + ".png";
		rendering.x = this.x - camera.x;
		rendering.y = this.y - camera.y;
		//rendering.width = 38;
		//rendering.height = 38;
	}
	
	return rendering;
}

Bomber.controlschemes = {
	"alpha": {
		"move north": "up arrow",
		"move south": "down arrow",
		"move west": "left arrow",
		"move east": "right arrow",
		"drop bomb": "ctrl"
	},
	"theta": {
		"move north": "w",
		"move south": "s",
		"move west": "a",
		"move east": "d",
		"drop bomb": "e"
	},
	"sigma": {
		"move north": "i",
		"move south": "k",
		"move west": "j",
		"move east": "l",
		"drop bomb": "o"
	},
	"omega": {
		"move north": "t",
		"move south": "g",
		"move west": "f",
		"move east": "h",
		"drop bomb": "y"
	},
};

Bomber.colors = {
	"alpha": "red",
	"theta": "green",
	"sigma": "yellow",
	"omega": "blue"
}