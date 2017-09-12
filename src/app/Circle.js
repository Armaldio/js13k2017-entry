export default class Circle
{
	constructor (radius) {
		this.radius = radius;
		this.x      = 0;
		this.y      = 0;
	}

	intersectsWithCircle (circle) {
		let distanceX = this.x - circle.x;
		let distanceY = this.y - circle.y;
		let radiusSum = circle.radius + this.radius;
		return distanceX * distanceX + distanceY * distanceY <= radiusSum * radiusSum;
	}
};