import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { CreativeSizeManagementService } from "../../services/creativeSizeManagement.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";

declare var $;
declare var require;
let path = require("./editvideoPoses.html");
let path1= require("./imageSize.less")

@Component({
	selector: "ng-editvideoPoses",
	template: path,
	styles:['path1']
})

export class EditvideoPosesComponent implements OnInit {
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
	private videoFormatss=[];
	private errorMessage;
	private adxs=[];
	private mp4;
	private flv;
	private avi;
	private needImage1;
	private videoPoses={};
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
            name: "编辑",
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
		private route:ActivatedRoute
	) {}

	ngOnInit() {
		this.id = this.route.snapshot.params["id"];  
		//   this.adxId=undefined;
		  this.creativeSizeManagementService.getvideoId(this.id).subscribe(
			result => {
					this.videoPoses=result.body;
					this.videoFormatss=result.body.videoFormats;
					for(let i= 0 ;i<this.videoFormatss.length;i++){
						if(this.videoFormatss[i]=="33"){
							this.flv=true;
						}else if(this.videoFormatss[i]=="44"){
							this.mp4=true;
						}else if(this.videoFormatss[i]=="0"){
							this.avi=true;
						}
					}
					if(result.body.needImage=="1"){
						this.needImage1=true
					}else{
						this.needImage1=false
					}
			},
			error => {
				//	this.myModalService.alert(error.message);
			}
		)
			//查询渠道
			this.creativeSizeManagementService.adxs().subscribe(
				result => {
						this.adxs=result.body.items;
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
		if(this.adxId==undefined){
			if (this.validationService.validate()) {
				let options={
					// adxId:this.adxId,
					code:this.code,
					duration:this.duration,
					frameHeight:this.frameHeight,
					frameWidth:this.frameWidth,
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
		}else{
			if (this.validationService.validate()) {
				let options={
					adxId:this.adxId,
					code:this.code,
					duration:this.duration,
					frameHeight:this.frameHeight,
					frameWidth:this.frameWidth,
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