function Objedex(object)
{
	for(var s in object)
	{
		this[object[s]] = new ObjedexEntry()
	}
}

function ObjedexEntry()
{
	this.objid = 0;
	this.stuff = {};
}

ObjedexEntry.prototype.add = function(stuff)
{
	var objid = this.objid++;
	this.stuff[objid] = stuff;
	stuff.objid = objid;
}

ObjedexEntry.prototype.remove = function(stuff)
{
	var objid = stuff.objid;
	delete this.stuff[objid];
}

ObjedexEntry.prototype.size = function()
{
	return Object.keys(this.stuff).length;
}

ObjedexEntry.prototype.foreach = function(func)
{
	for(var s in this.stuff)
		func(this.stuff[s])
}

ObjedexEntry.prototype.update = function(delta)
{
	this.foreach(function(stuff)
	{
		stuff.update(delta);
	});
}

ObjedexEntry.prototype.render = function(stuff)
{
	stuff = stuff || this.stuff;
	
	if(stuff.render)
	{
		var rendering = stuff.render();
		$("canvas").draw(rendering);
	}
	else
	{
		for(var s in stuff)
			this.render(stuff[s]);
	}
}