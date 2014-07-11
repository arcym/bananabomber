function Stage()
{
	this.WIDTH = 16;
	this.HEIGHT = 9;
	
	this.tiles = new Array();
	
	for(var x = 0; x < this.WIDTH; x++)
	{
		var tiles = new Array();
		
		for(var y = 0; y < this.HEIGHT; y++)
		{
			var tile = new Tile("wall", {x: x, y: y});
			
			if(x == 0 || y == 0
			|| x == this.WIDTH - 1
			|| y == this.HEIGHT - 1)
			{
				tile.type = "wall";
			}
			else if(x % 2 == 1 || y % 2 == 1)
			{
				tile.type = "crate";
			}
			
			tiles.push(tile);
		}
		
		this.tiles.push(tiles);
	}
	
	for(var x = 0; x < this.WIDTH; x++)
	{
		for(var y = 0; y < this.HEIGHT; y++)
		{
			if(x > 0)
			{
				this.tiles[x][y].west = this.tiles[x-1][y];
			}
			if(x < this.WIDTH - 1)
			{
				this.tiles[x][y].east = this.tiles[x+1][y];
			}
			if(y > 0)
			{
				this.tiles[x][y].north = this.tiles[x][y-1];
			}
			if(y < this.HEIGHT - 1)
			{
				this.tiles[x][y].south = this.tiles[x][y+1];
			}
		}
	}
}

Stage.prototype.clear = function(x, y)
{
	this.tiles[x][y].clear("all", 2);
}