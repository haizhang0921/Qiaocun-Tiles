function ShapeLinearGradient(options){
	this.options = options;
	this.linear = function(t){
		if(this.shapes.length<2){
			return null;
		}
		var positions1 = this.shapes[0];
		var polygon1 = turf.polygon(positions1);
		var centroid1 = turf.centroid(polygon1);
		var positions2 = this.shapes[1];
		var polygon2 = turf.polygon(positions2);
		var centroid2 = turf.centroid(polygon2);
		
	}
}