import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { PackageService } from "../../services/package.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { AdvertiserRootService } from "../../services/advertiser.root.service";
import { FileUploader } from "ng2-file-upload";
import { BaseService } from "../../services/base.service";
import { Page } from "../../models/page.model";
import { Package } from "../../models/package.model";
import { ValidationService } from "../../services/validation.service";
import { ClipboardModule } from '../../../node_modules/ngx-clipboard';
import { PackageRootService } from "../../services/package.root.service";
import "./newIdeasForInformationFlow.less";

declare var $;
declare var require;
declare var profiles;
let path = require("./newIdeasForInformationFlow.html");

@Component({
	selector: "ng-newIdeasForInformationFlow",
	template: path,
})

export class NewIdeasForInformationFlowComponent implements OnInit {

	@ViewChild("allchangeList") allchangeList;
	@ViewChild("regionModal") regionModal;
	@ViewChild("mydatatable") mydatatable;
	@ViewChild("creativeImgModal") creativeImgModal;
	showArr:Array<any> = [];
	private imgresults= [];
	private advertisers = [];
	private campaigns = [];
	private advertiser : any;
	private campaign : any;
	private creative : any;
	private selectedCreatives = [];
	private creatives = [];
	private selected = [];
	private sizes = [];
	private sizeId : number;
	private data: Array<any> = [];
	private headtitletext : any;
	private ctaDesc :string;
	private baseUrl: string;
	private results = [];
	
	private imgPathLoader: any = [];
	
	private imgPath: Array<object> = [];
	
	private detailData : Array<object> = [];
	private goodsStar :number;
	private originalPrice : number;
	private discountPrice:number;
	private salesVolume : number;
	private title : string;
	private description : string;
	private ctaDescription : string;
	private materials : Array<object> = [];
	private materialIds : Array<any> = [];
	private name : string;
	private packageId : number;
	private campaignId : number;
	private posId : number;
	private oIndex :number;
	private oOrderNo : number;
    private oType : string;
	private page:Page = {
        pageNo: 0,
        pageSize: 10,
        total:0
 	};
   
    private errorMessage;
    private packages: Package[] = [];
    private type : string;
	constructor(
		private packageService : PackageService,
		private publicService: PublicService,
		private advertiserRootService:AdvertiserRootService,
		private myModalService:MyModalService,
		private chineseService: ChineseService,
		private router: Router,
		private route:ActivatedRoute,
		private baseService : BaseService,
		private validationService: ValidationService,
		private packageRootService:PackageRootService,
	) {
		this.type = "3";
		this.campaignId = this.route.snapshot.params["campaignId"];
		this.packageId = this.route.snapshot.params["packageId"];
		this.headtitletext = {
			advertiserName:"",
			projectName:"",
			campaignName:""
		}
		this.materials=[]
	}
	
	ngOnInit() {
		this.headtitleinit();
		this.itemInit()
		this.initialization()
	}
	
	private goBack(val){
		this.router.navigate(["/home/campaign/package/packageCreative/"+this.campaignId+"/"+this.packageId+"/"+val]);
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
	
	private initialization(){
		this.ctaDesc = "";
		this.description = "";
		this.discountPrice = null;
		this.goodsStar = null;
		this.materialIds = [];
		this.materials = [];
		this.posId = null;
		this.name = "";
		this.originalPrice = null;
		this.salesVolume = null;
		this.title = "";
		this.imgPath = [];
		this.imgPathLoader = [];
	}
	
	private starChange(num){
		this.goodsStar = num
	}
	
	private itemInit(){
		this.advertiserRootService.channelInfoflowPoses(1,20).subscribe(
			result => {
	            if(result.head.httpCode==200){
	            	this.data=result.body.items;
	            	for(let i in this.data){
	            		this.data[i].infoflowTmpl.imageTmpls = this.publicService.sortByone(this.data[i].infoflowTmpl.imageTmpls,"orderNo");	
	            	}
	            }
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)

		
	}
		
	//上传监听事件

	private back() {
		this.router.navigate(["/campaign/package/packageCreative"]);
	}
	private needGoodsStar: string;
	onActivate($event){	
		if($event.type == "click"){
			let status = false;
			this.initialization()
			this.posId = $event.row.id;
			for(let i=0;i<this.showArr.length;i++){
				status = this.showArr[i];
				if(status && i!=$event.row.$$index){
					return;
				}
			}
			let index;
			for(let i=0;i<this.data.length;i++){
			 	if($event.row == this.data[i]){
			 		index = i;
			 	}
			}
			for(let i=0;i<this.showArr.length;i++){
			 	if(this.showArr[i] == true){
			 		this.mydatatable.toggleExpandRow(this.data[i]);
			 		this.showArr[i] = false;
			 		if(index == i){
			 			return;
			 		}
			 	}
			}
			this.showArr[index] = true;
			this.mydatatable.toggleExpandRow($event.row);	
			this.detailData = $event.row;
			this.needGoodsStar = $event.row.infoflowTmpl.needGoodsStar;
			for(let v = 0; v < $event.row.infoflowTmpl.imageTmpls.length; v++){
				this.materials[v]=undefined;
				
				this.imgPathLoader[v] = new FileUploader({
			        url:this.packageRootService.baseUrl+"/advertise/image",
					allowedFileType:["image"],
					itemAlias: "image",
					autoUpload:true,
			    });
			    let listenUpload = () => {
			        this.imgPathLoader[v].onSuccessItem = (item: any, response: any, status: any, headers: any) => {
			            this.imgPath[v] = JSON.parse(response).path;
			            this.materials[v] = {
			            	id : JSON.parse(response).id,
			            	orderNo : $event.row.infoflowTmpl.imageTmpls[v].orderNo,
			            	type : $event.row.infoflowTmpl.imageTmpls[v].type
			            }
			            console.log(this.materials)
			        };
			        this.imgPathLoader[v].onErrorItem = (item: any, response: any, status: any, headers: any) => {
			            if(status == 401){
			                this.router.navigate(["/login"]);
			            }else if(response){
			                this.myModalService.alert(JSON.parse(response).message);
			            }
			        }
			    };
			    listenUpload();				
			}		
		}		
	}
	private removePath(index){
		this.imgPath[index]=undefined;
		this.materials[index]=undefined;
	}
	private save(){
		console.log(this.materials.length)
		for(let i in this.materials){
			var status = this.materials[i] ? true : false;
			console.log(this.materials[i])
			if(status == false){
				this.myModalService.alert("所有创意均不能为空");
				return;			
			}
		}
		if( this.needGoodsStar == "1" && !this.goodsStar){
			this.myModalService.alert("评分不能为空");
			return;
		}
		if(this.validationService.validate() && status){
			this.advertiserRootService.createCreative({
				ctaDesc : this.ctaDesc ? this.ctaDesc : "",
				description : this.description ? this.description : "",
				discountPrice : this.discountPrice ? this.discountPrice : "",
				goodsStar : this.goodsStar ? this.goodsStar : "",
				materialIds : this.materialIds ? this.materialIds : [],
				materials : this.materials ? this.materials : [],
				name : this.name ? this.name : "",
				originalPrice : this.originalPrice ? this.originalPrice : "",
				packageId : this.packageId ? Math.floor(this.packageId) : "",
				posId : this.posId ? this.posId : "",
				salesVolume : this.salesVolume ? this.salesVolume : "",
				title : this.title ? this.title : "",
				type : this.type ? this.type : ""
			}).subscribe(
				result => {
		            for(let i=0;i<this.showArr.length;i++){
						 if(this.showArr[i] == true){
						 	this.mydatatable.toggleExpandRow(this.data[i]);
						 	this.showArr[i] = false;
						 	
						 	
						 }
					}
		            this.goBack(3)
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		}else{
			this.validationService.validate()
		}
	}
	
	// 刷新表格数据
	private refreshTable(obj?) {
		let options = {
			pageNo: this.page.pageNo + 1,
			pageSize: this.page.pageSize,
		}
		if(obj){
			for(let i in obj){
				options[i] = obj[i];
			}
		}
		this.advertiserRootService.channelInfoflowPoses(options.pageNo,options.pageSize)
			.subscribe(
				result => {
					if (result.head.httpCode == 200) {
						let rows = [];
						for (let i = 0,len = result.body.items.length; i < len; i++) {
							rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
							this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
						}
						this.packages = rows;
						if(result.body.pager){
							this.page = result.body.pager;
							this.page.pageNo--;
							if(!this.packages[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
								this.page.pageNo--;
							}
						}
					}else if(result.head.httpCode == 404){
						this.packages = [];
					}
				},
				error => this.errorMessage = <any>error);
	}
	
	//project添加iswrite属性
	private addIswrite(project){
		project.isWrite = false;
	}
	
	//导入图片和视频
	importCreative(index,type,orderNo,width,height){
		this.oIndex = index;
		this.oType = type;
		this.oOrderNo = orderNo;	
		
		this.advertiser = undefined;
		this.creative = undefined;
		this.campaign = undefined;
		
		this.regionModal.open();
		
		console.log(this.headtitletext.advertiserName)
		let paramAdvertise = {
			advertiserId : this.headtitletext.advertiserId,
		}
		//查询广告项目
		this.packageRootService.queryadvertise(paramAdvertise).subscribe(
			result => {
				this.advertisers = result.body.items;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		//查询所有尺寸
		this.packageRootService.querySize().subscribe(
			result => {
				this.sizes = result.body.items;
				for(let i in this.sizes){
					if(this.sizes[i].width==width && this.sizes[i].height==height){
						this.sizeId = this.sizes[i].id;
						this.queryimg()
					}
				}
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		
	}
	//导入图片
	private queryimg(){
		let paramOpton = {
			advertiserId :this.headtitletext.advertiserId,
			campaignId : this.campaign ? this.campaign.id : "",
			creativeId : this.creative ? this.creative.id : "",
			projectId : this.advertiser ? this.advertiser.id : "",
			sizeId : this.sizeId
		}
		//查询所有图片
		this.packageRootService.importCreatives(paramOpton).subscribe(
			result => {
				this.imgresults = result.body.items;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}
	//查询广告项目之后查询推广活动
	selectedAdvertiser(v){
		let paramCampaigns = {
			projectId:v.id,
		}
		this.advertiser = v;
		//查询推广活动
		this.packageRootService.querycampaigns(paramCampaigns).subscribe(
			result => {
				this.campaigns = result.body.items;
				this.campaign = undefined;
				this.queryimg()
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		//
	}
	//查询推广活动之后查询创意
	selectedCampaign(v){
		let paramCreative = {
			campaignId:v.id,
		}
		this.campaign = v;
		this.packageRootService.queryCreative(paramCreative).subscribe(
			result => {
				this.creatives = result.body.items;
				this.creative = undefined;
				this.queryimg()
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}
	private toggleAppType(v,index){
		v.selected = !v.selected;
	}
	
	private selectedCreate(v){
		this.creative = v;
		this.queryimg()
	}
	
	//导入图片创意提交
	regionModalSubmit(){		
		this.selectedCreatives = [];
		for (var i = 0; i < this.imgresults.length; i++) {
			if (this.imgresults[i].selected) {
				this.selectedCreatives.push(this.imgresults[i]);
			}
		}	
		
		this.imgPath[this.oIndex] = this.selectedCreatives[0].path;
		this.materials[this.oIndex] = {
			id:this.selectedCreatives[0].id,
			type:this.oType,
			orderNo:this.oOrderNo
		}
		console.log(this.materials)
		this.regionModal.close();
	}
	//取消按钮
	regionCancel(){
		this.regionModal.close();
	}
}
