import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { BaseService } from "../../services/base.service";
import { Project } from "../../models/project.model";
import { ProjectService } from "../../services/project.service";
// import "./projectDetail.less";

declare var $;
declare var require;
let path = require("./projectDetail.html");
let path1= require("./projectDetail.less");

@Component({
	selector: "ng-projectDetail",
	template: path,
	styles:['path1']
})

export class ProjectDetailComponent implements OnInit {
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
            name: "广告项目详情",
            value: undefined
		}
    ];

	private datas = [];
	private projects:Project=new Project();
	private id:number;
	private page = {
		pageNo: 0,
		pageSize: 10,
		total:15
	};
	private startDate: number = new Date().getTime();
    
    private endDate: number = new Date().getTime();


	constructor(
		private router: Router,
		private publicService: PublicService,
		private chineseService: ChineseService,
		private projectService:ProjectService,
		private myModalService:MyModalService,
		private route:ActivatedRoute
	) {
}

	ngOnInit() {	
		this.detailInit();
		
	 }

	 private detailInit(){
		this.id = this.route.snapshot.params["id"];  
		this.projectService.getId(this.id).subscribe(
			result => {
				  this.projects = result.body;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}
	
	

	 //返回
	 private  back(){
		this.router.navigate(["/home/project/projectList"]);
	}
	//编辑
	private gotoEditItem(id){
		this.router.navigate(["/home/project/projectEdit",id]);
	}

}