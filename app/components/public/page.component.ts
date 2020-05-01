// BY zhangfei
import { Component, OnInit, Output, EventEmitter, Input,ViewChild,OnChanges,DoCheck } from "@angular/core";
import { MyModalService } from "../../services/myModal.service";
import { ChineseService } from "../../services/chinese.service";

@Component({
	selector: "ng-page",
	template: `
		<div class="flex-between-center height50 border-gray13-1px bgc-gray14 disSelected" [class.border-top0]="isFooter" [class.border-bottom0]="!isFooter"> 
            <div class="flex-start-center height50">
                <ng-content></ng-content>
            </div>
            <div class="flex-end-center height50">
                <div class="mr20 height50 line-height50 font14">{{ "共 " + page.total + " 条" }}</div>
                <div class="flex-start-center mr30">
                    <div class="mr10 height50 line-height50 font14">每页展示</div>
                    <div class="width50">
                        <select class="width50 height28 radius3" [(ngModel)]="page.pageSize" name="pageSize" (change)="selectedSize()">
                            <option [ngValue]="10">10</option>
                            <option [ngValue]="20">20</option>
                            <option [ngValue]="50">50</option>
                            <option [ngValue]="100">100</option>
                            <option [ngValue]="200">200</option>
                        </select>
                    </div>
                    <div class="ml10 height50 line-height50 font14">条</div>
                </div>
                <div class="new-page-outer mr5 textcenter page-hover" [class.page-dis]="page.pageNo === 0" (click)="changeCurrentShow(-2)">«</div>
                <div class="new-page-inner mr20 textcenter page-hover" [class.page-dis]="page.pageNo === 0" (click)="changeCurrentShow(-1)">‹</div>
                <ng-container *ngFor="let v of countArr">
                    <div *ngIf="(v + 1) >= page.currentShow && (v + 1) <= (page.currentShow + 4)" (click)="onPage(v)" class="new-page-inner page-hover font12 textcenter mr5" [class.page-current]="v === page.pageNo">{{ v + 1 }}</div>
                </ng-container>
                <div class="new-page-inner page-hover mr5 ml15 textcenter" [class.page-dis]="l === page.pageNo + 1" (click)="changeCurrentShow(1)">›</div>
                <div class="new-page-outer page-hover mr20 textcenter" [class.page-dis]="l === page.pageNo + 1" (click)="changeCurrentShow(2)">»</div>
            </div>        
		</div>
    `
})

export class PageComponent implements DoCheck{

    @Input() isFooter;

    @Input() page;

    @Output() outerPage: EventEmitter<any> = new EventEmitter();

    private countArr = [];

    private l = 0;

	constructor(
		private myModalService: MyModalService,
		private chineseService: ChineseService
	) {}

    
    ngDoCheck(){
        this.countArr = [];
        if(this.page.total === 0){
            this.countArr = [0];
            this.l = 1;
        }else{
            if(this.page.total % this.page.pageSize === 0){
                this.l = Math.floor(this.page.total / this.page.pageSize);
            }else{
                this.l = Math.floor(this.page.total / this.page.pageSize) + 1;
            }
            
            for(let i = 0;i < this.l;i++){
                this.countArr.push(i);
            }
        }
    }
    // 页码箭头功能
    private changeCurrentShow(value){
        if(value === 1){
            if(this.l === this.page.pageNo + 1){
                return;
            }
            this.page.pageNo += 1;
            if(this.page.pageNo + 1 - this.page.currentShow > 4){
                this.page.currentShow += 5;
            }
        }else if(value === -1){
            if(this.page.pageNo === 0){
                return;
            }
            this.page.pageNo -= 1;
            if(this.page.pageNo + 1 < this.page.currentShow){
                this.page.currentShow -= 5;
            }
        }else if(value === 2){
            if(this.l === this.page.pageNo + 1){
                return;
            }
            if(this.l % 5 === 0){
                this.page.currentShow = this.l - 4;
                this.page.pageNo = this.l - 1;
            }else{
                this.page.currentShow = this.l - this.l % 5 + 1;
                this.page.pageNo = this.l - 1;
            }
        }else{
            if(this.page.pageNo === 0){
                return;
            }
            this.page.currentShow = 1;
            this.page.pageNo = 0;
        }
        this.outerPage.emit();
    }
    // 页码换页功能
    private onPage(value){
        this.page.pageNo = value;
        this.outerPage.emit();
    }
    // 选择页数
    private selectedSize(){
        this.outerPage.emit(1);
    }
}