import { Point, Transform, Size } from '../shared-models/calculation-models'

export class FanCalculator {
	containerSize: Size;
	cardSize: Size = {
		width: 150,
		height: 200
	}
	total: number = 54;

	setContainerSize(size: Size) {
		this.containerSize = size;
		let w = Math.max(20, Math.min(this.containerSize.width, this.containerSize.height) - 40);
		this.cardSize = {
			width: w / 2 * 0.75,
			height: w / 2
		};
	}

	calculatePosition(i: number, count: number) : Point {
		return null;
	}

	calculateStyle(i: number, count: number, fanAngle: number, initOnly: boolean = false, animationDuration: number = 0) : object
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
			'transform': 'unset',
			'transition': 'unset'
		};

		if (!initOnly) {
			let rotationX = i * fanAngle / count;
			ret.transform = `rotate(${rotationX}deg)`;
		}

		if(animationDuration > 0) {
			ret.transition = `all ${animationDuration}s`;
		}

		return ret;
	}
}