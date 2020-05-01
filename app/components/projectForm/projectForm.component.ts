import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { ValidationService } from '../../services/validation.service';
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { BaseService } from "../../services/base.service";
import { Project } from "../../models/project.model";
import { PublicService } from "../../services/public.service";
import { Advertiser } from "../../models/advertiser.model";
import { AdvertiserService } from "../../services/advertiser.service";
import { IndustryService } from "../../services/industry.service";
import { Industry } from "../../models/industry.model";


import { ProjectService } from "../../services/project.service";
// import './projectForm.less';

declare var $;
declare var require;
let path = require("./projectForm.html");
let path1=require('./projectForm.less');


@Component({
	selector: "ng-projectForm",
	template: path,
	styles:['path1']
})

export class ProjectFormComponent implements OnInit {
	public mainMenus = [
        {
            name: "投放管理",
            value: undefined
        },
        {
            name: "广告项目管理",
            value: "/home/project/projectList"
		},
		{
            name: "",
            value: undefined
        },
    ];

	private project = new Project();
	private errorMessage;
	private advertisers = [];
	private advertiser;
	private industrys = [];
	private industry;
	private id:number;
	private name:string;
	private projects=[];
	private projecs=[];
	

	constructor(
		private router:Router,
		private route: ActivatedRoute,
		private baseService:BaseService,
		private projectService: ProjectService,
		private validationService: ValidationService,
		private chineseService:ChineseService,
		private myModalService:MyModalService,
		private advertiserService: AdvertiserService,
		private publicService: PublicService,
		private industryService:IndustryService
	) {}

	ngOnInit() {
		this.dataInit();
}


	private dataInit(){
		this.id = this.route.snapshot.params["id"];
		if(this.id){
			this.mainMenus[2].name = "编辑广告项目";
			this.editInit();
			$("#selectid").attr("disabled","true");
			$("#projectId").show();
		}   
		this.advertiserService.list().subscribe(
			result => {
				this.advertisers = result.body.items;
					for(var i=0 ;i<this.advertisers.length;i++){
						if(this.advertisers[i].id==this.project.advertiserId){
							this.advertiser=this.advertisers[i];
							//  console.log(this.advertise r)
						}
					}
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		this.industryService.list().subscribe(
			result => {
				this.industrys = result.body.items;
				for(var i=0;i<this.industrys.length;i++){
					if(this.industrys[i].id==this.project.industryId){
						this.industry=this.industrys[i];
					}
				}
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		if(!this.id){
			this.mainMenus[2].name = "新建广告项目";
			$("#projectId").hide();
		}	 
	}
	 // 广告主选择
	 private selectedAdvertiser(){
			this.project.advertiserId=this.advertiser.id;
            this.projectService.list().subscribe(
                result => {
					this.projects = result.body;
					// console.log(this.projects);
                },
                error => {
                    this.myModalService.alert(error.message);
                }
            )
        
	}
	 // 行业选择
	 private selectedIndustry(){
        if(!this.industry){
            this.projecs = [];
        }else{
			this.project.industryId=this.industry.id;
            this.projectService.list().subscribe(
                result => {
					this.projecs = result.body;
                },
                error => {
                    this.myModalService.alert(error.message);
                }
            )
        }
    }
	

	// 取消
	private  cancel(){
		this.router.navigate(["/home/project/projectList"]);
	}


	//保存
	save() {
		if(this.id){
			if (this.validationService.validate()) {	
				this.saveItem().subscribe(
					result => {
						if ((this.id && result.head.httpCode == 204) || (!this.id && result.head.httpCode == 201)){
							this.project.capital=this.project.capital*100;
							this.router.navigate(["/home/project/projectDetail",+this.id]);
						}else{
							this.myModalService.alert(result.body.message);
						}
					},
					error => {
						this.myModalService.alert(error.message)
					}
				);
			} else {
				this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
			}
		}else{
			if (this.validationService.validate()) {
				this.saveItem().subscribe(
					result => {
						if ((this.id && result.head.httpCode == 204) || (!this.id && result.head.httpCode == 201)){
							this.project.capital=this.project.capital*100;
							this.id=result.body.id;
							this.router.navigate(["/home/campaign/campaignList",+this.id]);	
						}else{
							this.myModalService.alert(result.body.message);
						}
					},
					error => {
						this.myModalService.alert(error.message)
					}
				);
			} else {
				this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
			}
		}
	}


	saveItem(){
		return this.id ? this.projectService.update1(this.id, this.project) : this.projectService.create(this.project)
	}


	
    // 编辑初始化
    private editInit(){
		// this.id = this.route.snapshot.params["id"];
		this.projectService.getId(this.id).subscribe(
			result => {
				this.project = result.body;
				// this.project.capital=this.project.capital/100;
				for(let i=0,len=this.advertisers.length;i<len;i++){
					if(this.advertisers[i].id==this.project.advertiserId){
						this.advertiser=this.advertisers[i];
					}
				};
				for(let i=0,len=this.industrys.length;i<len;i++){
					if(this.industrys[i].id == this.project.industryId){
						this.industry = this.industrys[i];
					}
				};
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	} 

}