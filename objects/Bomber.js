function Bomber(x, y, id)
{
	objedex.bombers.add(this);
	
	this.x = x * SCALE + (SCALE / 2);
	this.y = y * SCALE + (SCALE / 2);
	
	
	this.speed = 1.5;
	this.bombcount = 2;
	this.bombpower = 2;
	
	this.id = id;
	this.controlscheme = Bomber.controlschemes[id];
	this.color = Bomber.colors[id];
}

Bomber.prototype.moveNorth = function(delta)
{
	var x = this.x;
	var y = this.y - (this.speed * SCALE * delta) - (SCALE / 4);
	
	if(stage.getTile(x, y).type == "floor")
	{
		this.y -= this.speed * SCALE * delta;
		
		if(stage.getTile(x, y).powerup)
		{
			var powerup = stage.getTile(x, y).powerup;
			stage.getTile(x, y).powerup = undefined;
			this.apply(powerup);
		}
	}
}

Bomber.prototype.moveSouth = function(delta)
{
	var x = this.x;
	var y = this.y + (this.speed * SCALE * delta) + (SCALE / 4);
	
	if(stage.getTile(x, y).type == "floor")
	{
		this.y += this.speed * SCALE * delta;
		
		if(stage.getTile(x, y).powerup)
		{
			var powerup = stage.getTile(x, y).powerup;
			stage.getTile(x, y).powerup = undefined;
			this.apply(powerup);
		}
	}
}

Bomber.prototype.moveWest = function(delta)
{
	var x = this.x - (this.speed * SCALE * delta) - (SCALE / 4);
	var y = this.y;
	
	if(stage.getTile(x, y).type == "floor")
	{
		this.x -= (this.speed * SCALE * delta);
		
		if(stage.getTile(x, y).powerup)
		{
			var powerup = stage.getTile(x, y).powerup;
			stage.getTile(x, y).powerup = undefined;
			this.apply(powerup);
		}
	}
}

Bomber.prototype.moveEast = function(delta)
{
	var x = this.x + (this.speed * SCALE * delta) + (SCALE / 4);
	var y = this.y;
	
	if(stage.getTile(x, y).type == "floor")
	{
		this.x += this.speed * SCALE * delta;
		
		if(stage.getTile(x, y).powerup)
		{
			var powerup = stage.getTile(x, y).powerup;
			stage.getTile(x, y).powerup = undefined;
			this.apply(powerup);
		}
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

Bomber.prototype.apply = function(powerup)
{
	if(powerup.type == "amount")
	{
		this.bombcount++;
	}
	else if(powerup.type == "power")
	{
		this.bombpower++;
	}
	else if(powerup.type == "speed")
	{
		this.speed++;
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
		rendering.type = "rectangle";
		rendering.x = SCREEN_WIDTH*SCALE / 2;
		rendering.y = SCREEN_HEIGHT*SCALE / 2;
		rendering.x = this.x - camera.x;
		rendering.y = this.y - camera.y;
		rendering.width = SCALE - 5;
		rendering.height = SCALE - 5;
		rendering.fillStyle = this.color;
		rendering.cornerRadius = SCALE / 10;
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