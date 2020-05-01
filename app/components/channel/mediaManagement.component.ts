import { Component,OnInit,ViewChild,ElementRef,ViewChildren } from "@angular/core";
import { Http,Response,RequestOptions,Headers,HttpModule} from '@angular/http';
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { Page } from "../../models/page.model";

import { mediaManagementRootService } from "../../services/mediaManagement.root.service";
import "./mediaManagement.component.less";

declare var $;
declare var require;
let path = require("./mediaManagement.html");
declare var profiles;


@Component({
    selector: "ng-mediaManangement",
    template: path,
})

export class MediaManagementComponent implements OnInit {
   /* headtitletext={
        appnumber:"",
        sameappnumber:"",
        appblacknumber:"",
        updatatime:""
    };*/
    channel;
    datas = [];
    adxdatas = [];
    selected = [];
    allCheck:boolean;
    appName;
    appId;
    appStatu;
    appStatus = [
        {'name':"白名单",'id':'1'},
        {'name':"黑名单",'id':'0'}
    ];

    @ViewChild("allchangeList") allchangeList;

    private errorMessage;
    private page: Page = {
        pageNo: 0,
        pageSize: 10,
        total: 0
    };
    public mainMenus = [
        {
            name: "渠道管理",
            value: undefined
        },
        {
            name: "媒体管理",
            value: "/home/campaign/campaignList"
        },
    ];


    constructor(
        private publicService: PublicService,
        private chineseService: ChineseService,
        private myModalService: MyModalService,
        private router:Router,
        private http:Http,
        private route:ActivatedRoute,
        private mediaManagementRootService:mediaManagementRootService,
    ) {
        this.allCheck = false;
    }


    ngOnInit() {
        this.refreshTable()

        this.dataInitadx();
    }

    //过滤obj结果
    filterobj(paramOpton){
        let x;
        let params={};
        if(paramOpton){
            for(x in paramOpton){
                if(paramOpton[x] != "undefined" && paramOpton[x] != undefined && paramOpton[x] != ""){
                    params[x] = paramOpton[x];
                }
            }
        }
        return params
    }



    //advertiser添加iswrite属性
    private addIswrite(advertiser){
        advertiser.isWrite = false;
    }
    //监听分页
    private onPage(event){
        this.page.pageNo = event.offset;
        this.refreshTable();
    }

    // 刷新表格数据
    private refreshTable(obj?) {
        let options = {
            pageNo: this.page.pageNo + 1,
            pageSize: this.page.pageSize,
            names:this.appName?this.appName.toString():undefined,
            id:this.appId,
            status:this.appStatu?this.appStatu.id:undefined,
            adxId:this.channel?this.channel.id:undefined
        }
        if(obj){
            for(let i in obj){
                options[i] = obj[i];
            }
        }
        let params = this.filterobj(options);
        this.mediaManagementRootService.querymedialist(params).subscribe(
            result => {
                if(result.head.httpCode == 200) {
                    let rows = [];
                    for(let i = 0, len = result.body.items.length; i < len; i++) {
                        rows[(options.pageNo - 1) * options.pageSize + i] = result.body.items[i];
                        this.addIswrite(rows[(options.pageNo - 1) * options.pageSize + i]);
                    }
                    this.datas = rows;
                    this.selected = [];
                    this.allCheck = false;

                    if(result.body.pager) {
                        this.page = result.body.pager;
                        this.page.pageNo--;
                        if(!this.datas[this.page.pageSize * this.page.pageNo] && this.page.pageNo > 0) {
                            this.page.pageNo--;
                        }
                    }
                } else if(result.head.httpCode == 404) {
                    this.datas = [];
                }
            },
            error => this.errorMessage = <any>error
        );
    }


    private dataInitadx(){
        let params;
        let obj={
        };
        params = this.filterobj(obj);
        this.mediaManagementRootService.queryadxlist(params).subscribe(
            result => {
                this.adxdatas = result.body.items;
            },
            error => {
             //   this.myModalService.alert(error.message);
            }
        )
    }

    queryStatus(status){
        if(status == "1"){
            return "白名单"
        }
        if(status == "0"){
            return "黑名单"
        }
    }

    add(){
        this.router.navigate(["/home/mediaManagement/addMediaManagement/"]);
    }

    editMediaManagement(row){
        this.router.navigate(["/home/mediaManagement/editMediaManagement/",row.adxId,row.id]);
    }

    black(v){
        let status;
        status = v;
        if(this.selected.length == 0){
            this.myModalService.alert("请选择媒体！");
            return ;
        }
        let checkids=[];
        for(let i =0;i<this.selected.length;i++){
            checkids.push({adxId:this.selected[i].adxId,id:this.selected[i].id})
        }

        let params={
            items:checkids,
            status:status
        };
        this.mediaManagementRootService.blacklist(params).subscribe(
            result => {
                this.refreshTable()
            },
            error => {
            //    this.myModalService.alert(error.message);
            }
        )
    }

    onSelect(event,page){
        if(!event.selected)
            return;
        this.allCheck = event.selected.length == ((page.pageNo+1)*page.pageSize > page.total ? page.total % page.pageSize : page.pageSize) ? true : false;
    }

    allToggleOuter(event,v){
        this.allToggle(this.allchangeList,this.allCheck,this.datas);
    }


    //全选切换
    allToggle(table,allcheck,data){
        table.selected.splice(0,table.selected.length);
        if(allcheck){
            let start = table.offset*table.pageSize,
                end = (table.offset+1)*table.pageSize > table.rowCount ? table.rowCount : (table.offset+1)*table.pageSize;
            for(let i=start;i<end;i++){
                table.selected.push(data[i])
            }
        }
    }

}
