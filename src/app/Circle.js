/**
 * Circle class
 * For the ball
 */
export default class Circle
{
	constructor (radius) {
		this.radius = radius;
		this.x      = 0;
		this.y      = 0;
	}

	/**
	 * Check if a circle intersect with this circle
	 * the mouse ball and the moving ball
	 * @param circle
	 * @returns {boolean}
	 */
	intersectsWithCircle (circle) {
		let distanceX = this.x - circle.x;
		let distanceY = this.y - circle.y;
		let radiusSum = circle.radius + this.radius;
		return distanceX * distanceX + distanceY * distanceY <= radiusSum * radiusSum;
	}
};