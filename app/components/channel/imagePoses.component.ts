import { Component,OnInit,ViewChild } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { BaseService } from "../../services/base.service";
import { CreativeSizeManagementService } from "../../services/creativeSizeManagement.service";
import { MyModalService } from "../../services/myModal.service";
import { Page } from "../../models/page.model";

declare var $;
declare var require;
let path = require("./imagePoses.html");
let path1= require("./imageSize.less")

@Component({
	selector: "ng-imagePoses",
	template: path,
	styles:['path1']
})

export class ImagePosesComponent implements OnInit {
	@ViewChild("imagePosesDatatable") imagePosesDatatable;
	private adtypeId:string;
	private adxId:number;
	private adxName:string;
	private height:number;
	private sizeId:number;
	private status:string;
	private width:number;
	private pageNo:number;
	private pageSize:number;
	private total:number;
	private images=[];
	private imagePoses=[];
	private imagePosesSelected = [];
	private options=[];
	private errorMessage;
	private imagePosesAllcheck: boolean = false;

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
            value: undefined
        }
    ];


	private page = {
		pageNo: 0,
		pageSize: 10,
		total:0
	};



	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private creativeSizeManagementService:CreativeSizeManagementService,
		private router:Router,
		private myModalService:MyModalService
	) {}

	ngOnInit() {
		this.refreshTable();
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
	this.creativeSizeManagementService.imageList(options.pageNo,options.pageSize)
		.subscribe(
			result => {
				if (result.head.httpCode == 200) {
					let rows = [];
					for (let i = 0,len = result.body.items.length; i < len; i++) {
						rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
						this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
					}
					this.images = rows;
					if(result.body.pager){
						this.page = result.body.pager;
						this.page.pageNo--;
						if(!this.images[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
							this.page.pageNo--;
						}
					}
				}else if(result.head.httpCode == 404){
					this.images = [];
				}
			},
			error => this.errorMessage = <any>error);
}

  //project添加iswrite属性
  addIswrite(project){
	project.isWrite = false;
}


// private update(e): void{
// 	this.page.pageSize = e;
// 	this.refreshTable({pageNo: 1});
// }

// 监听分页
	private onPage(event){
		this.page.pageNo = event.offset;
		this.refreshTable();
	}

    //全选切换
	private allToggle(table,allcheck,data){
		table.selected.splice(0,table.selected.length)
		if(allcheck){
			for(let i = 0;i < data.length;i++){
				table.selected.push(data[i]);
			}
		}
	}
	private onSelect(event,value){		
		if(!event.selected){
			return;
		}
		this.imagePosesAllcheck = event.selected.length === this.images.length ? true : false;	
	}
	private allCheckFire(value){
	this.allToggle(this.imagePosesDatatable,this.imagePosesAllcheck,this.images);
	}
	//点击开始
	private start(){
		if(this.imagePosesSelected.length===0){
			return;
		}
		// let option=[];
		for(let i =0;i<this.imagePosesSelected.length;i++){
			this.adxId=this.imagePosesSelected[i].adxId;
			this.sizeId=this.imagePosesSelected[i].sizeId;
			// this.option.push(this.imagePosesSelected[i].adxId)
			// this.option.push(this.imagePosesSelected[i].sizeId)
			//开关开启
		let option={
			adxId:this.adxId,
			sizeId:this.sizeId
		}
		this.options.push(option)
		}	
		
		this.creativeSizeManagementService.imageEnable(this.options).subscribe(
			result => {
				this.refreshTable();
				this.imagePosesSelected=[];
				this.imagePosesAllcheck=false;
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}
	//点击暂停
	private stop(){
		if(this.imagePosesSelected.length===0){
			return;
		}
		for(let i =0;i<this.imagePosesSelected.length;i++){
			// this.adxId=this.imagePosesSelected[i].adxId;
			this.adxId=this.imagePosesSelected[i].adxId;
			this.sizeId=this.imagePosesSelected[i].sizeId;
			let option={
				adxId:this.adxId,
				sizeId:this.sizeId
			}
			this.options.push(option)
		}	
		
		this.creativeSizeManagementService.imagedisable(this.options).subscribe(
			result => {
				this.refreshTable();
				this.imagePosesSelected=[];
				this.imagePosesAllcheck=false;
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}


	//开关修改
	switchChange(row) {
		let options=[];
		let enable=row.enable?row.enable:"0";
		let option={
			adxId:row.adxId,
			sizeId:row.sizeId
		}
		this.options.push(option)
		if(enable == "1"){	//如果状态为启动（1），再次点击需要暂停。
			this.creativeSizeManagementService.imagedisable(this.options).subscribe(
				result => {
					this.refreshTable()
				},
				error => {
				//	this.myModalService.alert(error.message);
				}
			)

		} else {
			this.creativeSizeManagementService.imageEnable(this.options).subscribe(
				result => {
					this.refreshTable()
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		}
	}
	private gotoaddimagePoses(){
		this.router.navigate(["/home/creativeSizeManagement/addimagePoses"]);
	}
	private gotoimageSize(){
		this.router.navigate(["/home/creativeSizeManagement/imageSize"]);
	}
	private gotovideoPoses(){
		this.router.navigate(["/home/creativeSizeManagement/videoPoses"]);
	}
	private gotoinfoflowPoses(){
		this.router.navigate(["/home/creativeSizeManagement/inflowPoses"]);
	}
 }