import { Component, OnInit, ViewChild, Input, ElementRef} from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-create-dataset',
  templateUrl: './create-dataset.component.html',
  styleUrls: ['./create-dataset.component.css']
})
export class CreateDatasetComponent implements OnInit {

  constructor(private http: HttpClient){}

  @ViewChild('myCanvas') public canvasEl: ElementRef;
  private ctx: CanvasRenderingContext2D;
  result = '';

  objects = [
    {
      objectId: 1,
      objectName: "Sun",
    },
    {
      objectId: 2,
      objectName: "Flower",
    },
    {
      objectId: 3,
      objectName: "Umbrella",
    },
    {
      objectId: 4,
      objectName: "Pencil",
    },
    {
      objectId: 5,
      objectName: "Spoon",
    },
    {
      objectId: 6,
      objectName: "Tree",
    },
    {
      objectId: 7,
      objectName: "Mug",
    },
    {
      objectId: 8,
      objectName: "House",
    },
    {
      objectId: 9,
      objectName: "Bird",
    },
    {
      objectId: 10,
      objectName: "Hand",
    }
  ];
  className: any = null;
  pathHistory = [];


  @Input() public width = 384;
  @Input() public height = 384;

  ngOnInit(): void {}

  public ngAfterViewInit() {
    const canvas: HTMLCanvasElement = this.canvasEl.nativeElement;
    this.ctx = canvas.getContext("2d")
    if (window.innerWidth < 480){
      canvas.width = 256;
      canvas.height = 256;
    }
    else{
      canvas.width = this.width;
      canvas.height = this.height;
    }
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000';
    this.captureEvents(canvas);

    window.addEventListener('resize', function(){
      console.log(window.innerHeight, window.innerWidth);
      if (window.innerWidth < 480){
        canvas.width = 256;
        canvas.height = 256;
      }
      else{
        canvas.width = 384;
        canvas.height = 384;
      }
    }, true); 
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.ctx) {
      return; }
      var t=[];
      t.push(prevPos.x);
      t.push(prevPos.y)
      this.pathHistory.push(t);
      console.log(this.pathHistory);
    this.ctx.beginPath();
    if (prevPos) {
      this.ctx.moveTo(prevPos.x, prevPos.y); // from
      this.ctx.lineTo(currentPos.x, currentPos.y);
      this.ctx.stroke();
    }
  }

  clearCanvas(){
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.pathHistory = [];
  }

  radioChangeHandler (event: any) {
    this.className= event;
  }
  radioSelect(){
    this.saveImage();
  }
  saveImage(){
    if (this.className === null){
      console.log('Not Updated!')
      return;
    }
    var canvas: HTMLCanvasElement = this.canvasEl.nativeElement;
    var date = Date.now();
    // 'Sun' + '_' + '2021-02-07_.........' + '.png' -> 'Sun_2021-02-07_......png'
    var filename  = this.className + '_' + date + '.png';
    var image = canvas.toDataURL("image/png");
    this.http.post(
      environment.SERVER_URL + '/upload_canvas',
      {filename, image, className: this.className, path: this.pathHistory}, 
      {responseType: 'text'}
    ).subscribe((res: any) => {
      console.log(res, this.className)
      this.clearCanvas();
    })
  }
  
}
