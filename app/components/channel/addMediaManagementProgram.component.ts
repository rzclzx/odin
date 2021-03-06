import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";
// import { PackageService } from "../../services/package.service";
import { mediaManagementRootService } from "../../services/mediaManagement.root.service";
import "./addMediaManagement.component.less";


declare var $;
declare var require;
let path = require("./addMediaManagementProgram.html");

@Component({
	selector: "ng-packageForm",
	template: path
})

export class AddMediaManagementProgramComponent implements OnInit {
	datas;
	cludeAdxs;
	oneclassifys;
	twoclassifys;
	threeclassifys;
	cludeAdx;
	appId;
	appName;
	threeclassify;
	twoclassify;
	channelName;
	channel={
		name:"",
		id:""
	}
	adxId;
	adxdatas;

	public mainMenus = [
        {
            name: "渠道管理",
            value: undefined
        },
        {
            name: "媒体管理",
            value: undefined
		},
		{
            name: "创建媒体",
            value: undefined
		},
    ];


	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private router:Router,
		private validationService:ValidationService,
		private myModalService:MyModalService,
		private route:ActivatedRoute,
		private mediaManagementRootService:mediaManagementRootService,

	) {
		this.adxId = this.route.snapshot.params["adxId"];
	}

	ngOnInit() {
		this.dataInitadx();
		this.dataInitchannel();
		this.changechannel("",'1');
	}

	private dataInitadx(){
		let params;
		let obj={
		};
		params = this.filterobj(obj);
		this.mediaManagementRootService.queryadxlist(params).subscribe(
			result => {
				this.adxdatas = result.body.items;
				for(let i = 0 ;i<this.adxdatas.length;i++){
					if(this.adxdatas[i].id == this.adxId){
						this.channel = this.adxdatas[i];
					}
				}
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}

	//过滤obj结果
	filterobj(paramOpton){
		let x;
		let params={};
		if(paramOpton){
			for(x in paramOpton){
				if(paramOpton[x] != "undefined" && paramOpton[x] != undefined && paramOpton[x] != ""){
					params[x] = paramOpton[x];
				}
			}
		}
		return params
	}

	private dataInitchannel(){
		let params;
		let obj={
		};
		params = this.filterobj(obj);
		this.mediaManagementRootService.queryadxlist(params).subscribe(
			result => {
				this.cludeAdxs = result.body.items;
				for(let i = 0 ;i<this.cludeAdxs.length;i++){
					if(this.cludeAdxs[i].id == this.adxId){
						this.channel = this.cludeAdxs[i];
					}
				}
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}


	changechannel(v,order){
		let params;
		let obj={
			level:order,
			parentId:v?v:undefined
		};
		params = this.filterobj(obj);
		this.mediaManagementRootService.querymeidatype(params).subscribe(
			result => {
				if(order == "1"){
					this.oneclassifys = result.body.items;
					this.twoclassify = undefined;
					this.threeclassify = undefined;
				}
				if(order == "2"){
					this.twoclassifys = result.body.items;
					this.threeclassify = undefined;
				}
				if(order == "3"){
					this.threeclassifys = result.body.items;
				}
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}
	
	cancel(campaignId) {
		this.router.navigate(["/home/programmaticChannel/mediaManagementProgram",this.adxId]);
	}

	private save(){
		if(this.validationService.validate()){
			if(!this.threeclassify){
				this.myModalService.alert("媒体分类必须都选择！");
				return
			}
			let options={
				adxId:Number(this.adxId),
				id :this.appId?this.appId:undefined,
				name:this.appName?this.appName:undefined,
				typeId:this.threeclassify?Number(this.threeclassify.threeLevelId):undefined
			}
			this.mediaManagementRootService.createmedia(options).subscribe(
				result => {
					this.router.navigate(["/home/programmaticChannel/mediaManagementProgram",this.adxId]);
				},
				error => {
				//	this.myModalService.alert(error.message);
				}
			)
		} else {
			this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
		}
	}
	
}