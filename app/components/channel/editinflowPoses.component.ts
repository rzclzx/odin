import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { CreativeSizeManagementService } from "../../services/creativeSizeManagement.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";
import { BaseService } from "../../services/base.service";

declare var $;
declare var require;
let path = require("./editinflowPoses.html");
let path1= require("./imageSize.less")

@Component({
	selector: "ng-editinflowPoses",
	template: path,
	styles:['path1']
})

export class EditinflowPosesComponent implements OnInit {
	private adxId:number;
	private code:number;
	private infoflowTmplId:number;
	private name:string;
	private adxs=[];
	private infoflowTmpls=[];
	private infoflowTmplss={};
	private infoflowTmpl={};
	private id:number;
	// private infoflowTmpl;
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
            name: "原生广告位",
            value: "/home/creativeSizeManagement/inflowPoses"
		},
		{
            name: "编辑",
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
		private route: ActivatedRoute,
		private baseService:BaseService
	) {}

	ngOnInit() {
		this.id = this.route.snapshot.params["id"];
		//查询渠道
		this.creativeSizeManagementService.adxs().subscribe(
			result => {
					this.adxs=result.body.items;
			},
			error => {
				//	this.myModalService.alert(error.message);
			}
		)
		//原生广告位模板
		this.creativeSizeManagementService.infoflowTmpls().subscribe(
			result => {
					this.infoflowTmpls=result.body.items;
			},
			error => {
				//	this.myModalService.alert(error.message);
			}
		)
		this.creativeSizeManagementService.getinflowId(this.id).subscribe(
			result => {
					// this.infoflowTmplss=result.body;
					this.code=result.body.code;
					this.name=result.body.name;
					this.adxId=result.body.adxId;
					this.infoflowTmplId=result.body.infoflowTmpl.id;
					console.log(this.infoflowTmplId)
			},
			error => {
				//	this.myModalService.alert(error.message);
			}
		)
		}
		
	// 取消
	private  cancel(){
		this.router.navigate(["/home/creativeSizeManagement/inflowPoses"]);
	}


	//保存
	save() {
		if (this.validationService.validate()) {
				let options={
					adxId:this.adxId,
					infoflowTmplId:this.infoflowTmplId,
					name:this.name
				}
					this.creativeSizeManagementService.editinflowId(this.id,options).subscribe(
						result => {
								// this.infoflowTmplss=result.body.items;
								this.router.navigate(["/home/creativeSizeManagement/inflowPoses"]);
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