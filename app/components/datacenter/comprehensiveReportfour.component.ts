import { Component,OnInit,ViewChild,ElementRef,ViewChildren } from "@angular/core";
import { Http,Response,RequestOptions,Headers,HttpModule} from '@angular/http';
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { Page } from "../../models/page.model";
import { mediaManagementRootService } from "../../services/mediaManagement.root.service";
import "./comprehensiveReportfour.component.less";

declare var $;
declare var require;
let path = require("./comprehensiveReportfour.html");
declare var profiles;


@Component({
    selector: "ng-mediaManangement",
    template: path,
})

export class comprehensiveReportfourComponent implements OnInit {
    datas=[{name:"qwe"}]

    clendorder:number;
    calenderday=[
        {name:'今天'},
        {name:'昨天'},
        {name:'前7天'},
    ]
    timetype;
    timeopen={type:"time"};
    includeflag;
    selectedCont=[];
    filterselect={
        name:""
    }
    filterselectChild={
        name:""
    }
    filterselects=[
        {name:"渠道名称"},
        {name:"设备os"},
        {name:"设备os1"},
        {name:"设备os2"},
        {name:"设备os3"},
    ]
    filterselectChildsshow=[]
    filterselectChilds=[
        {name:"fdsfdsfdsd3d3"},
        {name:"qwe23e32re地方"},
        {name:"qwe23e32re看"},
        {name:"qwe23e32re啊"},
        {name:"qwe23e32re吗"},
        {name:"qwe23e32re在"},
        {name:"qwe23e32re盘"},
        {name:"qwe23e32re盘qwe"},
        {name:"qwe23e32re盘sdf4"},
        {name:"qwe23e32re盘f43rf34"},
        {name:"qwe23e32re盘2e23e32re3"},
    ]
    selectGroup=[];
    datagroups=[
        {name:"渠道名称"},
        {name:"广告项目"},
        {name:"广告项目ID"},
        {name:"推广活动"},
        {name:"推广活动ID"},
        {name:"投放策略"},
        {name:"投放策略ID"},
        {name:"物料包"},
        {name:"创意类型"},
        {name:"创意尺寸"},
        {name:"设备OS"},
    ]
    title=[
        {name:"不出价原因报表"},
        {name:"运营综合报表"},
        {name:"流量分析报表"},
        {name:"自定义报表"},
    ]
    channel;
    // datas = [];
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
    @ViewChild("text") text;

    private errorMessage;
    private page= {
        pageNo: 0,
        pageSize: 10,
        total: 0
    };
    public mainMenus = [
        {
            name: "数据中心",
            value: undefined
        },
        {
            name: "综合报表",
            value: "/home/campaign/campaignList"
        },
        {
            name: "不出价原因报表",
            value: "/home/campaign/campaignList"
        },
    ];


    private isShowScroll;
    tabshowarray=[];
    tabshowtime={}; //时间
    showdatagroups=[];//分组数据
    showdatagroupstongji = [];//统计数据


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
        this.timetype = "1";
        this.clendorder = 0;
    }


    ngOnInit() {
        this.page.total = 1;
        this.filterselectChildsshow=this.filterselectChilds;
        /*for(let i =0;i<this.datagroups.length;i++){
            this.datagroups[i]['checked']=false;
        }*/
        // this.refreshTable()

        // this.dataInitadx();
    }
    selecttitle(i){
        if(i=="0"){
            this.router.navigate(["home/datacenter/comprehensiveReport"]);
        }
        if(i=="1"){
            this.router.navigate(["home/datacenter/comprehensiveReporttwo"]);
        }
        if(i=="2"){
            this.router.navigate(["home/datacenter/comprehensiveReportthree"]);
        }
        if(i=="3"){
            this.router.navigate(["home/datacenter/comprehensiveReportfour"]);
        }
    }
    selectcalender(index){
        this.clendorder = index;
    }

    deleteCont(cont){
        for(let j=0;j<this.selectedCont.length;j++){
            if(this.selectedCont[j].name == cont.name){
                this.selectedCont.splice(j,1);
                this.filterselectChild = {name:""};
                this.filterselect={name:"过滤条件"};
            }
        }
    }

    deleteChildCont(cont,child){
        for(let i =0;i<cont.select.length;i++){
            if(cont.select[i].name == child.name){
                cont.select.splice(i,1);
                this.filterselectChild = {name:""};
            }
        }
        if(cont.select.length==0){
            this.filterselect={name:"过滤条件"};
            for(let j=0;j<this.selectedCont.length;j++){
                if(this.selectedCont[j].name == cont.name){
                    this.selectedCont.splice(j,1);
                }
            }
        }
    }

    searchText(v){
        let newData = [];
        for(let i=0;i<this.filterselectChilds.length;i++){
            if(this.filterselectChilds[i]['name'].toUpperCase().indexOf(v.toUpperCase())>-1){
                newData.push(this.filterselectChilds[i]);
            }
        }

        this.filterselectChildsshow=newData;
        console.log(this.filterselectChilds)
    }


    selectedDropdownBtn(v){
        if(v != this.filterselect){
            this.filterselect = v;
            this.filterselectChild={
                name:""
            }
            this.includeflag = "";
        }
    }

    includebtn(index,v){
        if(!this.filterselect){
            this.myModalService.alert("字段必选先选择");
            return;
        }
        let select = [];
        let parent = this.filterselect;
        if(parent['select'] && parent['select'].length>0){
            select=parent['select']

        }
        var selectflag =false;
        for(let i=0;i<select.length;i++){
            if(select[i].name == v.name){
                selectflag = true;
            }
        }
        if(!selectflag){
            select.push(v);
        }else{
            // this.myModalService.alert("已经选择");
        }

        console.log(this.selectedCont)


        parent['select']=select;
        parent['flag']=index;
        this.includeflag = index;
        this.filterselectChild = v;

        for(let i=0;i<this.selectedCont.length;i++){
            if(parent.name == this.selectedCont[i].name){
                return;
            }
        }
        this.selectedCont.push(parent)
    }
    checkincludeflag(index){
        if(index == "1"){
            return {'disabled':'disabeld'}
        }
        if(index == "0"){
            return {'disabled':'disabeld'}
        }
    }
    choosetime(g){
        let type="";
        if(g=="1"){
            type = "小时"
        }
        if(g == "0"){
            type = "日"
        }
        for(let i =0 ;i< this.selectGroup.length;i++){
            if(this.selectGroup[i].type = 'time'){
                 this.selectGroup[i].name = "时间："+ type;
            }
        }
    }
    chooseGrouplist(g,index){
        if(g.checked){
            if(g.type == "time"){
                let type="";
                if(this.timetype == "1"){
                    type = "小时"
                }
                if(this.timetype == "0"){
                    type = "日"
                }
                g.name = "时间："+type;
                this.selectGroup.push(g);
            }else{
                this.selectGroup.push(g);
            }
        }else{
            for(let i =0;i< this.selectGroup.length;i++){
                if(g.name == this.selectGroup[i].name){
                    this.selectGroup.splice(i,1)
                }
            }
        }
    }

    deleteData(v,index){
        v.checked = false;
        for(let i =0;i< this.selectGroup.length;i++){
            if(v.name == this.selectGroup[i].name){
                this.selectGroup.splice(i,1)
            }
        }
        // this.selectGroup.splice(index,1);
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
                this.myModalService.alert(error.message);
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
                this.myModalService.alert(error.message);
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
