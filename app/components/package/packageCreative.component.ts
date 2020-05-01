import { Component,OnInit,ViewChild,ElementRef,ViewChildren } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { PackageService} from "../../services/package.service";
import {Package } from "../../models/package.model";
import {ClipboardModule} from '../../../node_modules/ngx-clipboard';
import { FileUploader } from "ng2-file-upload"
import {Http,Response,RequestOptions,Headers,HttpModule} from '@angular/http';
import "./packageCreative.component.less";
// import { BaseService } from "../../services/base.service";
import { PackageRootService } from "../../services/package.root.service";
import { ValidationService } from "../../services/validation.service";




declare var $;
declare var require;
let path = require("./packageCreative.html");
declare var profiles;


@Component({
	selector: "ng-packageCreative",
	template: path,
})

export class PackageCreativeComponent implements OnInit {
	advertiser={'name':'','id':''};
	campaign={'name':'','id':''};
	creative={'name':'','id':''};
	size={'name':'','id':''};
	tab:number;
	creativeType;
	paramOptions:object;
	enable:string;
	editNameText:string;
	clickshowindex:number;
	private showcreativemodel = {
		name:"",
		materials:[]
	}
	private showcreativemodelinfo = {
		title:"",
		name:"",
		materials:[]
	}

	headtitletext = {
		advertiserName:"",
		projectName:"",
		campaignName:"",
		advertiserId:""
	}
	advertisers = [];
	private campaigns = [];
	private creatives = [];
	private sizes = [];
	private imgresults= [];
	private packageId: number;
	private campaignId: number;
	private data=[];
	private results = [];
	private selectedCreatives = [];
	private datas = [];
	private selected = [];
	private allCheck:boolean;
	private status:string;
	private package:Package=new Package();
	private options = [];

	private uploader: any;
	private baseUrl: string;
	private upload: FileUploader;
	private path: string;
	private uploadMessage: string = this.chineseService.config.PLEASE_UPLOAD_FILE;

	private startDate: number = new Date().getTime();
	private endDate: number = new Date().getTime();
	public headers: Headers;
	private id:number;
	public mainMenus = [];


	@ViewChild("allchangeList") allchangeList;
	@ViewChild("regionModal") regionModal;
	@ViewChild("creativeImgModal") creativeImgModal;
	@ViewChild("creativeImgModalinfo") creativeImgModalinfo;
	@ViewChild("file") file: ElementRef;
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

	videosupport(v){
			if(Number(v) == 33 ){
				v = "flv"
			}
			if(Number(v) == 34){
				v = "mp4"
			}
			if(Number(v) == 0){
				v = "未知"
			}
		return v
	}



	constructor(
		private publicService: PublicService,
        private chineseService: ChineseService,
		private myModalService: MyModalService,
        private router:Router,
		private http:Http,
		private route:ActivatedRoute,
		private packageService:PackageService,
		private packageRootService:PackageRootService,
		private validationService: ValidationService


	) {
		this.tab = 2;
		this.allCheck = false;
		this.campaignId = this.route.snapshot.params["campaignId"];
		this.packageId = this.route.snapshot.params["packageId"];
		this.creativeType= this.route.snapshot.params["tab"]?this.route.snapshot.params["tab"]:"1";
		// this.headtitletext = {
		// 	advertiserName:"",
		// 	projectName:"",
		// 	campaignName:"",
		// 	advertiserId:""
		// }
		this.mainMenus = [
			{
				name: "返回",
				value: "/home/campaign/package/packageList/"+this.campaignId
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

	ngOnInit() {
		this.headtitleinit();
		this.dataInit();
		// 上传创意
		// let tokenType = window.localStorage.getItem("tokenType");
		// let token = window.localStorage.getItem("token");
		// let tokens = tokenType + " " + token;
		// var myHeaders = new Headers();
		// myHeaders.append('Content-Type', 'text/xml');
		this.headers = new Headers({"Content-Type":"application/json"});
		this.uploader = new FileUploader({
			url:this.packageRootService.baseUrl+"/advertise/image",
			allowedFileType:["image"],
			itemAlias: "image",
			autoUpload:true,
			// authToken: tokens
		});
		this.listenUpload();
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
			creativeType:this.creativeType,
			packageId:this.packageId,
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
		this.packageRootService.creativeslists(params).subscribe(
			result => {
					this.datas = result.body.items;
					this.page.total = this.datas.length;
					this.selected = [];
					this.allCheck = false;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}


	//上传监听事件
	private listenUpload(): void{
		this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
			console.log(JSON.parse(response).id)
			let paramOptions = {
				materialIds:[JSON.parse(response).id],
				packageId:Number(this.packageId),
				type:"1",
			}
			this.packageRootService.createCreative(paramOptions).subscribe(
				result => {
					this.dataInit()
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		};
		this.uploader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
			if(status == 401){
				this.router.navigate(["/login"]);
			}
			this.myModalService.alert(JSON.parse(response).message);
		}
	}

	changeCreativeType(v){
		this.creativeType = v;
		if(v=="1"){
			this.datas=[];
			this.dataInit();
		}
		if(v=="2"){
			this.datas=[];
			this.dataInit();
		}
		if(v=="3"){
			this.datas=[];
			this.dataInit();
		}
	}

	// 导入创意弹窗
	// 媒体类型选择切换
	private toggleAppType(v,index){
		v.selected = !v.selected;
	}

	//审核状态对应的不同背景颜色
	auditStatus(p){
		//审核中
		if(p.status == "01"){
			return {"background":"#FFAB2F","color":"#fff"}
		}
		//审核通过
		if(p.status == "02"){
			return {"background":"#4CB525","color":"#fff"}
		}
		//审核不通过
		if(p.status == "03"){
			return {"background":"#E2575E","color":"#fff"}
		}
		//未审核
		if(p.status == "04"){
			return {"background":"#fff","color":""}
		}
		//机审通过
		if(p.status == "05"){
			return {"background":"#9ADA0A","color":"#fff"}
		}
		//机审不通过
		if(p.status == "06"){
			return {"background":"#FF9791","color":"#fff"}
		}
	}

	//创意名字点击显示大图
	showCreativeImg(row){
		this.creativeImgModal.open();
		this.showcreativemodel.name = row.name;
		this.showcreativemodel.materials=row.materials;
	}

	showCreativeImginfo(row){
		this.creativeImgModalinfo.open();
		this.showcreativemodelinfo.title = row.title;
		this.showcreativemodelinfo.name = row.name;
		this.showcreativemodelinfo.materials=row.materials;
	}


	creativeImgCancel(){
		this.creativeImgModal.close();
		this.showcreativemodel = {
			name:"",
			materials:[]
		}

		this.creativeImgModalinfo.close();
		this.showcreativemodelinfo = {
			title:"",
			name:"",
			materials:[]
		}
	}
	statusfilger(v){
		if(v == "03"){
			return "审核不通过"
		}
		if(v == "02"){
			return "审核通过"
		}
		if(v == "01"){
			return "审核中"
		}
	}

	//创意名称编辑
	creativeOk(row){
		if(row.editNameText == undefined || row.editNameText == ""){
			this.myModalService.alert("请输入名称!");
			return;
		}
		if(row.editNameText.length <= 20){
			let id = row.id;
			let options = {
				name : row.editNameText
			}
			this.packageRootService.creativeEdit(id,options).subscribe(
				result => {
					this.dataInit()
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		}else{
			this.myModalService.alert("名称不能超过20字符!");
		}
	}
	creativeCancel(row){
		row.editNameFlag = false;
	}
	switchWrite(row){
		if(row.editNameFlag){
			row.editNameFlag = false;
		}else{
			row.editNameFlag = true;
		}
	}

	//物料包下创意开关修改
	switchChange(row) {
		let enable=row.packageEnable?row.packageEnable:"0";
		let id = row.id;
		if(enable == "1"){	//如果状态为启动（1），再次点击需要暂停。
			this.packageRootService.creativeStatus(id,"0").subscribe(
				result => {
					this.dataInit()
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)

		} else {
			this.packageRootService.creativeStatus(id,"1").subscribe(
				result => {
					this.dataInit()
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		}
	};


	onSelect(event,page){
		if(!event.selected)
			return;
		this.allCheck = event.selected.length == ((page.pageNo+1)*page.pageSize > page.total ? page.total % page.pageSize : page.pageSize) ? true : false;
	}

	private allToggleOuter(event,v){
		this.allToggle(this.allchangeList,this.allCheck,this.datas);
	}


	//全选切换
	private allToggle(table,allcheck,data){
		table.selected.splice(0,table.selected.length);
		if(allcheck){
			let start = table.offset*table.pageSize,
				end = (table.offset+1)*table.pageSize > table.rowCount ? table.rowCount : (table.offset+1)*table.pageSize;
			for(let i=start;i<end;i++){
				table.selected.push(data[i])
			}
		}
	}

	//查找所有图片
	queryallimg(v){
		this.imgresults = [];
		let paramOpton = {
			advertiserId:this.headtitletext.advertiserId?this.headtitletext.advertiserId:"undefined",
			campaignId:this.campaign.id?this.campaign.id:"undefined",
			projectId:this.advertiser.id?this.advertiser.id:"undefined",
			creativeId:this.creative.id?this.creative.id:"undefined",
			sizeId:this.size.id?this.size.id:"undefined"
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
	//导入创意
	importCreative(){
		this.advertiser = {'name':"请选择广告项目",'id':""};
		this.campaign = {'name':"请选择推广活动",'id':""};
		this.creative = {'name':"请选择创意",'id':""}
		this.size = {'name':"请选择尺寸",'id':""};
		this.campaigns=[];
		this.campaigns.unshift({'name':"请选择推广活动",'id':""});
		this.creatives=[];
		this.creatives.unshift({'name':"请选择创意",'id':""});
		this.imgresults = [];
		this.regionModal.open();
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
		this.packageRootService.queryadvertise(params).subscribe(
			result => {
				this.advertisers = result.body.items;
				this.advertisers.unshift({'name':"请选择广告项目",'id':""});
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		//查询所有尺寸
		this.packageRootService.querySize().subscribe(
			result => {
				this.sizes = result.body.items;
				this.sizes.unshift({'name':"请选择尺寸",'id':""});
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		this.queryallimg("");
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
		this.queryallimg(v);

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
		this.size = {'name':"请选择尺寸",'id':""};
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
		this.queryallimg(v);


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
		this.size = {'name':"请选择尺寸",'id':""};
	}
	//查询创意
	selectedCreative(v){
		this.creative = v;
		if(!this.creative.id){
			return;
		}
		this.queryallimg(v);
	}

	//查询尺寸
	selectedSize(v){
		this.size = v;
		if(!this.size.id){
			return;
		}
		this.queryallimg(v)
	}

	//导入创意提交
	regionModalSubmit(){
		this.selectedCreatives = [];
		for(var i=0;i<this.imgresults.length;i++){
			if(this.imgresults[i].selected){
				this.selectedCreatives.push(this.imgresults[i].id);
			}
		}
		if(this.selectedCreatives.length == 0){
			this.myModalService.alert("请选择创意!");
			return;
		}
		let option = {
			materialIds:this.selectedCreatives,
			packageId:Number(this.packageId),
			type:"1",
		}
		this.packageRootService.createCreative(option).subscribe(
			result => {
				this.dataInit()
				this.regionModal.close();
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		this.advertiser = {'name':"请选择广告项目",'id':"undefined"};
		this.campaign = {'name':"请选择推广活动",'id':"undefined"};
		this.creative = {'name':"请选择创意",'id':"undefined"}
		this.size = {'name':"请选择尺寸",'id':"undefined"};
	}
	regionCancel(){
		this.regionModal.close();
		for(let i =0;i<this.imgresults.length;i++){
			this.imgresults[i].selected = false;
		}
		this.advertiser = {'name':"请选择广告项目",'id':"undefined"};
		this.campaign = {'name':"请选择推广活动",'id':"undefined"};
		this.creative = {'name':"请选择创意",'id':"undefined"}
		this.size = {'name':"请选择尺寸",'id':"undefined"};
	}
	selectallimg(){
		for(var i=0;i<this.imgresults.length;i++){
			this.imgresults[i].selected = true;
		}
	}
	clearallimg(){
		for(var i=0;i<this.imgresults.length;i++){
			this.imgresults[i].selected = false;
		}
	}

	//审核不通过，通过并提交渠道
	checkCreative(status,row){
		if(this.selected.length == 0){
			this.myModalService.alert("请选择创意");
			return ;
		}
		let checkids=[];
		for(let i =0;i<this.selected.length;i++){
				checkids.push(this.selected[i].id)
		}
		let paramOption = {
			ids:checkids,
			auditStatus:status
		}
		this.packageRootService.checkstatusCreative(paramOption).subscribe(
			result => {
				this.dataInit()
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}

	setpolicy(){
		this.router.navigate(["/home/campaign/policy/policyList/",this.campaignId]);
	}

	show(v){
		if(v == "1"){
			this.router.navigate(["/home/campaign/package/packageDetail/",this.campaignId,this.packageId]);
		}
	}

	addInfoCreative(){
		this.router.navigate(["/home/campaign/package/newIdeasForInformationFlow/",this.campaignId,this.packageId]);
	}

	//路由跳转
	addVideoCreative(){
		this.router.navigate(["/home/campaign/package/addPackageVideoCreative/",this.campaignId,this.packageId]);
	}

	goBack(v){
		this.router.navigate(["/home/campaign/campaignList"+this.packageId]);
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