import { Point, Transform, Size } from '../shared-models/calculation-models'

export class FanCalculator {
	fanAngle : number = 360;
	containerSize: Size;
	cardSize: Size = {
		width: 150,
		height: 200
	}
	total: number = 54;

	calculatePosition(i: number, count: number) : Point {
		return null;
	}

	calculateTransform(i: number, count: number, initOnly: boolean = false) : object
	{
		let ret = {
			'width': `${this.cardSize.width}px`,
			'height': `${this.cardSize.height}px`,
			'position': 'absolute',
			'top': '50%',
			'left': '50%',
			'margin-left': `${-this.cardSize.width / 2}px`,
			'margin-top': `${-this.cardSize.height}px`,
			'transform-origin': 'center bottom',
			'transform': 'unset'
		};

		if (!initOnly) {
			let rotationX = i * this.fanAngle / count;
			ret.transform = `rotate(${rotationX}deg)`;
		}

		return ret;
	}
}