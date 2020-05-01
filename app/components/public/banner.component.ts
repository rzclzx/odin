// BY zhangfei
import { Component,OnInit,ViewChild,Input,EventEmitter,Output,OnChanges } from "@angular/core";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";
import "../../resources/request.js";
declare var profiles;
declare var require;
@Component({
	selector: "ng-banner",
	template: `
        <div class="ng2-modal-header">
            <div class="width3 height18 bgc-blue4 ml20"></div> 
            <div *ngIf="creative.type === '0'" class="ml10 font16 font-bold color-gray5">图片素材</div>  
            <div *ngIf="creative.type === '1'" class="ml10 font16 font-bold color-gray5">视频素材</div>  
            <div *ngIf="creative.type === '2'" class="ml10 font16 font-bold color-gray5">原生素材</div>  
            <span class="icon-delete2 font20 ml560 color-gray5 pointer" (click)="closeBanner()"></span> 
        </div>
        <div *ngIf="creative.type === '0'" class='mymodal-content flex-between-center'>
            <img src="{{ l }}" class="pointer" (click)="goLeft()">
            <div *ngFor="let v of creative.creatives;let i = index" [class.dispaly-none]="i !== count">
                <div class="textcenter color-gray5 font-bold">{{ v.name }}</div>
                <div class="flex-center min-height300 width-100">                   
                    <img src="{{ v.path }}" class="max-width500 mtb20">                  
                </div>
                <div class="textcenter color-gray5 font-bold font12">{{ (count + 1) + " / " + Length }}</div>
            </div>           
            <img src="{{ r }}" class="pointer" (click)="goRight()">
        </div>
        <div *ngIf="creative.type === '1'" class='mymodal-content flex-between-center'>
            <img src="{{ l }}" class="pointer" (click)="goLeft()">
            <div *ngFor="let v of creative.creatives;let i = index" [class.dispaly-none]="i !== count">
                <div class="textcenter color-gray5 font-bold">{{ v.name }}</div>
                <div class="flex-center min-height300 width-100">
                    <video src="{{ v.path }}" controls="controls" class="max-width500 mtb20"></video>                 
                </div>
                <div class="textcenter color-gray5 font-bold font12">{{ (count + 1) + " / " + Length }}</div>
            </div>           
            <img src="{{ r }}" class="pointer" (click)="goRight()">
        </div>
        <div *ngIf="creative.type === '2'" class='mymodal-content flex-between-center'>
            <img src="{{ l }}" class="pointer" (click)="goLeft()">
            <div class="width500" *ngFor="let v of creative.creatives;let i = index" [class.dispaly-none]="i !== count">
                <div class="flex-between-center width-100">
                    <img *ngIf="v.iconPath" src="{{ v.iconPath }}" class="height80 width80">
                    <div class="width350 height80 line-height18">
                        <div cutString [cutLength]="35" class="color-gray5 font-bold">{{ v.title }}</div>
                        <div cutString [cutLength]="70" class="color-gray5 mt20 line-height20">{{ v.description }}</div>
                    </div>
                </div>
                <div class="flex-between-center min-height150">
                    <img *ngFor="let n of v.imagePaths;let j = index" src="{{ n }}" class="max-width100">           
                </div>
                <div class="textcenter color-gray5 font-bold font12">{{ (count + 1) + " / " + Length }}</div>
            </div>           
            <img src="{{ r }}" class="pointer" (click)="goRight()">
        </div>
    `
})

export class BannerComponent implements OnInit {

    @Input() creative;

    @Output() close: EventEmitter<any> = new EventEmitter();

    private l = require("../../images/L.png");

    private r = require("../../images/R.png");

    private Length: number;

    private count: number = 0;

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
        private validationService: ValidationService,
        private myModalService: MyModalService
	) {}

	ngOnInit() {
        this.Length = this.creative.creatives.length;
	}
    // 右滚动
    private goRight(){
        if(this.count < this.Length - 1){
            this.count ++;
        }else{
            this.count = 0;
        }   
    }
    // 左滚动
    private goLeft(){
        if(this.count > 0){
            this.count --;
        }else{
            this.count = this.Length - 1;
        }
    }
    // 关闭
    private closeBanner(){
        this.close.emit();
    }
    
}