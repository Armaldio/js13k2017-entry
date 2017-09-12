export default class Square
{
	constructor (width, height = null) {
		this.width  = width;
		this.height = height === null ? width : height;
		this.x      = 0;
		this.y      = 0;
		this.opacity = 0;
	}

	/**
	 * z1 z2 ************
	 *       *          *
	 *       *          *
	 *       ************ z3 z4
	 */

	get z1 () {
		return this.x;
	}

	get z2 () {
		return this.y;
	}

	get z3 () {
		return this.x + this.width;
	}

	get z4 () {
		return this.y + this.height;
	}

	overlapWithCircle (circle) {
		/*console.log("Square : ", this);
		console.log("Circle : ", circle);*/

		const distX = Math.abs(circle.x - this.x - this.width / 2);
		const distY = Math.abs(circle.y - this.y - this.height / 2);

		if (distX > (this.width / 2 + circle.radius)) {
			return false;
		}
		if (distY > (this.height / 2 + circle.radius)) {
			return false;
		}

		if (distX <= (this.width / 2)) {
			return true;
		}
		if (distY <= (this.height / 2)) {
			return true;
		}

		const dx = distX - this.width / 2;
		const dy = distY - this.height / 2;
		return (dx * dx + dy * dy <= (circle.radius * circle.radius));
	}
};