// BY zhangfei
import { Component,OnInit,ViewChild,Input,EventEmitter,Output,OnChanges } from "@angular/core";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";
declare var require;
@Component({
	selector: "ng-kpi",
	template: `
        <div class="campaign-kpi-box font14 kpi-err">
            <div *ngIf="!ready" class="campaign-kpi-header flex-start-center">
                <div class="ml20">投放日期：</div>
                <button class="btn btn-primary btn-sm height30 ml20" (click)="removeWeekend()">周末不投放</button>        
                <div class="ml60">投放时间：</div>
                <button class="btn btn-primary btn-sm height30 ml20" (click)="allDay()">全天</button>
                <button class="btn btn-primary btn-sm height30 ml20" (click)="sessionDay()">8：00 - 23:59</button>
                <div class="ml60">总KPI及成本：</div>
                <img class="ml20" src="{{ m }}">
                <div class="width100 ml10">
                    <input type="number" class="form-control height30 pl5" [(ngModel)]="totalImpression" name="totalImpression" validation [validations]="'typeflag'">
                </div>
                <img class="ml20" src="{{ c }}">
                <div class="width100 ml10">
                    <input type="number" class="form-control height30 pl5" [(ngModel)]="totalClick" name="totalClick" validation [validations]="'typeflag'">
                </div>
                <img class="ml20" src="{{ money }}">
                <div class="width100 ml10">
                    <input type="number" class="form-control height30 pl5" [(ngModel)]="totalBudget" name="totalBudget" validation [validations]="'rate'">
                </div>
                <button class="btn btn-primary btn-sm height30 ml20 mr10" (click)="average()">确定均分</button>
                <span class="icon-alert-02 font20" title="已锁定的日期不参与均分"></span>
            </div>
            <div class="flex-base bgc-gray9 column-scroll" [class.transparent]="ready">
                <div class="campaign-kpi-body-cell height30 width-8"></div>
                <div class="campaign-kpi-body-cell ml-indent height30 textcenter line-height30 width-10">日KPI及成本</div>
                <div (click)="columnSelected(i)" *ngFor="let v of hours;let i = index" class="campaign-kpi-body-cell ml-indent height30 textcenter line-height30 pointer">{{ v + "点" }}</div>
            </div>
            <div class="campaign-kpi-body column-scroll">
                <div *ngFor="let v of temporaryKpis;let i = index" class="flex-base" [class.transparent]="ready">
                    <div (click)="rowSelected(i)" class="campaign-kpi-body-cell width-8 mt-indent textcenter pointer" [class.bgc-yellow1]="v.period !== 0">
                        <div class="column-center">
                            <div>{{ publicService.FormalTimeLine(v.day) }}</div>
                            <div>{{ chineseService.config.WEEKS_ARRAY_ONE_SEVEN[publicService.getWeek(v.day)] }}</div>
                        </div>
                    </div>
                    <div class="campaign-kpi-body-cell ml-indent width-10 mt-indent flex-base">
                        <div class="width25" *ngIf="!ready">
                            <img *ngIf="v.isLock === '1'" src="{{ lockClose }}" class="column-center ml10 pointer" (click)="lockChange(v,'0')">
                            <img *ngIf="v.isLock === '0'" src="{{ lockOpen }}" class="column-center ml10 pointer" (click)="lockChange(v,'1')">
                        </div>
                        <div class="flex-column-around-center ml10">
                            <img src="{{ m }}">
                            <img src="{{ c }}">
                            <img src="{{ money }}">
                        </div>
                        <div class="flex-column-around-center ml5">
                            <div class="width80">
                                <input [disabled]="ready" type="number" class="form-control height20 pl5" [(ngModel)]="v.dailyImpression" [attr.name]="'dailyImpression'+i" validation [validations]="'typeflag'">
                            </div>
                            <div class="width80">
                                <input [disabled]="ready" type="number" class="form-control height20 pl5" [(ngModel)]="v.dailyClick" [attr.name]="'dailyClick'+i" validation [validations]="'typeflag'">
                            </div>
                            <div class="width80">
                                <input [disabled]="ready" type="number" class="form-control height20 pl5" [(ngModel)]="v.dailyBudget" [attr.name]="'dailyBudget'+i" validation [validations]="'rate'">
                            </div>
                        </div>
                    </div>
                    <div *ngFor="let j of hours" class="campaign-kpi-body-cell ml-indent mt-indent" 
                         [class.bgc-yellow1]="isSelected(v.period,j)"
                         [class.bgc-yellow2]="isSelected(periodsCache[i]['period'],j)"
                         (mousedown)="selectedDown(i,j)"
                         (mouseenter)="isDown && selectedMove(i,j)" 
                         (mouseleave)="isDown && selectedLeave()"
                         (mouseup)="isDown && selectedUp(i,j)"
                    ></div>
                </div>
            </div>
            <div class="campaign-kpi-footer flex-center">
                <div class="width142 flex-around-center">
                    <button *ngIf="!ready" class="btn btn-cancel btn-sm height30 width65" (click)="kpiCancel()">取消</button>
                    <button class="btn btn-primary btn-sm height30 width65" (click)="kpiConfirm()">确定</button>
                </div>    
            </div>
        </div>
    `
})

export class KpiComponent implements OnInit,OnChanges {

    @Input() kpi;

    @Input() ready: boolean;

    @Input() totalBudget: number;

    @Input() totalClick: number;

    @Input() totalImpression: number;

    @Output() outer: EventEmitter<any> = new EventEmitter();

    private lockOpen = require("../../images/lockOpen.png");

    private lockClose = require("../../images/lockClose.png");

    private c = require("../../images/c.png");

    private m = require("../../images/m.png");

    private money = require("../../images/money.png");

	private hours = [];

    private isDown = false;

    private periodsCache = [];

    private beginIndexObj = {
        i: 0,
        j: 0
    };

    private timer = null;

    private temporaryKpis = [];

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
        private validationService: ValidationService,
        private myModalService: MyModalService
	) {}

	ngOnInit() {
        this.dataInit();
	}
    ngOnChanges() {
        this.temporaryKpis = this.publicService.clone(this.kpi);
        this.periodsCacheInit();
	}
    // 数据初始化
    private dataInit(){
        this.temporaryKpis = this.publicService.clone(this.kpi);
        this.hoursInit();
        this.periodsCacheInit();
    }
    // 缓存选择进行数据
    private periodsCacheInit(){
        this.periodsCache = [];
        for(let i = 0;i < this.temporaryKpis.length;i++){
            this.periodsCache.push({
                period: 0
            })
        }
    }
    // 表格选择区域初始化
    private hoursInit(){
        for(let i = 0;i < 24;i++){
            this.hours.push(i);
        }
    }
    // 锁定
    private lockChange(v,value){
        v.isLock = value;
    }
    // 开始
    private selectedDown(i,j){
        this.isDown = true;
        this.beginIndexObj.i = i;
        this.beginIndexObj.j = j;
        this.changeCache({
            i: i,
            j: j
        },{
            i: i,
            j: j
        });
    }
    // 进行
    private selectedMove(i,j){
        clearTimeout(this.timer);
        this.changeCache({
            i: this.beginIndexObj.i <= i ? this.beginIndexObj.i : i,
            j: this.beginIndexObj.j <= j ? this.beginIndexObj.j : j
        },{
            i: this.beginIndexObj.i >= i ? this.beginIndexObj.i : i,
            j: this.beginIndexObj.j >= j ? this.beginIndexObj.j : j
        });
    }
    // 进行时移出区域
    private selectedLeave(){
        this.periodsCacheInit();
        this.timer = setTimeout(() => {
            this.isDown = false;
        },1);
    }
    // 结束
    private selectedUp(i,j){
        this.changePeriods({
            i: this.beginIndexObj.i < i ? this.beginIndexObj.i : i,
            j: this.beginIndexObj.j < j ? this.beginIndexObj.j : j
        },{
            i: this.beginIndexObj.i > i ? this.beginIndexObj.i : i,
            j: this.beginIndexObj.j > j ? this.beginIndexObj.j : j
        });
        this.periodsCacheInit();
        this.isDown = false;
    }
    // 判断ui
    private isSelected(period,j){
        period = this.reverseNum(period,24);
        return ((period >> j) & 1) === 1 ? true : false;
    }
    // 生效
    private changePeriods(beginIndexObj,endIndexObj){
        for(let i = beginIndexObj.i;i <= endIndexObj.i;i++){
            let period = this.reverseNum(this.temporaryKpis[i].period,24);
            for(let j = beginIndexObj.j;j <= endIndexObj.j;j++){
                period = this.isSelected(this.temporaryKpis[i].period,j) ? period - Math.pow(2,j) : period + Math.pow(2,j);
            }
            this.temporaryKpis[i].period = this.reverseNum(period,24);
        }
    }
    // 选择
    private changeCache(beginIndexObj,endIndexObj){
        this.periodsCacheInit();
        for(let i = beginIndexObj.i;i <= endIndexObj.i;i++){
            for(let j = beginIndexObj.j;j <= endIndexObj.j;j++){
                this.periodsCache[i].period += Math.pow(2,j);
            }
            this.periodsCache[i].period = this.reverseNum(this.periodsCache[i].period,24);
        }
    }
    // 二进制翻转
    private reverseNum(a,len){
        let tmp = 0;
        for(let i = 0,j = len - 1;i < len;i++,j--){
            if((a >> i) & 1){
                tmp|=((a >> i) & 1) << j;
            }
        }
        return tmp;
    }
	// 垂直全选
    private columnSelected(j){
        let index = 0;
        for(let i = 0;i < this.temporaryKpis.length;i++){   
            if(!this.isSelected(this.temporaryKpis[i].period,j)){
                let period = this.reverseNum(this.temporaryKpis[i].period,24);
                period = period + Math.pow(2,j);
                this.temporaryKpis[i].period = this.reverseNum(period,24);
                index ++;
            }
        }
        if(index === 0){
            for(let i = 0;i < this.temporaryKpis.length;i++){
                let period = this.reverseNum(this.temporaryKpis[i].period,24);
                period = period - Math.pow(2,j);
                this.temporaryKpis[i].period = this.reverseNum(period,24);
            }
        }
    }
    // 水平全选
    private rowSelected(i){
        let index = 0;
        let period = this.reverseNum(this.temporaryKpis[i].period,24);
        for(let j = 0;j < 24;j++){
            if(!this.isSelected(this.temporaryKpis[i].period,j)){
                period = period + Math.pow(2,j);
                index ++;
            }   
        }
        this.temporaryKpis[i].period = this.reverseNum(period,24);
        if(index === 0){
            let period = this.reverseNum(this.temporaryKpis[i].period,24);
            for(let j = 0;j < 24;j++){               
                period = period - Math.pow(2,j);             
            }
            this.temporaryKpis[i].period = this.reverseNum(period,24);
        }
    }
    // 周末不投放
    private removeWeekend(){
        for(let i = 0;i < this.temporaryKpis.length;i++){
            if(this.publicService.getWeek(this.temporaryKpis[i].day) === 0 || this.publicService.getWeek(this.temporaryKpis[i].day) === 6){
                this.temporaryKpis[i].period = 0;
            }else{
                this.temporaryKpis[i].period = 16777215;
            }
        }
    }
    // 全天投放
    private allDay(){
        for(let i = 0;i < this.temporaryKpis.length;i++){
            if(this.temporaryKpis[i].period !== 0){
                this.temporaryKpis[i].period = 16777215;
            }
        }
    }
    // 8 -23
    private sessionDay(){
        for(let i = 0;i < this.temporaryKpis.length;i++){
            if(this.temporaryKpis[i].period !== 0){
                this.temporaryKpis[i].period = 65535;
            }
        }
    }
    // 均分
    private average(){
        let totalCount = 0;
        let budget = this.totalBudget;
        let click = this.totalClick;
        let impression = this.totalImpression;
        let index;
        let num = 0;
        for(let i = 0;i < this.temporaryKpis.length;i++){
            if(this.temporaryKpis[i].isLock === "0" && this.temporaryKpis[i].period){
                totalCount ++;
                if(!num){
                    index = i;
                    num ++;
                }
            }else{
                if(budget && this.temporaryKpis[i].dailyBudget && this.temporaryKpis[i].isLock === "1"){
                    if(budget < parseFloat(this.temporaryKpis[i].dailyBudget)){
                        this.myModalService.alert("日预算不能大于总预算");
                        return;
                    }else{
                        budget -= this.temporaryKpis[i].dailyBudget;
                        budget = parseFloat(budget.toFixed(2));
                    }
                }
                if(click && this.temporaryKpis[i].dailyClick && this.temporaryKpis[i].isLock === "1"){
                    if(click < parseFloat(this.temporaryKpis[i].dailyClick)){
                        this.myModalService.alert("日点击不能大于总点击");
                        return;
                    }else{
                        click -= this.temporaryKpis[i].dailyClick;
                        click = parseFloat(click.toFixed(2));
                    }
                }
                if(impression && this.temporaryKpis[i].dailyImpression && this.temporaryKpis[i].isLock === "1"){
                    if(impression < parseFloat(this.temporaryKpis[i].dailyImpression)){
                        this.myModalService.alert("日展现不能大于总展现");
                        return;
                    }else{
                        impression -= this.temporaryKpis[i].dailyImpression;
                        impression = parseFloat(impression.toFixed(2));
                    }
                }     
            }
        }
        if(!totalCount){
            return;
        }
        let averageBudget = budget ? Math.floor(budget / totalCount) : undefined;
        let averageClick = click ? Math.floor(click / totalCount) : undefined;
        let averageImpression = impression ? Math.floor(impression / totalCount) : undefined;
        let remBudget = budget ? budget % totalCount : undefined;
        let remClick = click ? click % totalCount : undefined;
        let remImpression = impression ? impression % totalCount : undefined;
        for(let i = 0;i < this.temporaryKpis.length;i++){
            if(this.temporaryKpis[i].isLock === "0" && this.temporaryKpis[i].period){
                if(i === index){
                    if(averageBudget){
                        this.temporaryKpis[i].dailyBudget = averageBudget + remBudget;
                        this.temporaryKpis[i].dailyBudget = parseFloat(this.temporaryKpis[i].dailyBudget.toFixed(2));
                    }else{
                        this.temporaryKpis[i].dailyBudget = remBudget;
                    }
                    if(averageClick){
                        this.temporaryKpis[i].dailyClick = averageClick + remClick;
                        this.temporaryKpis[i].dailyClick = parseInt(this.temporaryKpis[i].dailyClick);
                    }else{
                        this.temporaryKpis[i].dailyClick = remClick;
                    }
                    if(averageImpression){
                        this.temporaryKpis[i].dailyImpression = averageImpression + remImpression;
                        this.temporaryKpis[i].dailyImpression = parseInt(this.temporaryKpis[i].dailyImpression);
                    }else{
                        this.temporaryKpis[i].dailyImpression = remImpression;
                    }
                }else{
                    if(averageBudget){
                        this.temporaryKpis[i].dailyBudget = averageBudget
                    }else{
                        this.temporaryKpis[i].dailyBudget = undefined;
                    }
                    if(averageClick){
                        this.temporaryKpis[i].dailyClick = averageClick
                    }else{
                        this.temporaryKpis[i].dailyClick = undefined;
                    }
                    if(averageImpression){
                        this.temporaryKpis[i].dailyImpression = averageImpression
                    }else{
                        this.temporaryKpis[i].dailyImpression = undefined;
                    }
                }
            }      
        }
    }
    // 如果日期不投放，则填写总数的分日补零
    private addZero(){
        for(let i = 0;i < this.temporaryKpis.length;i++){
            if(this.temporaryKpis[i].period === 0){
                this.temporaryKpis[i].dailyBudget = this.totalBudget && !this.temporaryKpis[i].dailyBudget ? 0 : this.temporaryKpis[i].dailyBudget;
                this.temporaryKpis[i].dailyClick = this.totalClick && !this.temporaryKpis[i].dailyClick ? 0 : this.temporaryKpis[i].dailyClick;
                this.temporaryKpis[i].dailyImpression = this.totalImpression && !this.temporaryKpis[i].dailyImpression ? 0 : this.temporaryKpis[i].dailyImpression;
            }
        }
    }
    // kpi取消
    private kpiCancel(){
        this.outer.emit({
            conFirm: false
        });
    }
    // kpi确定
    private kpiConfirm(){ 
        let typeFlat = /^[1-9]*[1-9][0-9]*$/;
        let rate = /^([1-9]*[1-9][0-9]*(.[0-9]{0,2})?|0.[0-9]?[1-9]|0.[1-9][0-9]?)$/;
        if((this.totalClick && !typeFlat.test(this.totalClick.toString())) || (this.totalImpression && !typeFlat.test(this.totalImpression.toString())) || (this.totalBudget && !rate.test(this.totalBudget.toString()))){
            this.myModalService.alert("请规范数据格式");
            return;
        }
        for(let i = 0;i < this.temporaryKpis.length;i++){
            if((this.temporaryKpis[i].dailyClick && !typeFlat.test(this.temporaryKpis[i].dailyClick.toString())) || (this.temporaryKpis[i].dailyImpression && !typeFlat.test(this.temporaryKpis[i].dailyImpression.toString())) || (this.temporaryKpis[i].dailyBudget && !rate.test(this.temporaryKpis[i].dailyBudget.toString()))){
                this.myModalService.alert("请规范数据格式");
                return;
            }
        }
        this.addZero();     
        this.outer.emit({
            kpi: this.temporaryKpis,
            totalBudget: this.totalBudget,
            totalClick: this.totalClick,
            totalImpression: this.totalImpression,
            conFirm: true
        });   
    }
}