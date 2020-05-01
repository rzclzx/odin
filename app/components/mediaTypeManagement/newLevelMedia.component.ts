import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChannelRootService } from "../../services/channel.root.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";
import { ChineseService } from "../../services/chinese.service";

declare var $;
declare var require;
let path = require("./newLevelMedia.html");

@Component({
	selector: "ng-newLevelMedia",
	template: path
})

export class NewLevelMediaComponent implements OnInit {
	private level: number;
	private title: string;
	private id: number;
	private name: string;
	private oneLevelName: string;
	private oneLevelId: number = 0;
	private level1Array : Array<object> = [];
	private twoLevelName: string;
	private twoLevelId: number = 0;
	private level2Array : Array<object> = [];
	private threeLevelName: string;
	private threeLevelId: number = 0;
	private channel: Array<object> = [];
	
	private typeAdxs: Array<any> = [
		{
			adxId : "",
			code : ""
		}
	];
	constructor(
		private route:ActivatedRoute,
		private validationService: ValidationService,
		private publicService: PublicService,
		private chineseService: ChineseService,
		private myModalService: MyModalService,
		private router: Router,
		private channelRootService: ChannelRootService,
	) {
		
	}

	ngOnInit() {
		this.level = this.route.snapshot.params["level"]; 
		this.id = this.route.snapshot.params["id"] -0; 
		this.channelRootService.batchQueryChannel( ).subscribe(
			result => {
				this.channel = result.body.items;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		);
		
		
		let options = {
			level : "1"
		}
		if(this.level > 1){
			this.channelRootService.queryAppTypes( options).subscribe(
				result => {	
					if(result.head.httpCode == 200){
						this.level1Array = result.body.items;
					}
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		}
		if( this.id){
			this.channelRootService.queryAppTypeDetail( this.id).subscribe(
				result => {	
					if(result.head.httpCode == 200){
						this.oneLevelId = result.body.oneLevelId;
						this.oneLevelName = result.body.oneLevelName;
						this.oneLevelChange();
						this.twoLevelId = result.body.twoLevelId;
						this.twoLevelName = result.body.twoLevelName;
						this.threeLevelId = result.body.threeLevelId;	
						this.threeLevelName = result.body.threeLevelName;
						
					}
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		}
	}
	
	public mainMenus = [
        {
            name: "渠道管理",
            value: undefined
        },{
            name: "媒体分类管理",
            value: "/home/mediaTypeManagement/mediaTypeManagement"
        },
        {
            name: (this.route.snapshot.params["id"] ? "编辑 " : "新增 ") + (this.route.snapshot.params["level"]+"级分类"),
            value: undefined
        }
    ];
    
    private addTypeAdxs(){
    	this.typeAdxs.push({
			adxId : 0,
			code : ""
		})
    }
    
    private removeTypeAdxs( index){
    	this.typeAdxs.splice( index, 1)
    }
    
    private back(){
		this.router.navigate(["/home/mediaTypeManagement/mediaTypeManagementList"]);
    }
	
	private save(){
		for( let i in this.typeAdxs){
			if( this.typeAdxs[i].adxId){
				if( !this.typeAdxs[i].code){
					this.myModalService.alert("若选择了渠道，则渠道ID必填");
					return;
				}
			}
		}
		if( this.validationService.validate()){
			if( this.id){
				//编辑
				let options
				if( this.level == 1){
					options = {
						id : this.id,
						level : this.level+'',
						name : this.oneLevelName,
						typeAdxs : this.typeAdxs.length == 1 && !this.typeAdxs[0].adxId ? null : this.typeAdxs,
					}
				}else{
					options = {
						id : this.id,
						level : this.level+'',
						name : this.level == 2 ? this.twoLevelName : this.threeLevelName,
						typeAdxs : this.typeAdxs.length == 1 && !this.typeAdxs[0].adxId ? null : this.typeAdxs,
						parentId : this.level == 2 ? this.oneLevelId : this.twoLevelId
					}
				}
				
				this.channelRootService.editAppType( this.id,options).subscribe(
					result => {	
						if( result.head.httpCode == 204){
							this.back()
						}
					},
					error => {
						this.myModalService.alert(error.message);
					}
				)
				
				
			}else{
				let options;
				if( this.level == 1){
					options = {
						level : this.level+'',
						name : this.oneLevelName,
						typeAdxs : this.typeAdxs.length == 1 && !this.typeAdxs[0].adxId ? null : this.typeAdxs,
					}
				}else{
					options = {
						level : this.level+'',
						name : this.level == 2 ? this.twoLevelName : this.threeLevelName,
						typeAdxs : this.typeAdxs.length == 1 && !this.typeAdxs[0].adxId ? null : this.typeAdxs,
						parentId : this.level == 2 ? this.oneLevelId : this.twoLevelId
					}
				}
				//创建
				this.channelRootService.createAppType( options).subscribe(
					result => {	
						if( result.body.id){
							this.back()
						}
					},
					error => {
						this.myModalService.alert(error.message);
					}
				)
			}
		}else{
			this.validationService.validate()
		}
	}
	
	private oneLevelChange(){
		this.twoLevelId = 0;
		if( this.oneLevelId){
			let options = {
				level : "2",
				parentId : this.oneLevelId
			}
			this.channelRootService.queryAppTypes( options).subscribe(
				result => {	
					if(result.head.httpCode == 200){
						this.level2Array = result.body.items;
					}
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		}
	}
}