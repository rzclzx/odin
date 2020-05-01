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
import { Campaign,Kpi,App } from "../../models/campaign.model";
import { Targeting } from "../../models/campaign.model";
import { TargetModal } from "../../models/root.model";
import { ModalRegionComponent } from "../public/modalRegion.component";
import { Subject } from "rxjs/Subject";
import "../../resources/request.js";
declare var profiles;

declare var require;
let path = require("./policyForm.html");
@Component({
	selector: "policy-form",
	template: path
})

export class PolicyFormComponent implements OnInit {

    @ViewChild("appModal") appModal;

    @ViewChild("regionModal") regionModal;

    @ViewChild(ModalRegionComponent) regionComponent:ModalRegionComponent;

    @ViewChild("brandModal") brandModal;

    @ViewChild("file") file: ElementRef;

    public mainMenus = [
        {
            name: "投放管理",
            value: undefined
        },
        {
            name: "推广活动管理",
            value: "/home/campaign/campaignAudited"
        },
        {
            name: "",
            value: undefined
        }
    ];

    private subject = new Subject();

    private getProjectId = new Subject();

    private asyncCount = 0;

    private id: string;

    private campaign: Campaign = new Campaign();

    private advertisers = [];

    private advertiser;

    private projects = [];

    private isShowKpi: boolean = false;

    private regionNames: string = "";

    private isShowApp: boolean = false;

    private isNetwork: boolean = false;

    private isCarrier: boolean = false;

    private isDevice: boolean = false;

    private isOs: boolean = false;

    private isCellphone: boolean = false;

    private isCampaignNetwork: boolean = false;

    private isCampaignCarrier: boolean = false;

    private isCampaignDevice: boolean = false;

    private isCampaignOs: boolean = false;

    private isCampaignCellphone: boolean = false;

    private uploader;

    private targetModal: TargetModal = new TargetModal();

    private baseUrl: string;

    private isShowBrand: boolean = false;

    private adxs = [];

    private contracts = [];

    private appTypes = [];

    private regions = [];

    private policy: any = new Campaign();

    private campaignId: string;

    private campaignTargetModal: TargetModal;

    private days: number;
    
    private hours: number;

    private d = require("../../images/d.png");

    private h = require("../../images/h.png");

    private c = require("../../images/c.png");

    private m = require("../../images/m.png");

    private money = require("../../images/money.png");

    private appAmount: number;

    private isNodid: boolean = false;

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
        this.preInit();
	}
    private preInit(){
        this.campaignId = this.route.snapshot.params["campaignId"];
        this.campaignService.get(this.campaignId).subscribe(
            result => {
                this.campaign = result.body;
                if(!this.campaign.targeting.app){
                    this.campaign.targeting.app = new App();
                }
                if(!this.campaign.targeting.appType){
                    this.campaign.targeting.appType = new App();
                }
                this.transformMoney("campaign","bid",true);
                this.dataInit();
            },
            error => {
                this.myModalService.alert(error.message);
            }
        ) 
    }
    // 数据初始化
    private dataInit(){
        this.id = this.route.snapshot.params["id"];   
        this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
            autoUpdateInput: false,
            minDate: this.publicService.toFormalTime(this.campaign.startDate),
            maxDate: this.publicService.toFormalTime(this.campaign.endDate)
		},(start,end) => {
            this.policy.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.policy.endDate = end._d.getTime() - end._d.getTime()%1000;
            this.policy.endDate = end._d.getHours() === 0 ? this.policy.endDate + 1000*60*60*24 - 1000 : this.policy.endDate;
            this.timeToKpi();
		});
        this.baseUrl = eval(profiles + ".urlHref");
        this.rootService.adxList().subscribe(
            result => {
                this.adxs = result.body.items;
                this.adxs = this.publicService.returnExistByArrObj(this.campaign.targeting.adx,this.adxs,"id");
                this.asyncCount ++;
                this.subject.next(this.asyncCount)
            },
            error => {
                this.myModalService.alert(error.message);
            }
        )
        this.rootService.contractList().subscribe(
            result => {
                this.contracts = result.body.items;
                this.contracts = this.publicService.returnExistByArrObj(this.campaign.targeting.contract,this.contracts,"id");
                this.asyncCount ++;
                this.subject.next(this.asyncCount)
            },
            error => {
                this.myModalService.alert(error.message);
            }
        )
        this.rootService.appTypeList().subscribe(
            result => {
                this.appTypes = result.body.items;
                if(this.campaign.targeting.appType.isInclude === "1"){
                    this.appTypes = this.publicService.returnExistByArrObj(this.campaign.targeting.appType.value,this.appTypes,"id");
                }              
                this.asyncCount ++;
                this.subject.next(this.asyncCount)
            },
            error => {
                this.myModalService.alert(error.message);
            }
        )
        this.uploader = new FileUploader({
            url:this.baseUrl+"/zuul/advertise/geo-excel",
            allowedFileType:["xls"],
            autoUpload:true
        });
        // 策略依赖活动初始化
        this.targetModalToCampaignStatus();
        this.campaignTargetModal = new TargetModal(this.campaign.targeting.network,this.campaign.targeting.carrier,this.campaign.targeting.device,this.campaign.targeting.os);
        // 监听上传事件
        this.listenUpload(); 
        if(this.id){
            this.editInit();
        }else{
            this.createInit();
        }
        this.asyncDataInit();
    }
    // 上传事件监听
    private listenUpload(){
        this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
            this.policy.scenePath = response ? JSON.parse(response).path : undefined;
            this.policy.sceneName = response ? JSON.parse(response).name : undefined;
            this.myModalService.alert(this.chineseService.config.UPLOAD_SUCCESS);
        };

        this.uploader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
            this.myModalService.alert(this.chineseService.config.UPLOAD_FAIL);      
        }
    }
    // 移除excel
    private removeExcel(){
        this.policy.scenePath = undefined;
        this.policy.sceneName = undefined;
    }
    // 新建初始化
    private createInit(){
        this.mainMenus[2].name = "新建投放策略";
        this.showDay("campaign");
        this.showHours("campaign");
        this.policy = this.publicService.clone(this.campaign);
        this.getAmount();
        this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
            autoUpdateInput: false,
            minDate: this.publicService.toFormalTime(this.campaign.startDate),
            maxDate: this.publicService.toFormalTime(this.campaign.endDate),
            startDate: this.publicService.toFormalTime(this.policy.startDate),
            endDate: this.publicService.toFormalTime(this.policy.endDate)
		},(start,end) => {
            this.policy.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.policy.endDate = end._d.getTime() - end._d.getTime()%1000;
            this.policy.endDate = end._d.getHours() === 0 ? this.policy.endDate + 1000*60*60*24 - 1000 : this.policy.endDate;
            this.timeToKpi();
		});
        this.policy.campaignId = this.policy.id;
        this.policy.id = undefined;
        this.policy.name = undefined;
        this.policy.isUniform = "1";
        this.policy.targeting.nodid = [];
        this.asyncCount ++;
        this.subject.next(this.asyncCount);
    }
    private transformMoney(name,attr,isDivision?){
        this[name][attr] = Math.round(this[name][attr]*100);
        if(isDivision){
            this[name][attr] = this[name][attr] ? this[name][attr]/100 : undefined;
            this[name].totalBudget = this[name].totalBudget ? this[name].totalBudget/100 : undefined;
            for(let i = 0;i < this[name].kpi.length;i++){
                this[name].kpi[i].dailyBudget = this[name].kpi[i].dailyBudget ? this[name].kpi[i].dailyBudget/100 : undefined;
            }
        }else{
            this[name][attr] = this[name][attr] ? this[name][attr]*100 : undefined;
            this[name].totalBudget = this[name].totalBudget ? this[name].totalBudget*100 : undefined;
            for(let i = 0;i < this[name].kpi.length;i++){
                this[name].kpi[i].dailyBudget = this[name].kpi[i].dailyBudget ? this[name].kpi[i].dailyBudget*100 : undefined;
            }
        }
        this[name][attr] = Math.round(this[name][attr]/100);
    }
    // 编辑初始化
    private editInit(){
        this.mainMenus[2].name = "编辑投放策略";
        this.rootService.getPolicy(this.id).subscribe(
            result => {
                this.policy = result.body;
                this.publicService.timeRangePickerSet("timeRangePicker",{
                    locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
                    autoUpdateInput: false,
                    minDate: this.publicService.toFormalTime(this.campaign.startDate),
                    maxDate: this.publicService.toFormalTime(this.campaign.endDate),
                    startDate: this.publicService.toFormalTime(this.policy.startDate),
                    endDate: this.publicService.toFormalTime(this.policy.endDate)
                },(start,end) => {
                    this.policy.startDate = start._d.getTime() - start._d.getTime()%1000;
                    this.policy.endDate = end._d.getTime() - end._d.getTime()%1000;
                    this.policy.endDate = end._d.getHours() === 0 ? this.policy.endDate + 1000*60*60*24 - 1000 : this.policy.endDate;
                    this.timeToKpi();
                });
                if(!this.policy.targeting.app){
                    this.policy.targeting.app = new App();
                }
                if(!this.policy.targeting.appType){
                    this.policy.targeting.appType = new App();
                }
                this.transformMoney("policy","realBid",true);
                this.showDay("policy");
                this.showHours("policy");
                this.getAmount();
                this.asyncCount ++;
                this.subject.next(this.asyncCount)
                

            },
            error => {
                this.myModalService.alert(error.message);
            }
        )
    }
    // day显示
    private showDay(name){
        let day = 0;
        for(let i = 0;i < this[name].kpi.length;i++){
            if(this[name].kpi[i].period !==0){
                day++;
            }
        }
        this.days = day;
    }
    // hours显示
    private showHours(name){
        let hours = 0;
        for(let i = 0;i < this[name].kpi.length;i++){
            for(let j = 0;j < 24;j++){
                let str = this[name].kpi[i].period.toString(2);
                str = this.publicService.addLength(str);
                str.charAt(j) === "1" && hours++;
            }
        }
        this.hours = hours;
    }
    // 定向radio依赖活动disabled
    private targetModalToCampaignStatus(){
        this.isCampaignNetwork = this.campaign.targeting.network && this.campaign.targeting.network.length !== 0 ? true : false;
        this.isCampaignCarrier = this.campaign.targeting.carrier && this.campaign.targeting.carrier.length !== 0 ? true : false;
        this.isCampaignDevice = this.campaign.targeting.device && this.campaign.targeting.device.length !== 0 ? true : false;
        this.isCampaignOs = this.campaign.targeting.os && this.campaign.targeting.os.length !== 0 ? true : false;
        this.isCampaignCellphone = this.campaign.targeting.brand && this.campaign.targeting.brand.length !== 0 ? true : false;
        
    }
    // 定向radio状态初始化
    private targetModalToStatus(){
        this.isNetwork = this.isCampaignNetwork ? true : (this.policy.targeting.network && this.policy.targeting.network.length !== 0 ? true : false);
        this.isCarrier = this.isCampaignCarrier ? true : (this.policy.targeting.carrier && this.policy.targeting.carrier.length !== 0 ? true : false);
        this.isDevice = this.isCampaignDevice ? true : (this.policy.targeting.device && this.policy.targeting.device.length !== 0 ? true : false);
        this.isOs = this.isCampaignOs ? true : (this.policy.targeting.os && this.policy.targeting.os.length !== 0 ? true : false);
        this.isCellphone = this.isCampaignCellphone ? true : (this.policy.targeting.brand && this.policy.targeting.brand.length !== 0 ? true : false);
    }
    // kpi切换
    private toggleKpi(e){
        this.isShowKpi = !this.isShowKpi;
    }
    // kpi接收数据
    private onmessage(e){
        if(e.conFirm){
            this.policy.kpi = e.kpi;
            this.policy.totalBudget = e.totalBudget;
            this.policy.totalClick = e.totalClick;
            this.policy.totalImpression = e.totalImpression;
            this.showHours("policy");
            this.showDay("policy");
        }  
        this.isShowKpi = false;
    }
    // kpi数组生成
    private timeToKpi(){
        
        let shiftArr = [];
        let kpi = [];
        let startDate = this.policy.startDate;
        let endDate = this.policy.endDate;
        let start = this.policy.kpi[0] ? this.policy.kpi[0].day : undefined;
        let end = this.policy.kpi[this.policy.kpi.length-1] ? this.policy.kpi[this.policy.kpi.length-1].day : undefined;
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
                for(let j = 0;j < this.policy.kpi.length;j++){
                    if(arr[i] === this.policy.kpi[j].day){
                        shiftArr.push(this.publicService.clone(this.policy.kpi[j]));
                    }
                }
            }else{
                kpi.push(new Kpi());
                kpi[kpi.length-1].day = arr[i];
            }
        }
        this.policy.kpi = shiftArr.concat(kpi);
    }
    //打开地域窗口并订阅提交
	public openRegionModal() {
		this.regionModal.open()
			.then(()=>{			
				this.regionComponent.regionData = this.publicService.clone(this.policy.targeting.region);
				this.regionComponent.getRegion();
				let waitResult = this.regionComponent.$result.subscribe(data => {
                    this.policy.targeting.region = [];
                    for(let i = 0;i < data.length;i++){
                        this.policy.targeting.region.push(data[i].id);
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
    // 选择媒体数量
    private getAmount(){
        this.appAmount = this.policy.targeting.app.value ? this.policy.targeting.app.value.length : undefined;
    }
    // 清除apptype
    private removeAppType(){
        this.policy.targeting.appType = {};
        for(let i = 0;i < this.appTypes.length;i++){
            this.appTypes[i].selected = false;
        }
    }
    // 选择媒体
    private showApp(){
        this.isShowApp = true;
        this.appModal.open();
    }
    // 媒体
    private onAppMessage(e){
        this.policy.targeting.app = e;
        this.getAmount();
        this.appModal.close();
        this.isShowApp = false;
    }
    // 手机品牌
    private onBrandMessage(e){
        this.policy.targeting.brand = e;
        this.brandModal.close();
        this.isShowBrand = false;
        if(this.policy.targeting.brand.length === 0){
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
            this.policy.targeting[i] = [];
            for(let j = 0;j < this.targetModal[i].length;j++){
                if(this.targetModal[i][j] && this.targetModal[i][j].value){
                    this.policy.targeting[i].push(this.targetModal[i][j].id);
                }
            }
        }   
        this.policy.targeting.adx = [];
        this.policy.targeting.contract = [];
        if(this.policy.targeting.appType.isInclude){
            this.policy.targeting.appType.value = [];
            for(let i = 0;i < this.appTypes.length;i++){
                this.appTypes[i].selected && this.policy.targeting.appType.value.push(this.appTypes[i].id);
            }
        }    
        for(let i = 0;i < this.adxs.length;i++){
            this.adxs[i].selected && this.policy.targeting.adx.push(this.adxs[i].id);
        }
        for(let i = 0;i < this.contracts.length;i++){
            this.contracts[i].selected && this.policy.targeting.contract.push(this.contracts[i].id);
        }
    }
    // 编辑定向初始化
    private initTargeting(){
        for(let i = 0;i < this.appTypes.length;i++){
            this.appTypes[i].selected = this.publicService.isExistByArr(this.appTypes[i].id,this.policy.targeting.appType.value) ? true : false;
        }
        for(let i = 0;i < this.adxs.length;i++){
            this.adxs[i].selected = this.publicService.isExistByArr(this.adxs[i].id,this.policy.targeting.adx) ? true : false;
        }
        for(let i = 0;i < this.contracts.length;i++){
            this.contracts[i].selected = this.publicService.isExistByArr(this.contracts[i].id,this.policy.targeting.contract) ? true : false;
        }
        this.isNodid = this.policy.targeting.nodid.length === 0 ? false : true;
    }
    // 取消手机品牌定向
    private deleteCellphone(){
        this.policy.targeting.brand = [];
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
    // 媒体类型选择切换
    private toggleAppType(v){
        let count = 0;
        for(let i = 0;i < this.appTypes.length;i++){
            if(this.appTypes[i].selected){
                count++;
            }
        }
        if(count === 1 && v.selected){
            this.myModalService.alert("必须保留一个分类");
            return;
        }
        if(this.policy.targeting.appType && this.policy.targeting.appType.isInclude === "0" && count === (this.appTypes.length - 1) && !v.selected){
            this.myModalService.alert("不能全选分类");
            return;
        }
        v.selected = !v.selected;
    }
    // 删除设备id
    private deleteNodid(){
        this.isNodid = false;
        this.policy.targeting.nodid = [];   
    }
    // 选择设备id
    private showNodid(){
        this.isNodid = true;
    }
    // 地域名称初始化
    private getRegionName(){
        this.regionComponent.regionData = this.publicService.clone(this.policy.targeting.region);
        this.regionComponent.getRegion();
        let waitResult = this.regionComponent.$result.subscribe(data => {
            this.policy.targeting.region = [];
            for(let i = 0;i < data.length;i++){
                this.policy.targeting.region.push(data[i].id);
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
        this.subject.subscribe({
            next: (data) => {
                if(data === 4){
                    this.targetModal = new TargetModal(this.id ? this.policy.targeting.network : this.campaign.targeting.network,this.id ? this.policy.targeting.carrier : this.campaign.targeting.carrier,this.id ? this.policy.targeting.device : this.campaign.targeting.device,this.id ? this.policy.targeting.os : this.campaign.targeting.os);
                    this.timeToKpi();
                    this.targetModalToStatus();
                    this.initTargeting();
                    this.getRegionName();
                }
            }
        })
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
    private onNodidMessage(e){
        this.policy.targeting.nodid = e;
        console.log(this.policy.targeting.nodid)
    }
    // 验证
    private validate(){
        // 渠道定向至少一个
        if(this.policy.targeting.adx.length === 0 && this.policy.targeting.contract.length ===0){
            this.myModalService.alert(this.chineseService.config.NOT_CANAL);
            return false;
        }
        return true;
    }
    // 取消
    private cancel(){
        window.history.back();
    }
    // 保存
    private save(){
        this.setTargeting();
        
        if(this.validationService.validate()){
            if(!this.validate()){
                return;
            }
            this.transformMoney("policy","realBid");
            if(this.id){
                this.rootService.updatePolicy(this.id,this.policy).subscribe(
                    result => {
                        this.router.navigate(["/home/campaign/policy/policyDetail/" + this.campaignId + "/" + this.id]);
                    },
                    error => {
                        this.transformMoney("policy","realBid",true);
                        this.myModalService.alert(error.message);
                    }
                )
            }else{
                this.rootService.createPolicy(this.policy).subscribe(
                    result => {
                        this.router.navigate(["/home/campaign/policy/policyCreate/" + this.campaignId + "/" + result.body.id]);
                    },
                    error => {
                        this.transformMoney("policy","realBid",true);
                        this.myModalService.alert(error.message);
                    }
                )
            }
        }else{
            this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
        }
        
    }
    
}

