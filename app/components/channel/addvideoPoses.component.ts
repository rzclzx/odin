import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { CreativeSizeManagementService } from "../../services/creativeSizeManagement.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";

declare var $;
declare var require;
let path = require("./addvideoPoses.html");
let path1= require("./imageSize.less")

@Component({
	selector: "ng-addvideoPoses",
	template: path,
	styles:['path1']
})

export class AddvideoPosesComponent implements OnInit {
	private adtypeId:string;
	private adxId:number;
	private adxName:string;
	private code:string;
	private duration:string;
	private frameHeight:number;
	private id:number;
	private status:string;
	private frameWidth:number;
	private imageMaxVolume:number;
	private maxVolume:number;
	private name:string;
	private needImage:string;
	private videoFormats=[];
	private errorMessage;
	private adxs=[];
	private sizes=[];
	private mp4;
	private flv;
	private avi;
	private needImage1;
	private sizeId:number;
	public mainMenus = [
        {
            name: "渠道管理",
            value: undefined
        },
        {
            name: "创意规格管理",
            value: "/home/creativeSizeManagement/imageSize"
		},
		{
            name: "视频广告位",
            value: "/home/creativeSizeManagement/videoPoses"
		},
		{
            name: "新增",
            value: undefined
		}
    ];

	
	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private creativeSizeManagementService:CreativeSizeManagementService,
		private router:Router,
		private validationService:ValidationService,
		private myModalService:MyModalService,
	) {}

	ngOnInit() {
		  this.adxId=undefined;
			//查询渠道
			this.creativeSizeManagementService.adxs().subscribe(
				result => {
						this.adxs=result.body.items;
				},
				error => {
					//	this.myModalService.alert(error.message);
				}
			)
			//查询尺寸
			this.creativeSizeManagementService.sizelist().subscribe(
				result => {
						this.sizes=result.body.items;
						// console.log(this.sizes)
				},
				error => {
					//	this.myModalService.alert(error.message);
				}
			)
		}
		
	// 取消
	private  cancel(){
		this.router.navigate(["/home/creativeSizeManagement/videoPoses"]);
	}



	//保存
	save() {
		if(this.flv==true){
			this.videoFormats.push("33");
		}
		if(this.mp4==true){
			this.videoFormats.push("44");
		}
		if(this.avi==true){
			this.videoFormats.push("0");
		}
		if(this.needImage1==true){
			this.needImage="1"
		}else{
			this.needImage="0"
		}
		if(this.adxId==undefined &&　this.sizeId==undefined){
			if (this.validationService.validate()) {
				let options={
					// adxId:this.adxId,
					code:this.code,
					duration:this.duration,
					// sizeId:this.sizeId,
					imageMaxVolume:this.imageMaxVolume,
					maxVolume:this.maxVolume,
					name:this.name,
					needImage:this.needImage,
					videoFormats:this.videoFormats
				}
					this.creativeSizeManagementService.addvideoPoses(options).subscribe(
						result => {
								// console.log(result.body)
								this.router.navigate(["/home/creativeSizeManagement/videoPoses"]);
						},
						error => {
							//	this.myModalService.alert(error.message);
						}
					)
			}
		}else if(this.adxId != undefined &&　this.sizeId==undefined){
			if (this.validationService.validate()) {
				let options={
					adxId:this.adxId,
					code:this.code,
					duration:this.duration,
					// sizeId:this.sizeId,
					imageMaxVolume:this.imageMaxVolume,
					maxVolume:this.maxVolume,
					name:this.name,
					needImage:this.needImage,
					videoFormats:this.videoFormats
				}
					this.creativeSizeManagementService.addvideoPoses(options).subscribe(
						result => {
								// console.log(result.body)
								this.router.navigate(["/home/creativeSizeManagement/videoPoses"]);
						},
						error => {
							//	this.myModalService.alert(error.message);
						}
					)
			}
		}else if(this.adxId == undefined &&　this.sizeId !=undefined){
			if (this.validationService.validate()) {
				let options={
					// adxId:this.adxId,
					code:this.code,
					duration:this.duration,
					sizeId:this.sizeId,
					imageMaxVolume:this.imageMaxVolume,
					maxVolume:this.maxVolume,
					name:this.name,
					needImage:this.needImage,
					videoFormats:this.videoFormats
				}
					this.creativeSizeManagementService.addvideoPoses(options).subscribe(
						result => {
								// console.log(result.body)
								this.router.navigate(["/home/creativeSizeManagement/videoPoses"]);
						},
						error => {
							//	this.myModalService.alert(error.message);
						}
					)
			}
		}
	}

}