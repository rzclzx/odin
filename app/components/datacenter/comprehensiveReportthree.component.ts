import { Component,OnInit,ViewChild,ElementRef,ViewChildren } from "@angular/core";
import { Http,Response,RequestOptions,Headers,HttpModule} from '@angular/http';
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { Page } from "../../models/page.model";
import { mediaManagementRootService } from "../../services/mediaManagement.root.service";
import "./comprehensiveReportthree.component.less";

declare var $;
declare var require;
let path = require("./comprehensiveReportthree.html");
declare var profiles;


@Component({
    selector: "ng-mediaManangement",
    template: path,
})

export class comprehensiveReportthreeComponent implements OnInit {
    selectedprovince=[];
    datagroupstongji = [
        {name:"原始展现数"},
        {name:"原始点击数"},
        {name:"展现数"},
        {name:"点击数"},
        {name:"CTR"},
        {name:"eCPM"},
        {name:"eCPC"},
        {name:"成本"},
    ]
    clendorder:number;
    calenderday=[
        {name:'今天'},
        {name:'昨天'},
        {name:'上星期'},
        {name:'本月'},
    ]
    timetype;
    timeopen={type:"time"};
    includeflag;
    selectedCont=[];
    filterselect={
        name:"过滤条件"
    }
    filterselectChild={
        name:""
    }
    filterselects=[
        {name:"渠道名称"},
        {name:"创意类型"},
        {name:"创意尺寸"},
        {name:"推广活动"},
        {name:"投放策略"},
        {name:"广告项目"},
        {name:"省/市"},
        {name:"设备OS"},
        {name:"设备类型"},
        {name:"网络类型"},
        {name:"媒体分析"},
        {name:"客户名称"},
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
    selectGrouptongjiselect=[];
    datagroups=[
        {name:"渠道名称"},
        {name:"广告项目"},
        {name:"广告项目ID"},
        {name:"项目号"},
        {name:"推广活动"},
        {name:"推广活动ID"},
        {name:"投放策略"},
        {name:"投放策略ID"},
        {name:"物料包"},
        {name:"创意类型"},
        {name:"创意尺寸"},
        {name:"客户名称"},
        {name:"设备类型"},
        {name:"设备OS"},
        {name:"省"},
        {name:"市"},
        {name:"网络类型"},
        {name:"运营商"},
        {name:"项目执行人"},
        {name:"媒体分类"},
        {name:"媒体名称"},
    ]
    title=[
        {name:"不出价原因报表"},
        {name:"运营综合报表"},
        {name:"流量分析报表"},
        {name:"自定义报表"},
    ]
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
    chinaAreas=[
        {
            area:"华北区域",
            province:[
                {prov:"北京"},
                {prov:"天津"},
                {prov:"河北",
                    citys:[
                        {city:"唐山"},{city:"唐山1"},{city:"唐山2"},{city:"唐山3"},{city:"唐山4"},{city:"唐山5"},{city:"唐山6"},{city:"唐山7"}
                    ]
                },
                {prov:"山西",
                    citys:[
                        {city:"唐山q"},{city:"唐山w"},{city:"唐山e"},{city:"唐山r"},{city:"唐山r3"},{city:"唐山vg"},{city:"唐山vb"},{city:"唐山nju"}
                    ]
                },
                {prov:"内蒙古"},
            ]
        },
        {
            area:"东北区域",
            province:[
                {prov:"辽宁"},
                {prov:"吉林"},
                {prov:"黑龙江"},
            ]
        },
        {
            area:"华东区域",
            province:[
                {prov:"上海"},
                {prov:"江苏"},
                {prov:"黑龙江"},
                {prov:"黑龙江"},
                {prov:"黑龙江"},
                {prov:"黑龙江"},
                {prov:"黑龙江"},
                {prov:"黑龙江"},
                {prov:"黑龙江"},
                {prov:"黑龙江"},
                {prov:"黑龙江"},
                {prov:"黑龙江"},
            ]
        },
        {
            area:"华中区域",
            province:[
                {prov:"辽宁"},
                {prov:"吉林"},
                {prov:"黑龙江"},
            ]
        },
        {
            area:"华南区域",
            province:[
                {prov:"辽宁"},
                {prov:"吉林"},
                {prov:"黑龙江"},
            ]
        },
        {
            area:"西南区域",
            province:[
                {prov:"辽宁"},
                {prov:"吉林"},
                {prov:"黑龙江"},
            ]
        },
        {
            area:"西北区域",
            province:[
                {prov:"辽宁"},
                {prov:"吉林"},
                {prov:"黑龙江"},
            ]
        }
    ]


    @ViewChild("allchangeList") allchangeList;
    @ViewChild("text") text;

    private startDate: number=new Date().getTime();
    private endDate: number=new Date().getTime();
    // private startDate: number;
    // private endDate: number;

    private errorMessage;
    private page = {
        pageNo: 0,
        pageSize: 50,
        total:0,
        currentShow: 1
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
        this.refesh();

        this.calenderInit()

        this.filterselectChildsshow=this.filterselectChilds;

        for(let i = 0;i < 11;i++){
            this.datas.push({
                name: "呵呵哒",
                id: "123123fdsafdasfdsa",
                adx: "汽车之家"
            });
        }
        this.page.total = this.datas.length;
    }
    refeshrun(){
        let count=0;
        this.tabshowtime = JSON.parse(JSON.stringify(this.timeopen))
        this.showdatagroups = JSON.parse(JSON.stringify(this.datagroups))
        for(let i=0;i<this.showdatagroups.length;i++){
            if(this.showdatagroups[i].checked){
                count++;
            }
        }
        this.isShowScroll = count > 4 ? true : false;
    }
    private refesh(){
        if(this.timeopen['checked']){
            this.tabshowtime['checked']=true;
        }else{
            this.tabshowtime['checked']=false;
        }
        for(let i=0;i<this.datagroups.length;i++){
            if(this.datagroups[i]['checked']){
                this.showdatagroups.push({'checked':true})
            }else{
                this.datagroups[i]['checked'] = false;
                this.showdatagroups.push({'checked':false})
            }
        }
        // for(let i=0;i<this.datagroupstongji.length;i++){
        //     if(this.datagroupstongji[i]['checked']){
        //         this.showdatagroupstongji.push({'value':'1'})
        //     }
        //     else{
        //         this.showdatagroupstongji.push({'value':'0'})
        //     }
        //     count += 1;
        // }
    }
    private onPage(e){
        if(e === 1){
            for(let i = 0;i < 11;i++){
                this.datas.push({
                    name: "呵呵哒",
                    id: "123123fdsafdasfdsa",
                    adx: "汽车之家"
                });
            }
            this.page.pageNo = 0;
            this.page.currentShow = 1;
        }
    }

    submitarea(){
        let array=[];       //提交的数据
        let arrayshow = []; //展示的数据
        for(let i =0;i<this.chinaAreas.length;i++){
            for(let j =0;j<this.chinaAreas[i]['province'].length;j++) {
                if(this.chinaAreas[i]['province'][j]['checked']){
                    if(this.chinaAreas[i]['province'][j]['citys']){
                        for(let w = 0;w<this.chinaAreas[i]['province'][j]['citys'].length;w++){
                            if(this.chinaAreas[i]['province'][j]['citys'][w].checked == true){
                                arrayshow.push({prov:this.chinaAreas[i]['province'][j].prov,city:this.chinaAreas[i]['province'][j]['citys'][w].city});
                            }
                        }
                    }else{
                        arrayshow.push({prov:this.chinaAreas[i]['province'][j].prov})
                    }
                }
            }
        }
        this.selectedprovince = arrayshow;
        // console.log(array)
        console.log(arrayshow)
    }

    deleteContprov(){
        this.selectedprovince = [];
        for(let i =0;i<this.chinaAreas.length;i++){
            for(let j =0;j<this.chinaAreas[i]['province'].length;j++) {
                this.chinaAreas[i]['province'][j]['cont'] = 0;
                this.chinaAreas[i]['province'][j]['checked'] = false;
                if(this.chinaAreas[i]['province'][j]['citys']){
                    for(let w = 0;w<this.chinaAreas[i]['province'][j]['citys'].length;w++){
                        this.chinaAreas[i]['province'][j]['citys'][w]['checked'] = false;
                    }
                }
            }
        }
    }

    deleteProv(cont,index){
        this.selectedprovince.splice(index,1)
        for(let i =0;i<this.chinaAreas.length;i++){
            for(let j =0;j<this.chinaAreas[i]['province'].length;j++) {
                if(this.chinaAreas[i]['province'][j].prov == cont.prov){
                    if(this.chinaAreas[i]['province'][j]['citys']){
                        let cityselectall = false;
                        for(let w = 0;w<this.chinaAreas[i]['province'][j]['citys'].length;w++){
                            if(this.chinaAreas[i]['province'][j]['citys'][w].city == cont.city){
                                this.chinaAreas[i]['province'][j]['citys'][w]['checked'] = false;
                                this.chinaAreas[i]['province'][j]['cont'] -= 1;
                            }

                            if(this.chinaAreas[i]['province'][j]['citys'][w].checked){
                                cityselectall = true;
                            }
                        }
                        if(!cityselectall){
                            this.chinaAreas[i]['province'][j]['checked']=false;
                            this.chinaAreas[i]['checked'] = false;
                        }
                    }else{
                        this.chinaAreas[i]['province'][j]['checked'] = false;
                    }
                }
            }
        }
    }

    areachoice(d){
        for(let i =0;i<this.chinaAreas.length;i++){
            if(this.chinaAreas[i]['checked'] == true){
                for(let j =0;j<this.chinaAreas[i]['province'].length;j++){
                    let cont=0;
                    this.chinaAreas[i]['province'][j]['checked'] = true;
                    if(this.chinaAreas[i]['province'][j]['citys']){
                        for(let w = 0;w<this.chinaAreas[i]['province'][j]['citys'].length;w++){
                            this.chinaAreas[i]['province'][j]['citys'][w].checked = true;
                            cont += 1;
                        }
                    }
                    this.chinaAreas[i]['province'][j]['cont'] = cont;
                }
            }else{
                for(let j =0;j<this.chinaAreas[i]['province'].length;j++){
                    let cont=0;
                    this.chinaAreas[i]['province'][j]['checked'] = false;
                    if(this.chinaAreas[i]['province'][j]['citys']){
                        for(let w = 0;w<this.chinaAreas[i]['province'][j]['citys'].length;w++){
                            this.chinaAreas[i]['province'][j]['citys'][w].checked = false;
                        }
                    }
                    this.chinaAreas[i]['province'][j]['cont'] = cont;
                }
            }
        }
    }
    provincechoice(p) {
        if(p.checked == false){
            let cont = 0;
            if(p.citys){
                for(let i =0;i<p.citys.length;i++){
                    p.citys[i].checked = false;
                }
            }
            p.cont = 0;
        }else{
            let cont = 0;
            if(p.citys) {
                for(let i =0;i<p.citys.length;i++){
                    p.citys[i].checked = true;
                    cont += 1;
                }
            }
            p.cont = cont;
        }
        for(let i = 0; i < this.chinaAreas.length; i++){
            let provinceselectall = false;
            for(let j =0;j<this.chinaAreas[i]['province'].length;j++){
                if(!this.chinaAreas[i]['province'][j]['checked']){
                    provinceselectall = true;
                }
            }
            if(!provinceselectall){
                this.chinaAreas[i]['checked']= true;
            }else{
                this.chinaAreas[i]['checked']= false;
            }
        }
    }
    cityschoice(c,p,d){
        let cont = 0;
        for(let i =0;i<p.citys.length;i++){
            if(p.citys[i].checked){
                cont += 1;
            }
        }
        p.cont = cont;
        if(c.checked == true){
            p.checked = true;
        }else{
            let cityselectall = false;
            for(let i =0;i<p.citys.length;i++){
                if(p.citys[i].checked){
                    cityselectall = true;
                }
            }
            if(!cityselectall){
                p.checked = false;
                d.checked = false;
            }else{
                p.checked = true;
            }
        }
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

    // 日历初始化
    calenderInit(){
        this.publicService.timeRangePickerSet("timeRangePicker",{
            locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
            autoUpdateInput: false
        },(start,end) => {
            this.startDate = start._d.getTime() - start._d.getTime()%1000;
            this.endDate = end._d.getTime() - end._d.getTime()%1000;
        });
    }

    chooseGrouplisttongji(g,index){
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
                this.selectGrouptongjiselect.push(g);
            }else{
                this.selectGrouptongjiselect.push(g);
            }
        }else{
            for(let i =0;i< this.selectGrouptongjiselect.length;i++){
                if(g.name == this.selectGrouptongjiselect[i].name){
                    this.selectGrouptongjiselect.splice(i,1);
                }
            }
        }
    }
    deleteDatatongji(v,index){
        v.checked = false;
        for(let i =0;i< this.selectGrouptongjiselect.length;i++){
            if(v.name == this.selectGrouptongjiselect[i].name){
                this.selectGrouptongjiselect.splice(i,1);
            }
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
