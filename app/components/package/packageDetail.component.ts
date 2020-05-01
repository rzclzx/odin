import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { MyModalService } from "../../services/myModal.service";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { PackageService } from "../../services/package.service";
import { Package } from "../../models/package.model";


declare var $;
declare var Clipboard;
declare var require;
let path = require("./packageDetail.html");

@Component({
	selector: "ng-packageDetail",
	template: path
})

export class PackageDetailComponent implements OnInit {
	public mainMenus = [
        {
            name: "投放管理",
            value: undefined
        },
        {
            name: "推广活动管理",
            value: "/home/campaign/campaignAudited"
		},
		{
            name: "物料包",
            value: "/home/campaign/package/packageList/"+this.route.snapshot.params["campaignId"]
		},
		{
            name: "物料包详情",
            value: undefined
		}
    ];

	private datas = [];
    private package:Package=new Package();
	private errorMessage;
	private id:number;
	private campaignId:number;
	private packageId:number;
	private packageIds:number;
	private text;

	constructor(
		private publicService: PublicService,
        private chineseService: ChineseService,
        private packageService:PackageService,
		private router:Router,
		private myModalService:MyModalService,
		private route:ActivatedRoute,
	) {
		
	}

	ngOnInit() {
		this.dataInit();
	}
	//数据初始化
	private dataInit(){
		this.packageId = this.route.snapshot.params["packageId"]; 
		this.campaignId = this.route.snapshot.params["campaignId"];
		this.packageService.getId(this.packageId).subscribe(
			result => {
				this.package = result.body;
				if(this.package.needMonitorCode=="1"){
					this.text=`<script>
var _pxe=_pxe||[];
var _pxe_id='${this.package.id}';
(function(){var pxejs=document.createElement('script');
var _pxejsProtocol=(('https:'==document.location.protocol)?'https://':'http://');
pxejs.src=_pxejsProtocol+'//img.pxene.com/pxene.js';	
var one=document.getElementsByTagName('script')[0];
one.parentNode.insertBefore(pxejs,one);})();
</script>`
				}
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}
	//路由跳转
	private gotopackageList(campaignId){
		this.router.navigate(["/home/campaign/package/packageList",campaignId]);
	}
	private gotopackageEdit(){
		this.router.navigate(["/home/campaign/package/packageEdit",this.campaignId,this.packageId]);
    }
}