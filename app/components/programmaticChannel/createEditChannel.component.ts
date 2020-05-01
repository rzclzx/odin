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
import { ValidationService } from "../../services/validation.service";
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
	private imageAuditType :string = "2";
	private videoAuditType :string = "2";
	private infoflowAuditType :string = "2";
	private bidding :boolean = false;
	private pricing :boolean = false;
	private jpg : boolean = false;
	private png : boolean = false;
	private gif : boolean = false;
	private jpeg : boolean = false;
	private keyArray : Array<any>;	
	private advertiserAuditUrl: string;
	private advertiserSyncUrl: string;
	private advertiserUpdateUrl: string;
	private creativeAuditUrl: string;
	private creativeSyncUrl: string;
	private creativeUpdateUrl: string;
	private qualificationAuditUrl: string;
	private qualificationUpdateUrl: string;	
	private andrImageTmpl: string;
	private andrInfoflowTmpl: string;
	private andrVideoTmpl: string;
	private iosImageTmpl: string;
	private iosInfoflowTmpl: string;
	private iosVideoTmpl: string;
	private formats: Array<string> = [];
	private securityKey: string;
	
	public mainMenus = [{
			name: "渠道管理",
			value: undefined
		},
		{
			name: "程序化渠道",
			value: "/home/channel/programmaticChannel"
		},
		{
			name: this.route.snapshot.params["adxId"]  ? "编辑程序化渠道" : "新建程序化渠道",
			value: undefined
		}
	];
	
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private publicService: PublicService,
		private validationService: ValidationService,
		private chineseService: ChineseService,
		private myModalService: MyModalService,
		private channelRootService: ChannelRootService,
		private baseService : BaseService
	) {
		this.id=this.route.snapshot.params["adxId"] ? this.route.snapshot.params["adxId"] : "";
		this.needAdvertiserAudit = this.needAdvertiserAudit ? this.needAdvertiserAudit : "0";
		this.needCreativeAudit = this.needAdvertiserAudit ? this.needAdvertiserAudit : "0";
		this.keyArray = [{
			key : "",
			value : "",
		}]
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
	        			this.formats = result.body.formats;
	        			this.andrImageTmpl = result.body.andrImageTmpl;
	        			this.andrInfoflowTmpl = result.body.andrInfoflowTmpl;
	        			this.andrVideoTmpl = result.body.andrVideoTmpl;
	        			this.iosImageTmpl = result.body.iosImageTmpl;
	        			this.iosInfoflowTmpl = result.body.iosInfoflowTmpl;
	        			this.iosVideoTmpl = result.body.iosVideoTmpl;
	        			this.advertiserAuditUrl = result.body.advertiserAuditUrl;
	        			this.advertiserSyncUrl = result.body.advertiserSyncUrl;
	        			this.advertiserUpdateUrl = result.body.advertiserUpdateUrl;
	        			this.creativeAuditUrl = result.body.creativeAuditUrl;
	        			this.creativeSyncUrl = result.body.creativeSyncUrl;
	        			this.creativeUpdateUrl = result.body.creativeUpdateUrl;
	        			this.qualificationAuditUrl = result.body.qualificationAuditUrl;
	        			this.qualificationUpdateUrl = result.body.qualificationUpdateUrl;
	        			this.imageAuditType = result.body.imageAuditType;
	        			this.videoAuditType = result.body.videoAuditType;
	        			this.infoflowAuditType = result.body.infoflowAuditType;
	        			this.securityKey = result.body.securityKey;
	        			
	        			if(this.admode){
	        				if(this.admode.indexOf("1")!=-1){
		        				$(".pricing").click()
		        			}
		        			if(this.admode.indexOf("0")!=-1){
		        				$(".bidding").click()
		        			}
	        			}
	        			for(let i in this.formats){
	        				$("."+this.formats[i]).click()
	        			}
	        			let securityKey = JSON.parse(this.securityKey)
	        			if( securityKey.length != 0){
	        				this.keyArray = [];
	        				for(let i in securityKey){
			        			this.keyArray.push({
			        				key : i,
			        				value : securityKey[i]
			        			})
			        		}
	        			}
		        		
		        		if(!this.keyArray.length){
		        			this.keyArray.push({
								key : "",
								value : "",
							})
		        		}
	        			
	        			
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
	private admodeChange( ele){
		this[ ele] = this[ ele] == true ? false : true;
		if( this.bidding && this.pricing){
			this.admode = "0,1"
		}else if( !this.bidding && this.pricing){
			this.admode = "0"
		}else if( this.bidding && !this.pricing){
			this.admode = "1"
		}else{
			this.admode = ""
		}
	}
	
	//图片格式
	private formatsChange(ele){
		this[ ele] = !this[ ele];
		this.formats = [];
		var type = ["jpg","png","gif","jpeg"];
		for(let i in type){
			if(this[ type[i]]){
				switch( type[i]){
					case "jpg" :
						this.formats.push("18");
					break;
					case "png" :
						this.formats.push("17");
					break;
					case "jpeg" :
						this.formats.push("19");
					break;
					case "gif" :
						this.formats.push("20");
					break;
				}
				
			}
		}	
	}
	
	//是否需要广告主审核,1需要,0不需要
	private needAdvertiserAuditChange(){
		this.needAdvertiserAudit = this.needAdvertiserAudit == "1" ? "0" : "1";
		if(this.needAdvertiserAudit == "0"){
			this.advertiserAuditUrl = "";
			this.qualificationAuditUrl = "";
			this.advertiserSyncUrl = "";
			this.advertiserUpdateUrl = "";
			this.qualificationUpdateUrl = "";
		}
	}
	
	//是否需要创意审核,1需要,0不需要
	private needCreativeAuditChange(){
		this.needCreativeAudit = this.needCreativeAudit == "1" ? "0" : "1";
		if(this.needCreativeAudit == "0"){
			this.creativeAuditUrl = "";
			this.creativeSyncUrl = "";
			this.creativeUpdateUrl = "";
			this.imageAuditType = "2";
			this.videoAuditType = "2";
			this.infoflowAuditType = "2";
		}
	}
	
	//是否支持安全链接,1需要,0不需要
	private supportSslChange(){
		this.supportSsl = this.supportSsl == "1" ? "0" : "1";
	}
	
	//取消按钮
	private back(){
		this.router.navigate(["/home/programmaticChannel/channelList"]);
	}
	
	//保存按钮
	private save(){
		
		if(!this.admode){
			this.myModalService.alert("投放模式至少勾选一个");
		}
		
		if(!this.formats){
			this.myModalService.alert("图片格式至少勾选一个");
		}	
		
		this.securityKey = "";
		let securityKey = {};
		for(let i in this.keyArray){
			if(this.keyArray[i].key && this.keyArray[i].value){
				securityKey[ this.keyArray[i].key] = this.keyArray[i].value;
			}
		}
		this.securityKey = JSON.stringify( securityKey);
		
		if(this.id){
			//编辑
			if( this.validationService.validate()){
				this.channelRootService.editChannel(this.id,{
					address : this.address ? this.address : "",
		        	admode : this.admode,
		        	advertiserAuditUrl : this.advertiserAuditUrl ? this.advertiserAuditUrl : "",
		        	advertiserSyncUrl : this.advertiserSyncUrl ? this.advertiserSyncUrl : "",
		        	advertiserUpdateUrl : this.advertiserUpdateUrl ? this.advertiserUpdateUrl : "",
		       		andrImageTmpl: this.andrImageTmpl ? this.andrImageTmpl : "",
		      		andrInfoflowTmpl: this.andrInfoflowTmpl ? this.andrInfoflowTmpl : "",
		        	andrVideoTmpl: this.andrVideoTmpl ? this.andrVideoTmpl : "",
		        	aurl : this.aurl ? this.aurl : "",
		        	campanyName : this.campanyName,
		        	contacts : this.contacts ? this.contacts : "",
		        	creativeAuditUrl : this.creativeAuditUrl ? this.creativeAuditUrl : "",
		        	creativeSyncUrl : this.creativeSyncUrl ? this.creativeSyncUrl : "",
		        	creativeUpdateUrl : this.creativeUpdateUrl ? this.creativeUpdateUrl : "",
		        	cturl : this.cturl,
		        	domain : this.domain ? this.domain : "",
		        	email : this.email ? this.email : "",
		        	exchangeRate : this.exchangeRate,
		        	formats : this.formats,
		        	name : this.name,
		        	imageAuditType : this.imageAuditType ? this.imageAuditType : "",
		        	infoflowAuditType : this.infoflowAuditType ? this.infoflowAuditType : "",
		        	iosImageTmpl: this.iosImageTmpl ? this.iosImageTmpl : "",
		        	iosInfoflowTmpl: this.iosInfoflowTmpl ? this.iosInfoflowTmpl : "",
		        	iosVideoTmpl: this.iosVideoTmpl ? this.iosVideoTmpl : "",
		       		iurl : this.iurl,
		       		logoPath : this.logoPath ? this.logoPath : "",
		       		needAdvertiserAudit : this.needAdvertiserAudit ? this.needAdvertiserAudit : "",
		       		needCreativeAudit : this.needCreativeAudit ? this.needCreativeAudit : "",
		       		nurl : this.nurl ? this.nurl : "",
		       		qualificationAuditUrl : this.qualificationAuditUrl ? this.qualificationAuditUrl : "",
		       		qualificationUpdateUrl : this.qualificationUpdateUrl ? this.qualificationUpdateUrl : "",
		       		securityKey : this.securityKey ? this.securityKey : "",
		       		supportSsl : this.supportSsl ? this.supportSsl : "",
		      		videoAuditType : this.videoAuditType ? this.videoAuditType : "",
				}).subscribe(
		        	result => {
		        		if(result.head.httpCode = 204){
		        			this.router.navigate(["/home/programmaticChannel/channelDetail/"+this.id]);
		        		}
					},
					error => {
						this.myModalService.alert(error.message);
					}
		        )
			}else{
				 this.validationService.validate();
			}
		}else{
			//创建
			if( this.validationService.validate()){
				this.channelRootService.createChannel({
					address : this.address ? this.address : "",
		        	admode : this.admode,
		        	advertiserAuditUrl : this.advertiserAuditUrl ? this.advertiserAuditUrl : "",
		        	advertiserSyncUrl : this.advertiserSyncUrl ? this.advertiserSyncUrl : "",
		        	advertiserUpdateUrl : this.advertiserUpdateUrl ? this.advertiserUpdateUrl : "",
		       		andrImageTmpl: this.andrImageTmpl ? this.andrImageTmpl : "",
		      		andrInfoflowTmpl: this.andrInfoflowTmpl ? this.andrInfoflowTmpl : "",
		        	andrVideoTmpl: this.andrVideoTmpl ? this.andrVideoTmpl : "",
		        	aurl : this.aurl ? this.aurl : "",
		        	campanyName : this.campanyName,
		        	contacts : this.contacts ? this.contacts : "",
		        	creativeAuditUrl : this.creativeAuditUrl ? this.creativeAuditUrl : "",
		        	creativeSyncUrl : this.creativeSyncUrl ? this.creativeSyncUrl : "",
		        	creativeUpdateUrl : this.creativeUpdateUrl ? this.creativeUpdateUrl : "",
		        	cturl : this.cturl,
		        	domain : this.domain ? this.domain : "",
		        	email : this.email ? this.email : "",
		        	exchangeRate : this.exchangeRate,
		        	formats : this.formats,
		        	name : this.name,
		        	imageAuditType : this.imageAuditType ? this.imageAuditType : "",
		        	infoflowAuditType : this.infoflowAuditType ? this.infoflowAuditType : "",
		        	iosImageTmpl: this.iosImageTmpl ? this.iosImageTmpl : "",
		        	iosInfoflowTmpl: this.iosInfoflowTmpl ? this.iosInfoflowTmpl : "",
		        	iosVideoTmpl: this.iosVideoTmpl ? this.iosVideoTmpl : "",
		       		iurl : this.iurl,
		       		logoPath : this.logoPath ? this.logoPath : "",
		       		needAdvertiserAudit : this.needAdvertiserAudit ? this.needAdvertiserAudit : "",
		       		needCreativeAudit : this.needCreativeAudit ? this.needCreativeAudit : "",
		       		nurl : this.nurl ? this.nurl : "",
		       		qualificationAuditUrl : this.qualificationAuditUrl ? this.qualificationAuditUrl : "",
		       		qualificationUpdateUrl : this.qualificationUpdateUrl ? this.qualificationUpdateUrl : "",
		       		securityKey : this.securityKey ? this.securityKey : "",
		       		supportSsl : this.supportSsl ? this.supportSsl : "",
		      		videoAuditType : this.videoAuditType ? this.videoAuditType : "",
				}).subscribe(
		        	result => {
		        		if(result.id){
		        			this.router.navigate(["/home/programmaticChannel/channelDetail/"+result.id]);
		        		}
					},
					error => {
						this.myModalService.alert(error.message);
					}
		        )
			}else{
				 this.validationService.validate();
			}
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
			value : "",
		})
	}
}
