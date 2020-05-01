import { Component,OnInit,ViewChild,TemplateRef,OnDestroy,ElementRef,AfterViewInit,ViewChildren,QueryList} from "@angular/core";
import { Router,ActivatedRoute,NavigationEnd,Params } from "@angular/router";
import { Location,NgStyle } from "@angular/common";
import { FileUploader } from "ng2-file-upload"
import { Subject } from "rxjs/Subject";


import { CampaignService } from "../../services/campaign.service";
import { ProjectService } from "../../services/project.service";
import { MyModalService } from "../../services/myModal.service";
import { ChineseService } from "../../services/chinese.service";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";


import { Project } from "../../models/project.model";
import { Campaign } from "../../models/campaign.model";
import { ValidationService } from "../../services/validation.service";

import {Http,Response,RequestOptions,Headers,HttpModule} from '@angular/http';
import { PublicService } from "../../services/public.service";
// import { PackageService} from "../../services/package.service";
import {Package } from "../../models/package.model";
import { PackageRootService } from "../../services/package.root.service";

import "./addPackageVideoCreative.component.less";

declare var $;
declare var require;
let path = require("./addPackageVideoCreative.html");

@Component({
	selector: "ng-addPackageVideoCreative",
	template: path,
})

export class addPackageVideoCreativeComponent implements OnInit {
	advertiser={'name':'','id':''};
	campaign={'name':'','id':''};
	creative={'name':'','id':''};

	submitflag=false;
	type:string;
	currentColumns:Array<any> = [];
	tmpls:Array<any> = [];
	showArr:Array<any> = [];
	tab:number;
	creativeType:string;
	querycreativeType:string;
	private uploadshow= {};
	private videoflag:boolean;
	private selectedRowlist=[];
	private headtitletext = {
		advertiserName:"",
		projectName:"",
		campaignName:"",
		advertiserId:""
	};;
	private package:Package=new Package();
	private results = [];
	private imgresults = [];
	private advertisers = [];
	private campaigns = [];
	private creatives = [];
	private sizes = [];
	private selectedCreatives = [];
	private datas = [];
	private selected = [];
	private allCheck:boolean;
	private status:string;
	private myData=[];
	private startDate: number = new Date().getTime();
	private endDate: number = new Date().getTime();
	public headers: Headers;
	private uploader: any;
	private uploadervideo: any;
	private baseUrl: string;
	private upload: FileUploader;
	private uploadvideo: FileUploader;
	private path: string;
	private packageId: number;
	columns;
	private materials = [];
	campaignId;
	public mainMenus = [];


	@ViewChild("mydatatable") mydatatable;
	@ViewChild("allchangeList") allchangeList;
	@ViewChild("regionModal") regionModal;
	@ViewChild("fileinput") fileinput;
	@ViewChild("sumbimtsuccess") sumbimtsuccess;


	private page = {
		pageNo: 0,
		pageSize: 50,
		total:0,
		currentShow: 1
	};
	onPage(e){
		if(e === 1){
			this.page.pageNo = 0;
			this.page.currentShow = 1;
		}
		this.dataInit()
	}

	onSelect(event,page){
		if(!event.selected)
			return;
		this.allCheck = event.selected.length == ((page.pageNo+1)*page.pageSize > page.total ? page.total % page.pageSize : page.pageSize) ? true : false;
	}




	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private myModalService: MyModalService,

		private router:Router,
		private route:ActivatedRoute,
		private location: Location,
		// private creativeSercive:CreativeService,
		private campaignSercive:CampaignService,
		private projectService: ProjectService,
		// private appTmplService: AppTmplService,
		private validationService: ValidationService,
		private packageRootService:PackageRootService,
	) {

		this.videoflag=false;
		this.tab = 2;
		this.packageId = this.route.snapshot.params["packageId"];
		this.campaignId = this.route.snapshot.params["campaignId"];

		this.creativeType = "2";
		// this.headtitletext = {
		// 	advertiserName:"",
		// 	projectName:"",
		// 	campaignName:"",
		// 	advertiserId:""
		// };
		this.uploadshow = {
			imgpath:"",
			imgid:"",
			videopath:"",
			videoid:""
		};
		this.mainMenus = [
			{
				name: "返回",
				value: "/home/campaign/package/packageCreative/"+this.campaignId+"/"+this.packageId+"/"+this.tab
			},
			{
				name: "运营支撑",
				value: undefined
			},
			{
				name: "推广活动管理",
				value: "/home/campaign/campaignAudited"
			},
			{
				name: "物料包",
				value: "/home/campaign/package/packageList/"+this.campaignId
			},
			{
				name: "创意",
				value: undefined
			}
		];
	}
	wuliaobaotioazhuan(){
		this.router.navigate(["/home/campaign/package/packageDetail/",this.campaignId,this.packageId]);
	}
	ngOnInit() {
		this.headtitleinit();
		this.dataInit();

		// 上传图片创意
		// let tokenType = window.localStorage.getItem("tokenType");
		// let token = window.localStorage.getItem("token");
		// let tokens = tokenType + " " + token;
		// var myHeaders = new Headers();
		//
		// myHeaders.append('Content-Type', 'text/xml');
		this.headers = new Headers({"Content-Type":"application/json"});
		this.uploader = new FileUploader({
			url:this.packageRootService.baseUrl+"/advertise/image?checkSize=0",
			allowedFileType:["image"],
			itemAlias: "image",
			autoUpload:true,
		});
		this.listenUpload();



		// 上传视频创意
		// let tokenType = window.localStorage.getItem("tokenType");
		// let token = window.localStorage.getItem("token");
		// let tokens = tokenType + " " + token;
		// var myHeaders = new Headers();
		//
		// myHeaders.append('Content-Type', 'text/xml');
		this.headers = new Headers({"Content-Type":"application/json"});
		this.uploadervideo = new FileUploader({
			url:this.packageRootService.baseUrl+"/advertise/video",
			allowedFileType:["video"],
			itemAlias: "video",
			autoUpload:true,
			// authToken: tokens
		});
		this.listenUploadvideo();
	}


	//上传图片监听事件
	private listenUpload(): void{
		this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
			this.uploadshow['imgpath'] = JSON.parse(response).path;
			this.materials.push({id:JSON.parse(response).id,type:"1"})
		};
		this.uploader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
			if(status == 401){
				this.router.navigate(["/login"]);
			}
			this.myModalService.alert(JSON.parse(response).message);
		}
	}


	//上传视频监听事件
	private listenUploadvideo(): void{
		this.uploadervideo.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
			this.uploadshow['videopath'] = JSON.parse(response).path;
			this.materials.push({id:JSON.parse(response).id,type:"2"})
		};
		this.uploadervideo.onErrorItem = (item: any, response: any, status: any, headers: any) => {
			if(status == 401){
				this.router.navigate(["/login"]);
			}
			this.myModalService.alert(JSON.parse(response).message);
		}
	}


	//表头信息初始化
	private headtitleinit(){
		let id = this.packageId;
		this.packageRootService.headtitleinit(id).subscribe(
			result => {
				this.headtitletext = result.body;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}

	//表格数据初始化
	private dataInit(){
		let paramOptions = {
			pageNo:this.page.pageNo + 1,
			pageSize:this.page.pageSize
		}
		let x;
		let params={};
		if(paramOptions){
			for(x in paramOptions){
				if(paramOptions[x] != "undefined"){
					params[x] = paramOptions[x];
				}
			}
		}
		this.packageRootService.addvideocreative(params).subscribe(
			result => {
				this.tmpls = result.body.items;
				this.page.total = this.tmpls.length;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}

	//保存并提交审核
	submitCreative(row){
		if (this.validationService.validate()) {
			let paramOptions = {
				materials:this.materials,
				name:this.selectedRowlist[0].videoname,
				packageId:this.packageId,
				posId:this.selectedRowlist[0].id,
				type:"2",
			}
			if(paramOptions.materials.length<2){
				this.myModalService.alert("创意上传不完整！");
				return;
			}
			if(row.videoname && row.videoname.length > 20){
				this.myModalService.alert("名称不能超过20个字符！");
				return;
			}
			this.packageRootService.createCreative(paramOptions).subscribe(
				result => {
					/*for(let i=0;i<this.showArr.length;i++){
						if(this.showArr[i] == true){
							this.mydatatable.toggleExpandRow(this.tmpls[i]);
							this.showArr[i] = false;
						}
					}*/
					this.page.total = this.tmpls.length;
					this.uploadshow['imgpath']="";
					this.uploadshow['videopath']="";
					this.submitflag = true;
					row.videoname = "";
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		} else {
			this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
		}
	}

	onActivate($event){
		// this.submitflag=false;
		this.selectedRowlist = [];
		this.selectedRowlist.push($event.row);
		this.uploadshow = {
			imgpath:"",
			imgid:"",
			videopath:"",
			videoid:""
		};
		if($event.type == "click") {
			let index;
			for (let i = 0; i < this.tmpls.length; i++) {
				if ($event.row == this.tmpls[i]) {
					index = i;
				}
			}
			for (let i = 0; i < this.showArr.length; i++) {
				if (this.showArr[i] == true) {
					this.mydatatable.toggleExpandRow(this.tmpls[i]);
					this.showArr[i] = false;
					if (index == i) {
						return;
					}
				}
			}
			let that = this;
			setTimeout(() => {
				this.showArr[index] = true;
				this.mydatatable.toggleExpandRow($event.row);
			}, 1);
		}

	}


	/*queryallimg(advertiser,campaign){
		let paramOpton = {
			campaignId:campaign?campaign.id:undefined,
			projectId:advertiser?advertiser.id:undefined,
		}
		//查询所有图片
		this.packageRootService.importCreatives(paramOpton).subscribe(
			result => {
				this.imgresults = result.body.items;
				console.log(this.imgresults)
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}*/

	queryvideo(){
		this.imgresults = [];
		let paramOpton = {
			advertiserId:this.headtitletext.advertiserId?this.headtitletext.advertiserId:"undefined",
			campaignId:this.campaign.id?this.campaign.id:"undefined",
			projectId:this.advertiser.id?this.advertiser.id:"undefined",
			width:this.selectedRowlist[0].frameWidth,
			height:this.selectedRowlist[0].frameHeight,
		}
		let x;
		let params={};
		if(paramOpton){
			for(x in paramOpton){
				if(paramOpton[x] != "undefined"){
					params[x] = paramOpton[x];
				}
			}
		}
		//查询所有视频
		this.packageRootService.importCreativesVideo(params).subscribe(
			result => {
				this.imgresults = result.body.items;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}

	//查找所有图片
	queryallimg(v){
		this.imgresults = [];
		let paramOpton = {
			advertiserId:this.headtitletext.advertiserId?this.headtitletext.advertiserId:"undefined",
			campaignId:this.campaign.id?this.campaign.id:"undefined",
			projectId:this.advertiser.id?this.advertiser.id:"undefined",
			creativeId:this.creative.id?this.creative.id:"undefined",
			// sizeId:this.size.id?this.size.id:"undefined"
		}
		let x;
		let params={};
		if(paramOpton){
			for(x in paramOpton){
				if(paramOpton[x] != "undefined"){
					params[x] = paramOpton[x];
				}
			}
		}
		//查询所有图片
		this.packageRootService.importCreatives(params).subscribe(
			result => {
				this.imgresults = result.body.items;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}
	//导入图片和视频
	importCreative(v){
		this.advertiser = {'name':"请选择广告项目",'id':""};
		this.campaign = {'name':"请选择推广活动",'id':""};
		this.creative = {'name':"请选择创意",'id':""}
		// this.size = {'name':"请选择尺寸",'id':""};
		this.campaigns=[];
		this.campaigns.unshift({'name':"请选择推广活动",'id':""});
		this.creatives=[];
		this.creatives.unshift({'name':"请选择创意",'id':""});
		this.imgresults = [];

		//'1'图片;'2'视频
		this.regionModal.open();

		if(v == "1"){
			this.videoflag=false;
			this.querycreativeType = "1";
			this.queryallimg(v);
		}
		if(v == "2"){
			this.videoflag=true;
			this.querycreativeType = "2";
			this.queryvideo();
		}

		let paramAdvertise = {
			advertiserName:this.headtitletext['advertiserName']?this.headtitletext['advertiserName']:"undefined"
		}
		let x;
		let params={};
		if(paramAdvertise){
			for(x in paramAdvertise){
				if(paramAdvertise[x] != "undefined"){
					params[x] = paramAdvertise[x];
				}
			}
		}
		//查询广告项目
		this.packageRootService.queryadvertise(paramAdvertise).subscribe(
			result => {
				this.advertisers = result.body.items;
				this.advertisers.unshift({'name':"请选择广告项目",'id':""});
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		/*//查询所有尺寸
		this.packageRootService.querySize().subscribe(
			result => {
				this.sizes = result.body.items;
				this.sizes.unshift({'name':"请选择尺寸",'id':""});
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)*/
	}
	//查询广告项目之后查询推广活动
	selectedAdvertiser(v){
		this.advertiser = v;
		let paramCampaigns = {
			projectId:v.id ? v.id : undefined,
		}
		let params = this.filterobj(paramCampaigns)

		if(!paramCampaigns.projectId){
			return;
		}

		if(this.videoflag){
			this.queryvideo();
		}else{
			this.queryallimg(v);
		}

		//查询推广活动
		this.packageRootService.querycampaigns(params).subscribe(
			result => {
				this.campaigns = result.body.items;
				this.campaigns.unshift({'name':"请选择推广活动",'id':""});
				this.campaign = this.campaigns[0];
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		this.campaign = {'name':"请选择推广活动",'id':""};
		this.creative = {'name':"请选择创意",'id':""}
		// this.size = {'name':"请选择尺寸",'id':""};
		this.creatives=[];
		this.creatives.unshift({'name':"请选择创意",'id':""});
	}

	//查询推广活动之后查询创意
	selectedCampaign(v){
		this.campaign = v;

		let paramCreative = {
			campaignId:this.campaign.id ? this.campaign.id : undefined,
		}
		let params =  this.filterobj(paramCreative)

		if(!paramCreative.campaignId){
			return;
		}

		if(this.videoflag){
			this.queryvideo();
		}else{
			this.queryallimg(v);
		}

		this.packageRootService.queryCreative(paramCreative).subscribe(
			result => {
				this.creatives = result.body.items;
				this.creatives.unshift({'name':"请选择创意",'id':"undefined"});
				this.creative=this.creatives[0];
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		this.creative = {'name':"请选择创意",'id':""}
		// this.size = {'name':"请选择尺寸",'id':""};
	}
	//查询创意
	selectedCreative(v){
		this.creative = v;
		if(!this.creative.id){
			return;
		}

		if(this.videoflag){
			this.queryvideo();
		}else{
			this.queryallimg(v);
		}
	}


	//导入图片创意提交
	regionModalSubmit(v){
		let type = v;
		this.selectedCreatives = [];
		for (var i = 0; i < this.imgresults.length; i++) {
			if (this.imgresults[i].selected) {
				this.selectedCreatives.push(this.imgresults[i]);
			}
		}
		if(this.selectedCreatives.length == 0){
			this.myModalService.alert("请选择创意!");
			return;
		}

		if(v == "1"){
			this.uploadshow['imgpath'] = this.selectedCreatives[0].path;
			this.materials.push({id:this.selectedCreatives[0].id,type:"1"})
		}
		if(v == "2"){
			this.uploadshow['videopath'] = this.selectedCreatives[0].path;
			this.materials.push({id:this.selectedCreatives[0].id,type:"2"})
		}
		this.regionModal.close();
	}

	regionCancel(row){
		this.regionModal.close();
	}

	//路由跳转
	changeCreativeType(v){
		this.router.navigate(["/home/campaign/package/packageCreative/",this.campaignId,this.packageId,v]);
	}
	private toggleAppType(v,index){
		for(let i  = 0;i<this.imgresults.length;i++){
			this.imgresults[i].selected = false;
		}
		v.selected = true;
	}

	videosupport(v){
		for(let i =0;i<v.length;i++){
			if(v[i] == "33"){
				v[i] = "flv"
			}
			if(v[i] == "34"){
				v[i] = "mp4"
			}
			if(v[i] == "0"){
				v[i] = "未知"
			}
		}
		return v
	}

	filterobj(v){
		let x;
		let params={};
		if(v){
			for(x in v){
				if(v[x] != "undefined" && v[x] != undefined && v[x] != ""){
					params[x] = v[x];
				}
			}
		}
		return params;
	}


}