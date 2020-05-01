import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { CreativeSizeManagementService } from "../../services/creativeSizeManagement.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";

declare var $;
declare var require;
let path = require("./addinflowTmpls.html");
let path1= require("./imageSize.less")

@Component({
	selector: "ng-addinflowTmpls",
	template: path,
	styles:['path1']
})

export class AddinflowTmplsComponent implements OnInit {
	private bigImageSizes=[];
	private maxVolume:number;
	private maxVolume1:number;
	private iconmaxVolume:number;
	private orderNo:number;
	private sizeId:number;
	private ctaDescMaxLen:number;
	private descriptionMaxLen:number;
	private iconImageSizes=[];
	private titleMaxLen:number;
	private imageFormats=[];
	private format1;
	private format2;
	private format3;
	private format4;
	private name:string;
	private infoflowTmpls=[];
	private errorMessage;
	private sizes=[];
	private size;
	private size1;
	private size2;
	private descriptionRequire:string="1";
	private ctaDescRequire:string="1";
	private needGoodsStar:string="1";
	private needOriginalPrice:string="1";
	private needDiscountPrice:string="1";
	private needSalesVolume:string="1";
	private bigImage=[];
	private v;
	private iconsizeId:number;
	private id:number;

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
            name: "原生广告位",
            value: "/home/creativeSizeManagement/inflowTmpls"
		},
		{
            name: "新增原生模板",
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
		this.bigImage['name']=undefined;
		//图片尺寸查询
		this.creativeSizeManagementService.sizelist().subscribe(
			result => {
					this.sizes=result.body.items;
			},
			error => {
				//	this.myModalService.alert(error.message);
			}
		)
	
		
		}
		
		//添加图片
		private addImage1(){ 				
				if(this.bigImage.length<4){
					this.bigImage.push({'name':undefined,'maxVolume2':''});
				}
		}
		
	// 取消
	private  cancel(){
		this.router.navigate(["/home/creativeSizeManagement/inflowTmpls"]);
	}


	//保存
	save() {
		if (this.validationService.validate()) {
			if(this.format1==true){
				this.imageFormats.push("17");
			}
			if(this.format2==true){
				this.imageFormats.push("18");
			}
			if(this.format3==true){
				this.imageFormats.push("18");
			}
			if(this.format4==true){
				this.imageFormats.push("0");
			}
			//icon图
			let iconImageSize={
				sizeId:this.size,
				maxVolume:this.maxVolume-0,
				orderNo:1
			}
			this.iconImageSizes.push(iconImageSize);
			//大图
			let bigImageSize={
				sizeId:this.size1,
				maxVolume:this.maxVolume1-0,
				orderNo:1
			}
			this.bigImageSizes.push(bigImageSize);
			// console.log(this.bigImage['name'])
			for( var i=0;i<this.bigImage.length;i++){
				i+2;
				let bigImageSize1={
					sizeId:this.bigImage[i].name,
					maxVolume:this.bigImage[i].maxVolume2,
					orderNo:i+2
				}
				this.bigImageSizes.push(bigImageSize1);
			}
			console.log(this.bigImageSizes)
				let options={
					titleMaxLen:this.titleMaxLen,
					needSalesVolume:this.needSalesVolume,
					needOriginalPrice:this.needOriginalPrice,
					needGoodsStar:this.needGoodsStar,
					needDiscountPrice:this.needDiscountPrice,
					name:this.name,
					imageFormats:this.imageFormats,
					iconImageSizes:this.iconImageSizes,
					descriptionRequire:this.descriptionRequire,
					descriptionMaxLen:this.descriptionMaxLen,
					ctaDescRequire:this.ctaDescRequire,
					ctaDescMaxLen:this.ctaDescMaxLen,
					bigImageSizes:this.bigImageSizes
				}
					this.creativeSizeManagementService.addinflowTmpls(options).subscribe(
						result => {
								// this.id=result.body;
								// console.log(result.body)
								this.router.navigate(["/home/creativeSizeManagement/inflowTmpls"]);
						}
					),
					error => {
					//	this.myModalService.alert(error.message);
				}
		} else {
			this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
		}
		
	}

}