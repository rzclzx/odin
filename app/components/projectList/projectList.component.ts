import { Component,OnInit,ViewChild,TemplateRef,ElementRef} from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { Project } from "../../models/project.model";
import { Page } from "../../models/page.model";
import { ProjectService } from "../../services/project.service";
import { AdvertiserService } from "../../services/advertiser.service";
// import "./projectList.less";

declare var $;
declare var require;
let path =require("./projectList.html");
let psath1=require("./projectList.less");

@Component({
    selector:"ng-projectList",
    template: path,
    styles:['path1']
})

export class ProjectListComponent implements OnInit {
    public mainMenus = [
        {
            name: "投放管理",
            value: undefined
        },
        {
            name: "广告项目管理",
            value: "/home/project/projectList"
		},
    ];
    

    private id: number;
    private project:Project= new Project();
    private projects = [];
    private projectss: Project[] = [];
    private errorMessage;
    private advertisers = [];
	// 这个直接接受参数
	private selected = [];
    private allCheck:boolean;
    private ids:number;
    private code:string;
    private name:string;
    private advertiserName:string;
    private jumpMenu:"编辑";

   
    
    private page= {
		pageNo: 0,
		pageSize: 10,
		total:0,
		currentShow: 1
	};
    
        private startDate: number= new Date().getTime();
    
        private endDate: number= new Date().getTime();
    
    
        constructor(
            private router:Router,
            private publicService: PublicService,
            private chineseService: ChineseService,
            private projectService:ProjectService,
            private myModalService:MyModalService,
            private route: ActivatedRoute,
            private advertiserService:AdvertiserService,
        ) {}
    
        ngOnInit(){
    
            //列表初始化
            // this.itemInit();
            this.refreshTable();
            this.dataInit();
           
          
        }
        MM_jumpMenu(){ //v3.0
            console.log(this.jumpMenu)
            this.router.navigate([this.jumpMenu]);
            }
            
         // 数据初始化
    private dataInit(){
        this.id = this.route.snapshot.params["id"];    
        this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
            autoUpdateInput: false,
		},(start,end) => {
            this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		});
        // this.advertiserService.list().subscribe(
        //     result => {
        //         this.advertisers = result.body.items;
        //     },
        //     error => {
        //         this.myModalService.alert(error.message);
        //     }
        // )
        // this.projectService.list().subscribe(
        //     result => {
        //         this.projectss = result.body.items;
        //         // for(var i=0;i<this.projectss.length;i++){
        //         // this.id=this.projectss[i].id
        //         // }
        //     },
        //     error => {
        //         this.myModalService.alert(error.message);
        //     }
        // )
        
    }
       
       
        

        


        private selectedDate(e) {
            this.startDate = e.startDate._d.getTime();
            this.endDate = e.endDate._d.getTime() - e.endDate._d.getTime()%1000;
            this.refreshTable();
        }
    
        //project添加iswrite属性
        addIswrite(project){
            project.isWrite = false;
        }

       
    
        // 刷新表格数据
	private refreshTable(obj?) {
		let options = {
			startDate: this.startDate,
			endDate: this.endDate,
			pageNo: this.page.pageNo + 1,
            pageSize: this.page.pageSize,
            name:this.name,
            id:this.ids,
            advertiserName:this.advertiserName,
            code:this.code
		}
		if(obj){
			for(let i in obj){
				options[i] = obj[i];
			}
        }
        for(let i = 0;i < 15;i++){
            this.projects.push({
                name: '项目' + i,
                id: i,
                code: i + 3,
                advertiserName: "广告中" + i,
                advertisingAmount: i + 2,
                impression: i*1000,
                click: i*100,
                ctr: i*50,
                cost: i*20,
                ecpm: i*16,
                ecpc: i*25
            })
        }
        this.page.total = 15;
		// this.projectService.list(options)
		// 	.subscribe(
		// 		result => {
		// 			if (result.head.httpCode == 200) {
		// 				let rows = [];
		// 				for (let i = 0,len = result.body.items.length; i < len; i++) {
		// 					rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
		// 					this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
		// 				}
        //                 this.projects = rows;
        //                 // console.log(this.projects)
                        
		// 				if(result.body.pager){
		// 					this.page.pageNo = result.body.pager.pageNo;
        //                     this.page.pageSize = result.body.pager.pageSize;
        //                     this.page.total = result.body.pager.total;
		// 					this.page.pageNo--;
		// 					if(!this.projects[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
		// 						this.page.pageNo--;
		// 					}
		// 				}
		// 			}else if(result.head.httpCode == 404){
		// 				this.projects = [];
		// 			}
		// 		},
		// 		error => this.errorMessage = <any>error);
	}

    private update(e): void{
		this.page.pageSize = e;
		this.refreshTable({pageNo: 1});
    }
    
    //监听分页
	private onPage(event){
		if(event === 1){
            this.page.pageNo = 0;
            this.page.currentShow = 1;       
		} 
		this.refreshTable();
	}
       
      

     //去新建项目页面
     private gotoprojectForm(){
        this.router.navigate(["/home/project/projectForm"]);
    }
    private goprojectEdit(id){
        this.router.navigate(["/home/project/projectEdit",id]);
    }
    private gotocampaignForm(){
        this.router.navigate(["/home/campaign/campaignForm"]);
    }
    private gotocampaignList(id){
        this.router.navigate(["/home/project/campaignList",id]);
    }
    }