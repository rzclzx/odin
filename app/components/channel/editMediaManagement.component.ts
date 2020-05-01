import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";
import { PackageService } from "../../services/package.service";
import { mediaManagementRootService } from "../../services/mediaManagement.root.service";
import "./editMediaManagement.component.less";



declare var $;
declare var require;
let path = require("./editMediaManagement.html");

@Component({
	selector: "ng-packageForm",
	template: path
})

export class EditMediaManagementComponent implements OnInit {
	classifydetail;
	adxId;
	appId;
	id;
	obj;
	appName;
	cludeAdxs;
	cludeAdx;
	oneclassifys;
	twoclassify;
	threeclassify;
	twoclassifys;
	threeclassifys;
	oneclassify;



	public mainMenus = [
        {
            name: "渠道管理",
            value: undefined
        },
        {
            name: "媒体管理",
            value: "/home/mediaManagement/mediaManagement"
		},
		{
            name: "创建媒体",
            value: undefined
		},
    ];


	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private packageService:PackageService,
		private router:Router,
		private validationService:ValidationService,
		private myModalService:MyModalService,
		private route:ActivatedRoute,
		private mediaManagementRootService:mediaManagementRootService,

	) {
		this.adxId = this.route.snapshot.params["adxId"];
		this.id = this.route.snapshot.params["id"];
		this.appId = this.id;
	}

	ngOnInit() {
		this.datainit();						//根据ID查询媒体详情
		this.dataInitchannel();					//批量查询ADX
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

	changechannelother(v,order){
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
					for(let i=0;i<this.oneclassifys.length;i++){
						if(this.oneclassifys[i].oneLevelName == this.obj.oneLevelName){
							this.oneclassify = this.oneclassifys[i]
						}
					}
					this.twoclassify = undefined;
					this.threeclassify = undefined;
					if(this.oneclassify){
						this.changechannelother(this.oneclassify.oneLevelId,"2")
					}
				}
				if(order == "2"){
					this.twoclassifys = result.body.items;
					for(let i=0;i<this.twoclassifys.length;i++){
						if(this.twoclassifys[i].twoLevelName == this.obj.twoLevelName){
							this.twoclassify = this.twoclassifys[i];
						}
					}
					this.threeclassify = undefined;
					if(this.twoclassify){
						this.changechannelother(this.twoclassify.twoLevelId,"3")
					}
				}
				if(order == "3"){
					this.threeclassifys = result.body.items;
					for(let i=0;i<this.threeclassifys.length;i++){
						if(this.threeclassifys[i].threeLevelName == this.obj.threeLevelName){
							this.threeclassify = this.threeclassifys[i];
						}
					}
				}
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}

	datainit(){
		let id = this.id;
		let adxId = this.adxId;
		this.mediaManagementRootService.queryeditmeida(id,adxId).subscribe(
			result => {
				this.obj = result.body;
				this.appName = this.obj.name;
				this.changechannelother("",'1');				//获取分类
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}

	private dataInitchannel(){
		let params;
		let obj={
		};
		params = this.filterobj(obj);
		this.mediaManagementRootService.queryadxlist(params).subscribe(
			result => {
				this.cludeAdxs = result.body.items;
				for(let i=0;i<this.cludeAdxs.length;i++){
					if(this.cludeAdxs[i].id == this.adxId){
						this.cludeAdx = this.cludeAdxs[i];
					}
				}
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}
	
	cancel(campaignId) {
		this.router.navigate(["/home/mediaManagement/mediaManagement"]);
	}

	save(){
		if(this.validationService.validate()){
			if(!this.cludeAdx){
				this.myModalService.alert("所属adx必须选择！");
				return;
			}
			if(!this.threeclassify){
				this.myModalService.alert("媒体分类必须都选择！");
				return;
			}

			let id = this.appId;
			let oldAdxId = this.adxId;
			let options={
				adxId:Number(this.cludeAdx.id),
				id:id,
				name:this.appName,
				oldAdxId:Number(oldAdxId),
				typeId:Number(this.threeclassify.threeLevelId),
			}
			this.mediaManagementRootService.editmeidia(id,oldAdxId,options).subscribe(
				result => {
					this.router.navigate(["/home/mediaManagement/mediaManagement"]);
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