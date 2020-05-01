import { Component,OnInit,ViewChild,ElementRef } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { CampaignService } from "../../services/campaign.service";
import { MyModalService } from "../../services/myModal.service";
import { AdvertiserService } from "../../services/advertiser.service";
import { ProjectService } from "../../services/project.service";
import { RootService } from "../../services/root.service";
import { ValidationService } from "../../services/validation.service";
import { Campaign,Kpi } from "../../models/campaign.model";
import { Targeting } from "../../models/campaign.model";
import { TargetModal } from "../../models/root.model";
import { ModalRegionComponent } from "../public/modalRegion.component";
import { Subject } from "rxjs/Subject";
import "../../resources/request.js";
declare var profiles;

declare var require;
let path = require("./detailAudit.html");
@Component({
	selector: "detail-audit",
	template: path
})

export class DetailAuditComponent implements OnInit {

    @ViewChild("regionModal") regionModal;

    @ViewChild(ModalRegionComponent) regionComponent:ModalRegionComponent;

    @ViewChild("brandModal") brandModal;

    @ViewChild("file") file: ElementRef;

    public mainMenus = [
        {
            name: "运营支撑",
            value: undefined
        },
        {
            name: "推广活动管理",
            value: "/home/campaign/campaignAudited"
        },
        {
            name: "待审核",
            value: "/home/campaign/campaignAudit"
        },
        {
            name: "审核推广活动",
            value: undefined
        }
    ];

    private id: string;

    private campaign: Campaign = new Campaign();

    private baseUrl: string;

    private isShowKpi: boolean = false;

    private regionNames: string = "";

    private isNetwork: boolean = false;

    private isCarrier: boolean = false;

    private isDevice: boolean = false;

    private isOs: boolean = false;

    private isCellphone: boolean = false;

    private uploader;

    private targetModal: TargetModal;

    private isShowBrand: boolean = false;

    private regions = [];

    private d = require("../../images/d.png");

    private h = require("../../images/h.png");

    private c = require("../../images/c.png");

    private m = require("../../images/m.png");

    private money = require("../../images/money.png");

    private number1 = require("../../images/1.png");

    private number2 = require("../../images/2.png");

    private number3 = require("../../images/3.png");

    private yr = require("../../images/yr.png");

    private gr = require("../../images/gr.png");

    private days: any;

    private hours: any;

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
        private router: Router,
        private route: ActivatedRoute,
        private campaignService: CampaignService,
        private myModalService: MyModalService,
        private advertiserService: AdvertiserService,
        private projectService: ProjectService,
        private rootService: RootService,
        private validationService: ValidationService
	) {}

	ngOnInit() {
        this.dataInit();
	}
    // 数据初始化
    private dataInit(){
        this.id = this.route.snapshot.params["id"];    
        this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
            autoUpdateInput: false,
		},(start,end) => {
            this.campaign.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.campaign.endDate = end._d.getTime() - end._d.getTime()%1000;
            this.timeToKpi();
		});
        this.baseUrl = eval(profiles + ".urlHref");
        this.uploader = new FileUploader({
            url:this.baseUrl+"/zuul/advertise/geo-excel",
            allowedFileType:["xls"],
            autoUpload:true
        });
        // 监听上传事件
        this.listenUpload(); 
        
        this.editInit();
        
        this.asyncDataInit();
    }
    // 上传事件监听
    private listenUpload(){
        this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
            this.campaign.scenePath = response ? JSON.parse(response).path : undefined;
            this.campaign.sceneName = response ? JSON.parse(response).name : undefined;
            this.myModalService.alert(this.chineseService.config.UPLOAD_SUCCESS);
        };

        this.uploader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
            this.myModalService.alert(this.chineseService.config.UPLOAD_FAIL);      
        }
    }
    // 移除excel
    private removeExcel(){
        this.campaign.scenePath = undefined;
        this.campaign.sceneName = undefined;
    }
    // 编辑初始化
    private editInit(){
        this.campaignService.get(this.id).subscribe(
            result => {
                this.campaign = result.body;
                this.publicService.timeRangePickerSet("timeRangePicker",{
                    locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
                    autoUpdateInput: false,
                    startDate: this.publicService.toFormalTime(this.campaign.startDate),
                    endDate: this.publicService.toFormalTime(this.campaign.endDate)
                },(start,end) => {
                    this.campaign.startDate = start._d.getTime() - start._d.getTime()%1000;
                    this.campaign.endDate = end._d.getTime() - end._d.getTime()%1000;
                    this.timeToKpi();
                });
                this.transformMoney("campaign",true);
                this.showDay();
                this.showHours();
                this.asyncDataInit()
                
            },
            error => {
                //this.myModalService.alert(error.message);
            }
        )
    }
    private transformMoney(name,isDivision?){
        this[name].bid = Math.round(this[name].bid*100);
        if(isDivision){
            this[name].bid = this[name].bid ? this[name].bid/100 : undefined;
            this[name].totalBudget = this[name].totalBudget ? this[name].totalBudget/100 : undefined;
            for(let i = 0;i < this[name].kpi.length;i++){
                this[name].kpi[i].dailyBudget = this[name].kpi[i].dailyBudget ? this[name].kpi[i].dailyBudget/100 : undefined;
            }
        }else{
            this[name].bid = this[name].bid ? this[name].bid*100 : undefined;
            this[name].totalBudget = this[name].totalBudget ? this[name].totalBudget*100 : undefined;
            for(let i = 0;i < this[name].kpi.length;i++){
                this[name].kpi[i].dailyBudget = this[name].kpi[i].dailyBudget ? this[name].kpi[i].dailyBudget*100 : undefined;
            }
        }
        this[name].bid = this[name].bid/100;
    }
    // 必须选择一个
    private mustOne(e){
        let name = e && e.srcElement && e.srcElement.name;
        let objName;
        if(name && name.indexOf("-") !== -1){
            if(!e.srcElement.checked){
                objName = name.split("-")[0];
                let count = 0;
                for(let i = 0;i < this.targetModal[objName].length;i++){
                    if(this.targetModal[objName][i].value){
                        count++;
                    }
                }
                if(count === 1){
                    e.preventDefault();
                    this.myModalService.alert("至少勾选一项");
                }
            }     
        }
    }
    // 定向radio状态初始化
    private targetModalToStatus(){
        this.isNetwork = this.campaign.targeting.network && this.campaign.targeting.network.length !== 0 ? true : false;
        this.isCarrier = this.campaign.targeting.carrier && this.campaign.targeting.carrier.length !== 0 ? true : false;
        this.isDevice = this.campaign.targeting.device && this.campaign.targeting.device.length !== 0 ? true : false;
        this.isOs = this.campaign.targeting.os && this.campaign.targeting.os.length !== 0 ? true : false;
        this.isCellphone = this.campaign.targeting.brand && this.campaign.targeting.brand.length !== 0 ? true : false;
    }
    // day显示
    private showDay(){
        let day = 0;
        for(let i = 0;i < this.campaign.kpi.length;i++){
            if(this.campaign.kpi[i].period !==0){
                day++;
            }
        }
        this.days = day;
    }
    // hours显示
    private showHours(){
        let hours = 0;
        for(let i = 0;i < this.campaign.kpi.length;i++){
            for(let j = 0;j < 24;j++){
                let str = this.campaign.kpi[i].period.toString(2);
                str = this.publicService.addLength(str);
                str.charAt(j) === "1" && hours++;
            }
        }
        this.hours = hours;
    }
    // kpi切换
    private toggleKpi(e){
        this.isShowKpi = !this.isShowKpi;
    }
    // kpi接收数据
    private onmessage(e){ 
        if(e.conFirm){
            this.campaign.kpi = e.kpi;
            this.campaign.totalBudget = e.totalBudget;
            this.campaign.totalClick = e.totalClick;
            this.campaign.totalImpression = e.totalImpression;
            this.showHours();
            this.showDay();
        }  
        this.isShowKpi = false;
    }
    // kpi数组生成
    private timeToKpi(){
        
        let shiftArr = [];
        let kpi = [];
        let startDate = this.campaign.startDate;
        let endDate = this.campaign.endDate;
        let start = this.campaign.kpi[0] ? this.campaign.kpi[0].day : undefined;
        let end = this.campaign.kpi[this.campaign.kpi.length-1] ? this.campaign.kpi[this.campaign.kpi.length-1].day : undefined;
        let arr = [];
        let act = () => {
            arr.push(startDate);
            startDate += 1000*60*60*24;
            if(startDate < endDate){
                act();
            }
        }
        act(); 
        for(let i = 0;i < arr.length;i++){
            if(start && arr[i] < start){
                shiftArr.push(new Kpi());
                shiftArr[shiftArr.length-1].day = arr[i]; 
            }else if(start && arr[i] >= start && arr[i] <= end){
                for(let j = 0;j < this.campaign.kpi.length;j++){
                    if(arr[i] === this.campaign.kpi[j].day){
                        shiftArr.push(this.publicService.clone(this.campaign.kpi[j]));
                    }
                }
            }else{
                kpi.push(new Kpi());
                kpi[kpi.length-1].day = arr[i];
            }
        }
        this.campaign.kpi = shiftArr.concat(kpi);
    }
    //打开地域窗口并订阅提交
	public openRegionModal() {
		this.regionModal.open()
			.then(()=>{			
				this.regionComponent.regionData = this.publicService.clone(this.campaign.targeting.region);
				this.regionComponent.getRegion();
				let waitResult = this.regionComponent.$result.subscribe(data => {
                    this.campaign.targeting.region = [];
                    for(let i = 0;i < data.length;i++){
                        this.campaign.targeting.region.push(data[i].id);
                    }
					this.regionNames = this.getNames(data);
					this.regionModal.close();
					waitResult.unsubscribe();
				});
			})
	}
    // 地域定向取消
    private regionCancel(){
		this.regionComponent.cancel();
		this.regionModal.close();
	}
    // 地域名称获取
	public getNames(data){
		let str = "";
		if(!data){
            return str;
        }			
		for(let i=0,len=data.length;i<len;i++){
            str += data[i].name + (i == len-1 ? "" : ",");
        }			
		return str;
	}

	//提交选择地域
	public regionModalSubmit(){
		this.regionComponent.submit();
	}

    // 手机品牌
    private onBrandMessage(e){
        this.campaign.targeting.brand = e;
        this.brandModal.close();
        this.isShowBrand = false;
        if(this.campaign.targeting.brand.length === 0){
            this.isCellphone = false;
        }
    }
    // 显示手机品牌设置
    private showBrand(){
        this.isShowBrand = true;
        this.brandModal.open();
    }
    // 设置定向信息
    private setTargeting(){
        for(let i in this.targetModal){
            this.campaign.targeting[i] = [];
            for(let j = 0;j < this.targetModal[i].length;j++){
                if(this.targetModal[i][j] && this.targetModal[i][j].value){
                    this.campaign.targeting[i].push(this.targetModal[i][j].id);
                }
            }
        }
    }
    // 取消手机品牌定向
    private deleteCellphone(){
        this.campaign.targeting.brand = [];
    }
    // 取消radio定向信息
    private deleteRadioTarget(attr){
        for(let i = 0;i < this.targetModal[attr].length;i++){
            this.targetModal[attr][i].value = false;
        }
        
    }
    // 全选radio定向信息
    private addRadioTarget(attr){
        for(let i = 0;i < this.targetModal[attr].length;i++){
            this.targetModal[attr][i].value = true;
        }
    }
    // 地域名称初始化
    private getRegionName(){
        this.regionComponent.regionData = this.publicService.clone(this.campaign.targeting.region);
        this.regionComponent.getRegion();
        let waitResult = this.regionComponent.$result.subscribe(data => {
            this.campaign.targeting.region = [];
            for(let i = 0;i < data.length;i++){
                this.campaign.targeting.region.push(data[i].id);
            }
            this.regionNames = this.getNames(data);
            waitResult.unsubscribe();
        });
        let listen = this.regionComponent.getNameSubject.subscribe({
            next: (data) => {
                this.regionComponent.submit();
                listen.unsubscribe();
            }
        })     
    }
    // 异步数据初始化
    private asyncDataInit(){     
        this.targetModal = new TargetModal(this.campaign.targeting.network,this.campaign.targeting.carrier,this.campaign.targeting.device,this.campaign.targeting.os);
        this.timeToKpi();
        this.targetModalToStatus();
        this.getRegionName();            
    }
    // 取消
    private cancel(){     
        window.history.back();     
    }
    // 保存
    private save(){
        this.setTargeting();
        if(this.validationService.validate()){   
            this.transformMoney("campaign");    
            this.campaignService.update(this.id,this.campaign).subscribe(
                result => {
                    this.router.navigate(["/home/campaign/audit/packageAudit/" + this.id]);
                },
                error => {
                    this.transformMoney("campaign",true);
                    //this.myModalService.alert(error.message);
                }
            )       
        }else{
            this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
        }
        
    }
    
}

