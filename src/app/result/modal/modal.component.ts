import { Component, OnInit, ViewChild, Input, ElementRef} from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultComponent } from '../result.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() public name;
  constructor(private http: HttpClient){}

  ngOnInit(): void {
  }
  is_correct=true;
  show:boolean=true;
  ask_user=true;
  displayclass=true;
  show_thanks=false;
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

  image: any;
  className: any = null;
  pathHistory:any;
  radioChangeHandler (event: any) {
    this.className= event;
  }

  radioSelect(){
    console.log(this.image);
    console.log(this.className);
    console.log(this.pathHistory);
    this.saveImage();
    this.show_thanks=true;
  }

  saveImage(){
    if (this.className === null){
      console.log('Not Updated!');
      return;
    }
    console.log(this.pathHistory.length);
    var date = Date.now();
    // 'Sun' + '_' + '2021-02-07_.........' + '.png' -> 'Sun_2021-02-07_......png'
    var filename  = this.className + '_' + date + '.png';
    this.http.post(
      environment.SERVER_URL + '/upload_pred',
      {filename, image:this.image, className: this.className, path: this.pathHistory,iscorrect:false}, 
      {responseType: 'text'}
    ).subscribe((res: any) => {
      console.log(res, this.className)
    })
    console.log(this.pathHistory.length);
  }

  Yes()
  {
    this.is_correct=true;
    this.ask_user=false;
    this.className=this.name;
    console.log(this.pathHistory.length);
    var date = Date.now();
    // 'Sun' + '_' + '2021-02-07_.........' + '.png' -> 'Sun_2021-02-07_......png'
    var filename  = this.className + '_' + date + '.png';
    this.http.post(
      environment.SERVER_URL + '/upload_pred',
      {filename, image:this.image, className: this.className, path: this.pathHistory, iscorrect:true}, 
      {responseType: 'text'}
    ).subscribe((res: any) => {
      console.log(res, this.className)
    })
    console.log(this.pathHistory.length);
  
  }
  No()
  {
    this.is_correct=false;
    this.ask_user=false;
  }
}
