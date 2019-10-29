export interface Point {
	x: number,
	y: number
}

export interface Transform {
	rotationX: number
}

export interface Size {
	width: number,
	height: number
}

export class HandContainerCalculator {
	// Settings for calculating card position.
	curveAngle: number = 20; // 20 degree
	maxCards: number = 10; // max number of cards
	cardSize: Size = {
	  width: 150,
	  height: 200
	};
	containerSize: Size;
	cardMarginX = 10;

	private toRadian (degree) {
		return degree * Math.PI / 180;
	};

	calculatePosition(i: number, count: number) : Point {
		let avgCardWidth:number = this.containerSize.width / count;
		let cardAngle: number = avgCardWidth >= this.cardSize.width
								? 0
								: (i + 1 - count / 2) * (this.curveAngle / this.maxCards);
		let left: number, top: number;
		if (this.cardSize.width * count <= this.containerSize.width) {
		  left = i * (this.cardSize.width + this.cardMarginX);
		}
		else {
		  left = i * (this.containerSize.width - this.cardSize.width) / (count - 1);
		}
		if (cardAngle === 0) {
		  top = 0;
		}
		else {
		  let raduis: number = this.containerSize.width / 2 / Math.sin(this.toRadian(this.curveAngle) / 2);
		  top = raduis / Math.cos(this.toRadian(cardAngle)) - raduis;
		}
		return {
		  x: left,
		  y: top
		};
	}

	calculateTransform(i: number, count: number) : Transform
	{
		let visibleCardWidth = this.containerSize.width / count;

		if(visibleCardWidth >= this.cardSize.width) {
			return {
				rotationX: 0
			};
		}

		let rotationX = (i + 1 - count / 2) * (this.curveAngle / this.maxCards);

		return {
			rotationX: rotationX
		}	
	}
}