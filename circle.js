const distanceBetween = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1-y2, 2));
class Circle {
	constructor (x = 0, y = 0, radius = 1) {
		this.x = x;
		this.y = y;
		this.radius = radius;
	}
	get origin () {
		return {x: this.x, y:this.y};
	}
	pointAtDegree(degrees) {
		return this.pointAtRadians(degrees * Math.PI/180);
	}
	pointAtRadians(radians) {
		let x = Math.sin(radians) * this.radius;
		let y = Math.cos(radians) * this.radius;
		return {x, y};
	}
	area() {
		return Math.PI * this.radius * this.radius;
	}
	areaDegree(degrees) {
		return this.area() * degrees/360;
	}
	areaRadians(radians) {
		return this.area() * radians/(2 * Math.PI);
	}
	colliding(c) {
		if (!(c instanceof Circle)) throw new Error("Cannot calculate distance between this and non-circle");
		return distanceBetween(c.x, c.y, this.x, this.y) < (this.radius + c.radius);
	}
	circumference () {
		return Math.PI * 2 * this.radius
	}
	circumferenceDegree (degrees) {
		return this.circumference() * degrees/360;
	}
	circumferenceRadians (radians) {
		return this.circumference() * radians/ (2 * Math.PI);
	}
	isUnitCircle () {
		return this.x === 0 && this.y === 0 && this.radius === 1;
	}
	isWithin(x, y) {
		return distanceBetween(this.x, this.y, x, y) < this.radius;
	}
	isOn(x, y) {
		return distanceBetween(this.x, this.y, x, y) === this.radius;
	}
	isOutside(x,y) {
		return distanceBetween(this.x, this.y, x, y) > this.radius;
	}
	toEquation () {
		return `(x-${this.x})^2 + (y-${this.y})^2 = ${this.radius}^2`
	}
	tangentCircleDegrees (degrees, radius=1) {
		let finder = new Circle(this.x, this.y, this.radius + radius);
		let center = finder.pointAtDegree(degrees);
		return new Circle(center.x, center.y, radius);
	}
}

module.exports = Circle;