import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { CreativeSizeManagementService } from "../../services/creativeSizeManagement.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";

declare var $;
declare var require;
let path = require("./addimageSize.html");
let path1= require("./imageSize.less")

@Component({
	selector: "ng-addimageSize",
	template: path,
	styles:['path1']
})

export class AddimageSizeComponent implements OnInit {
	private adtypeId:string;
	private height:number;
	private id:number;
	private remark:string;
	private width:number;
	private pageNo:number;
	private pageSize:number;
	private total:number;
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
            name: "尺寸管理",
            value: "/home/creativeSizeManagement/imageSize"
		},
		{
            name: "新增尺寸",
            value: ""
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
		this.adtypeId=undefined;
		}
		
	// 取消
	private  cancel(){
		this.router.navigate(["/home/creativeSizeManagement/imageSize"]);
	}


	//保存
	save() {
		if (this.validationService.validate()) {
			if(this.adtypeId=="undefined"){
				let options={
					width:this.width,
					height:this.height,
					// adtypeId:this.adtypeId,
					remark:this.remark
				}
					this.creativeSizeManagementService.addSize(options).subscribe(
						result => {
							if ((this.id && result.head.httpCode == 204) || (!this.id && result.head.httpCode == 201)){
								this.id=result.body;
								console.log(this.id)
								this.router.navigate(["/home/creativeSizeManagement/imageSize"]);
							}else{
								this.myModalService.alert(result.body.message);
							}
						}
					)
			}else{
				let options={
					width:this.width,
					height:this.height,
					adtypeId:this.adtypeId,
					remark:this.remark
				}
					this.creativeSizeManagementService.addSize(options).subscribe(
						result => {
							if ((this.id && result.head.httpCode == 204) || (!this.id && result.head.httpCode == 201)){
								this.id=result.body;
								console.log(this.id)
								this.router.navigate(["/home/creativeSizeManagement/imageSize"]);
							}else{
								this.myModalService.alert(result.body.message);
							}
						}
					)
			}
		} else {
			this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
		}
		
	}

}