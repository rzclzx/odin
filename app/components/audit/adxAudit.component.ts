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
let path = require("./adxAudit.html");
@Component({
	selector: "adx-audit",
	template: path
})

export class AdxAuditComponent implements OnInit {

    @ViewChild("appModal") appModal;

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
            name: "审核物料包",
            value: undefined
        }
    ];

    private subject = new Subject();

    private id: string;

    private campaign: Campaign = new Campaign();

    private isShowApp: boolean = false;

    private adxs = [];

    private contracts = [];

    private appTypes = [];

    private realBid: number;

    private number1 = require("../../images/1.png");

    private number2 = require("../../images/2.png");

    private number3 = require("../../images/3.png");

    private yr = require("../../images/yr.png");

    private gr = require("../../images/gr.png");

    private asyncCount: number = 0;

    private appAmount: number;

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
        this.rootService.adxList().subscribe(
            result => {
                this.adxs = result.body.items;
                this.asyncCount ++;
                this.subject.next(this.asyncCount)
            },
            error => {
                //this.myModalService.alert(error.message);
            }
        )
        this.rootService.contractList().subscribe(
            result => {
                this.contracts = result.body.items;
                this.asyncCount ++;
                this.subject.next(this.asyncCount)
            },
            error => {
                //this.myModalService.alert(error.message);
            }
        )
        this.rootService.appTypeList().subscribe(
            result => {
                this.appTypes = result.body.items;
                this.asyncCount ++;
                this.subject.next(this.asyncCount)
            },
            error => {
                //this.myModalService.alert(error.message);
            }
        )

      
        this.editInit();
        
        this.asyncDataInit();
    }
    // 编辑初始化
    private editInit(){
        this.campaignService.get(this.id).subscribe(
            result => {
                this.campaign = result.body;
                if(!this.campaign.targeting.app){
                    this.campaign.targeting.app = new App();
                }
                if(!this.campaign.targeting.appType){
                    this.campaign.targeting.appType = new App();
                }
                this.getAmount();
                this.asyncCount ++;
                this.subject.next(this.asyncCount)
            },
            error => {
                //this.myModalService.alert(error.message);
            }
        )
    }
    // 选择媒体数量
    private getAmount(){
        this.appAmount = this.campaign.targeting.app.value ? this.campaign.targeting.app.value.length : undefined;
    }
    // 选择媒体
    private showApp(){
        this.isShowApp = true;
        this.appModal.open();
    }
    // 媒体
    private onAppMessage(e){
        this.campaign.targeting.app = e;
        this.getAmount();
        this.appModal.close();
        this.isShowApp = false;
    }


    // 设置定向信息
    private setTargeting(){
        
        this.campaign.targeting.adx = [];
        this.campaign.targeting.contract = [];
        if(this.campaign.targeting.appType.isInclude){
            this.campaign.targeting.appType.value = [];
            for(let i = 0;i < this.appTypes.length;i++){
                this.appTypes[i].selected && this.campaign.targeting.appType.value.push(this.appTypes[i].id);
            }
        }
        
        for(let i = 0;i < this.adxs.length;i++){
            this.adxs[i].selected && this.campaign.targeting.adx.push(this.adxs[i].id);
        }
        for(let i = 0;i < this.contracts.length;i++){
            this.contracts[i].selected && this.campaign.targeting.contract.push(this.contracts[i].id);
        }
    }
    // 编辑定向初始化
    private initTargeting(){
        for(let i = 0;i < this.appTypes.length;i++){
            this.appTypes[i].selected = this.publicService.isExistByArr(this.appTypes[i].id,this.campaign.targeting.appType.value) ? true : false;
        }
        for(let i = 0;i < this.adxs.length;i++){
            this.adxs[i].selected = this.publicService.isExistByArr(this.adxs[i].id,this.campaign.targeting.adx) ? true : false;
        }
        for(let i = 0;i < this.contracts.length;i++){
            this.contracts[i].selected = this.publicService.isExistByArr(this.contracts[i].id,this.campaign.targeting.contract) ? true : false;
        }
    }
    // 验证媒体类型
    private validateAppType(){
        if(this.campaign.targeting.appType && this.campaign.targeting.appType.isInclude === "1"){
            let count = 0;
            for(let i = 0;i < this.appTypes.length;i++){
                if(this.appTypes[i].selected){
                    count++;
                }
            }
            if(count === 0){
                this.myModalService.alert("至少选择一个分类")
                return false;
            }
        }
        if(this.campaign.targeting.appType && this.campaign.targeting.appType.isInclude === "0"){
            let count = 0;
            for(let i = 0;i < this.appTypes.length;i++){
                if(this.appTypes[i].selected){
                    count++;
                }
            }
            if(count === 0){
                this.myModalService.alert("至少选择一个分类")
                return false;
            }
            if(count === this.appTypes.length){
                this.myModalService.alert("排除媒体时，不能全选分类")
                return false;
            }
        }
        return true;
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
        if(this.campaign.targeting.appType && this.campaign.targeting.appType.isInclude === "0" && count === (this.appTypes.length - 1) && !v.selected){
            this.myModalService.alert("不能全选分类");
            return;
        }
        v.selected = !v.selected;
    }

    // 异步数据初始化
    private asyncDataInit(){
        this.subject.subscribe({
            next: (data) => {
                if(data === 4){ 
                    this.initTargeting();
                }
            }
        })
    }
    // 清除apptype
    private removeAppType(){
        this.campaign.targeting.appType = {};
        for(let i = 0;i < this.appTypes.length;i++){
            this.appTypes[i].selected = false;
        }
    }
    // 验证
    private validate(){
        // 渠道定向至少一个
        if(this.campaign.targeting.adx.length === 0 && this.campaign.targeting.contract.length ===0){
            this.myModalService.alert(this.chineseService.config.NOT_CANAL);
            return false;
        }
        if(!this.validateAppType()){
            return false;
        }
        return true;
    }
    // 上一步
    private prevent(){
        this.router.navigate(["/home/campaign/audit/packageAudit/" + this.id]);
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
            this.campaignService.update(this.id,this.campaign).subscribe(
                result => {          
                    this.realBid = this.realBid*100;
                    this.rootService.auditCampaign(this.id,{
                        auditStatus: "02",
                        id: this.campaign.id,
                        realBid: this.realBid
                    }).subscribe(
                        result => {
                            this.router.navigate(["/home/campaign/policy/policyList/" + this.id]);
                        },
                        error => {
                            this.realBid = this.realBid/100;
                            //this.myModalService.alert(error.message);
                        }
                    )
                },
                error => {
                    //this.myModalService.alert(error.message);
                }
            )         
        }else{
            this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
        }
        
    }
    
}

