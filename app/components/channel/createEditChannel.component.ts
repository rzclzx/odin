import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { ChannelRootService } from "../../services/channel.root.service";
import { MyModalService } from "../../services/myModal.service";
import { FileUploader } from "ng2-file-upload";
import { BaseService } from "../../services/base.service";
import { CampaignService } from "../../services/campaign.service";
import "./createEditChannel.less";
declare var $;
declare var require;
declare var profiles;
let path = require("./createEditChannel.html");

@Component({
	selector: "ng-createEditChannel",
	template: path
})

export class CreateEditChannelComponent implements OnInit {
	private	id: number;
	private name: string;
	private exchangeRate: number;
	private campanyName: string;
	private address: string;
	private domain: string;	
	private contacts: string;
	private email: string;
	private cturl: string;
	private iurl: string;
	private aurl: string;
	private nurl: string;
	private	logoPath: string;
	private	logoPathAlt: string;
	private baseImgUrl: string;
	private admode: string;
	private logoLoader: any;
	private errorMessage: any;
	private needAdvertiserAudit: string;
	private needCreativeAudit: string;
	private supportSsl: string;
	private imageAuditType :string;
	private videoAuditType :string;
	private infoflowAuditType :string;
	private keyArray : Array<any>;
	public mainMenus = [{
			name: "渠道管理",
			value: undefined
		},
		{
			name: "程序化渠道",
			value: "/home/channel/programmaticChannel"
		},
		{
			name: this.route.snapshot.params["id"]  ? "编辑程序化渠道" : "新建程序化渠道",
			value: undefined
		}
	];
	
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private publicService: PublicService,
		private chineseService: ChineseService,
		private myModalService: MyModalService,
		private channelRootService: ChannelRootService,
		private baseService : BaseService
	) {
		this.id=this.route.snapshot.params["id"] ? this.route.snapshot.params["id"] : "";
		this.needAdvertiserAudit = this.needAdvertiserAudit ? this.needAdvertiserAudit : "0";
		this.needCreativeAudit = this.needAdvertiserAudit ? this.needAdvertiserAudit : "0";
		this.keyArray = [
			{
				key : "",
				pass : "",
			}
		]
	}

	ngOnInit() {
		this.baseImgUrl = eval(profiles + ".imgurlHref");
        this.logoLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/upload/logo",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.listenUpload();
        
        if(this.id){
        	this.channelRootService.findAdxDetail(this.id).subscribe(
	        	result => {
	        		if(result.head.httpCode = 200){
	        			this.id = result.body.id;
	        			this.name = result.body.name;
	        			this.exchangeRate = result.body.exchangeRate;
	        			this.campanyName = result.body.campanyName;
	        			this.address = result.body.address;
	        			this.domain = result.body.domain;
	        			this.contacts = result.body.contacts;
	        			this.email = result.body.email;
	        			this.cturl = result.body.cturl;
	        			this.iurl = result.body.iurl;
	        			this.aurl = result.body.aurl;
	        			
	        			this.nurl = result.body.nurl;
	        			this.logoPath = result.body.logoPath;
	        			this.admode = result.body.admode;
	        			this.needAdvertiserAudit = result.body.needAdvertiserAudit;
	        			this.needCreativeAudit = result.body.needCreativeAudit;
	        			this.supportSsl = result.body.supportSsl;
	        			
	        			
	        		}		
				},
				error => this.errorMessage = <any>error
	        )
        }
	}
	
	private listenUpload(): void{
	    this.logoLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	    	//返回图片路径
	    	this.logoPathAlt = JSON.parse(response).path;
	    	//缩略图
			let files = $("#logo").get(0).files;
			let reader = new FileReader();
			let that = this;
			reader.readAsDataURL(files[0]);
			reader.onload = function(e){
				that.logoPath = this.result;
			}			
	    };
	    this.logoLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	        if(status == 401){
	            this.router.navigate(["/login"]);
	        }else if(response){
	            this.myModalService.alert(JSON.parse(response).message);
	        }
	    }

    }
	
	//删除logo
	private removePath(){
		this.logoPath="";
		this.logoPathAlt="";
	}
	
	//竞价方式,0定价,1竞价
	private admodeChange(val){
		this.admode = val;
	}
	
	//是否需要广告主审核,1需要,0不需要
	private needAdvertiserAuditChange(){
		this.needAdvertiserAudit = this.needAdvertiserAudit == "1" ? "0" : "1";
	}
	
	//是否需要创意审核,1需要,0不需要
	private needCreativeAuditChange(){
		this.needCreativeAudit = this.needCreativeAudit == "1" ? "0" : "1";
	}
	
	//是否支持安全链接,1需要,0不需要
	private supportSslChange(){
		this.supportSsl = this.supportSsl == "1" ? "0" : "1";
	}
	
	//取消按钮
	private back(){
		this.router.navigate(["/home/channel/programmaticChannel"]);
	}
	
	//保存按钮
	private save(){
		if(this.id){
			//编辑
			this.channelRootService.editChannel(this.id,{
				
			}).subscribe(
	        	result => {
	        		if(result.head.httpCode = 200){
	        			
	        		}		
				},
				error => this.errorMessage = <any>error
	        )
		}else{
			//创建
			this.channelRootService.createChannel({
				
			}).subscribe(
	        	result => {
	        		if(result.head.httpCode = 200){
	        				
	        		}		
				},
				error => this.errorMessage = <any>error
	        )
		}
	}
	
	//审核类型改变
	private typeChange( ele, val){
		this[ele]=val
	}
	
	//添加key
	private addKey(){
		this.keyArray.push({
			key : "",
			pass : "",
		})
	}
	
}