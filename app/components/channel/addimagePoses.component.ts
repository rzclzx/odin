import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { CreativeSizeManagementService } from "../../services/creativeSizeManagement.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";

declare var $;
declare var require;
let path = require("./addimagePoses.html");
let path1= require("./imageSize.less")

@Component({
	selector: "ng-addimagePoses",
	template: path,
	styles:['path1']
})

export class AddimagePosesComponent implements OnInit {
	private adxId:number;
	private sizeId:number;
	private adxs=[];
	private sizes=[];
	private errorMessage;

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
            name: "图片广告位",
            value: "/home/creativeSizeManagement/imagePoses"
		},
		{
            name: "新增",
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
			//查询渠道
			this.creativeSizeManagementService.adxs().subscribe(
				result => {
						this.adxs=result.body.items;
						console.log(this.adxs)
				},
				error => {
					//	this.myModalService.alert(error.message);
				}
			)
			//查询尺寸
			this.creativeSizeManagementService.sizelist().subscribe(
				result => {
						this.sizes=result.body.items;
						console.log(this.sizes)
				},
				error => {
					//	this.myModalService.alert(error.message);
				}
			)
		}
		
	// 取消
	private  cancel(){
		this.router.navigate(["/home/creativeSizeManagement/imagePoses"]);
	}


	//保存
	save() {
		if (this.validationService.validate()) {
				let options={
					adxId:this.adxId,
					sizeId:this.sizeId,
				}
					this.creativeSizeManagementService.addimagePoses(options).subscribe(
						result => {
								console.log(result.body)
								this.router.navigate(["/home/creativeSizeManagement/imagePoses"]);
						},
						error => {
							//	this.myModalService.alert(error.message);
						}
					)
			}
	}

}