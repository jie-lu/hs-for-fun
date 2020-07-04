import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Rect, Point } from '../shared-models/calculation-models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-card-back-maker',
  templateUrl: './card-back-maker.component.html',
  styleUrls: ['./card-back-maker.component.less']
})
export class CardBackMakerComponent implements OnInit {

  constructor(private domSantitizer: DomSanitizer) { }

  @ViewChild('image', {static: true})
  image: ElementRef<HTMLImageElement>;

  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('selectionCanvas', { static: true }) 
  selectionCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('selectionRect', { static: false }) 
  imageSelection: ElementRef<HTMLImageElement>;

  @ViewChild('fileInput', {static: true})
  fileInput: ElementRef<HTMLInputElement>;

  @Output() 
  imageGenerated = new EventEmitter<string[]>();

  private ctx: CanvasRenderingContext2D;
  private selectionCtx: CanvasRenderingContext2D;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    this.selectionCtx = this.selectionCanvas.nativeElement.getContext('2d');
    this.selectionCtx.imageSmoothingEnabled = true;
    this.selectionCtx.imageSmoothingQuality = 'high';
  }

  selectImage() {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event) {
    if(event.target.files.length == 0) return;

    let fileReader = new FileReader();
    fileReader.onloadend = () => {
      this.image.nativeElement.src = <string>(fileReader.result);
    };
    fileReader.readAsDataURL(event.target.files[0]);
  }

  onImageLoad(event) {
    const maxSize = 1024;
    let canvasW = this.image.nativeElement.width;
    let canvasH = this.image.nativeElement.height;
    const ratio = canvasH/ canvasW;
    if(canvasH > maxSize || canvasW > maxSize) {
      if(canvasW > canvasH) {
        canvasW = maxSize;
        canvasH = canvasW * ratio;
      } else {
        canvasH = maxSize;
        canvasW = canvasH / ratio;
      }
    }
    this.canvas.nativeElement.width = canvasW;
    this.canvas.nativeElement.height = canvasH;

    console.log('image size:', this.image.nativeElement.width, this.image.nativeElement.height);
    console.log('canvas size:', this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.ctx.drawImage(this.image.nativeElement, 0, 0,
      this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let images = [];
    const count = 54;
    const angleOffset = 90 * Math.PI/180;
    const direction = -1;
    for(let i = 0; i < count; i++) {
      const imgDataURL = this.getImageFromCenter(direction * (360.0 / count) * i * Math.PI/180 + angleOffset);
      images.push(imgDataURL);
    }
    this.imageGenerated.emit(images);
    //this.imageSelection.nativeElement.src = imgDataURL;
  }

  getElementRect(el: HTMLElement): Rect {
    const rect = el.getBoundingClientRect();
  
    return {
      x: rect.left + window.pageXOffset,
      y: rect.top + window.pageYOffset,
      width: rect.width,
      height: rect.height,
    };
  }

  getImage(angle: number, pivotPoint: Point, selectionRect: Rect): string {
    this.ctx.save();
    this.ctx.translate(pivotPoint.x, pivotPoint.y);
    this.ctx.rotate(angle);
    this.ctx.translate(-pivotPoint.x, -pivotPoint.y);
    this.ctx.drawImage(this.image.nativeElement, 0, 0,
      this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.ctx.restore();

    const selectedImageData = this.ctx.getImageData(selectionRect.x, selectionRect.y, 
      selectionRect.width, selectionRect.height);
    this.selectionCanvas.nativeElement.width = selectionRect.width;
    this.selectionCanvas.nativeElement.height = selectionRect.height;
    this.selectionCtx.putImageData(selectedImageData, 0, 0);
    return this.selectionCanvas.nativeElement.toDataURL('image/png');
  }

  getImageFromCenter(angle: number): string {
    const pivotPoint = {
      x: this.canvas.nativeElement.width / 2,
      y: this.canvas.nativeElement.height / 2,
    }
    const canvasMinSize = Math.min(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const h = canvasMinSize / 2;
    const w = h * 0.75;
    const selectionRect = {
      x: this.canvas.nativeElement.width / 2 - w / 2,
      y: this.canvas.nativeElement.height / 2 - h,
      width: w,
      height: h,
    }

    return this.getImage(angle, pivotPoint, selectionRect);
  }

  transformImageRadian(angle: number) {
    const selectionRect = this.getElementRect(this.imageSelection.nativeElement);
    const canvasRect = this.getElementRect(this.canvas.nativeElement);
    const selectionRectInCanvas = {
      x: selectionRect.x - canvasRect.x,
      y: selectionRect.y - canvasRect.y,
      width: selectionRect.width,
      height: selectionRect.height,
    }
    const pivotPoint = {
      x: selectionRect.x - canvasRect.x + selectionRect.width / 2,
      y: selectionRect.y - canvasRect.y + selectionRect.height,
    };

    console.log(selectionRect, canvasRect, pivotPoint);

    //this.imageSelection.nativeElement.src = this.getImage(angle, pivotPoint, selectionRectInCanvas);
    this.imageSelection.nativeElement.src = this.getImageFromCenter(angle);
  }

  transformImageDegree(angle: number) {
    const radian = angle * Math.PI / 180;
    this.transformImageRadian(radian);
  }
}
