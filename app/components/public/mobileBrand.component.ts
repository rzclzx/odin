// BY zhangfei
import { Component,OnInit,ViewChild,Input,EventEmitter,Output } from "@angular/core";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { RootService } from "../../services/root.service";
import { MyModalService } from "../../services/myModal.service";
@Component({
	selector: "mobile-brand",
	template: `
        <div class="height50 line-height50 border-bottom-gray3-1px flex-base disSelected color-gray5">
            <label class="ml15">
                <input type="checkbox" [(ngModel)]="oneLevelSelected" name="oneLevelSelected" (change)="allSelected('01')">一级品牌
            </label>
            <label class="ml40">
                <input type="checkbox" [(ngModel)]="twoLevelSelected" name="twoLevelSelected" (change)="allSelected('02')">二级品牌
            </label>
        </div>
        <div class="mymodal-content disSelected">
            <div class="flex-wrap mt10 mb20">
                <label class="width-20 height25 font12 ell" *ngFor="let v of brands;let i = index;">
                    <input type="checkbox" [(ngModel)]="v.selected" [attr.name]="'selected' + i" (change)="judAll()">{{ v.cnName }}
                </label>
            </div>
            <div class="flex-end-center mt50">
                <button class="btn btn-cancel btn-sm height30 width65 mr20" (click)="cancel()">取消</button>
                <button class="btn btn-primary btn-sm height30 width65 mr20" (click)="confirm()">保存</button>
            </div>
        </div>    
    `
})

export class MobileBrandComponent implements OnInit {

    @Output() outer: EventEmitter<any> = new EventEmitter();

    @Input() brand;

    @Input() limit;

    private brands = [];

    private newBrand = [];

    private oneLevelSelected: boolean = false;

    private twoLevelSelected: boolean = false;

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
        private rootService: RootService,
        private myModalService: MyModalService
	) {}

	ngOnInit() {
        this.dataInit();
	}
    
    private dataInit(){
        this.rootService.brandList().subscribe(
            result => {
                this.brands = result.body.items;
                this.selectedStatusInit();
                this.judAll();
            },
            error => {
                this.myModalService.alert(error.message);
            }
        )
    }
    // 数据筛选
    private dataFilter(){
        this.newBrand = [];
        for(let i = 0;i < this.brands.length;i++){        
            this.brands[i].selected && this.newBrand.push(this.brands[i].id); 
        }
    }
    // 选择初始化
    private selectedStatusInit(){
        for(let i = 0;i < this.brands.length;i++){
            this.publicService.isExistByArr(this.brands[i].id,this.brand) && (this.brands[i].selected = true);
        }
    }
    // 全选
    private allSelected(grade){
        if(grade === "01"){
            if(this.oneLevelSelected){
                for(let i = 0;i < this.brands.length;i++){
                    if(this.brands[i].grade === "1"){
                        this.brands[i].selected = true;
                    }
                }
            }else{
                for(let i = 0;i < this.brands.length;i++){
                    if(this.brands[i].grade === "1"){
                        this.brands[i].selected = false;
                    }
                }
            }
        }else{
            if(this.twoLevelSelected){
                for(let i = 0;i < this.brands.length;i++){
                    if(this.brands[i].grade === "2"){
                        this.brands[i].selected = true;
                    }
                }
            }else{
                for(let i = 0;i < this.brands.length;i++){
                    if(this.brands[i].grade === "2"){
                        this.brands[i].selected = false;
                    }
                }
            }
        }
    }
    // 判断全选
    private judAll(){
        let oneAll = 0,
            oneSelected = 0,
            twoAll = 0,
            twoSelected = 0;
        for(let i = 0;i < this.brands.length;i++){
            if(this.brands[i].grade === "1"){
                oneAll ++;
                if(this.brands[i].selected){
                    oneSelected ++;
                }
            }
            if(this.brands[i].grade === "2"){
                twoAll ++;
                if(this.brands[i].selected){
                    twoSelected ++;
                }
            }
        }
        this.oneLevelSelected = oneAll === oneSelected ? true : false;
        this.twoLevelSelected = twoAll === twoSelected ? true : false;
    }
    // 取消
    private cancel(){
        this.outer.emit(this.brand);
    }
    // 确定
    private confirm(){
        this.dataFilter();
        if(this.newBrand.length === 0){
            this.myModalService.alert("至少选择一个手机品牌");
            return;
        }
        this.outer.emit(this.newBrand);
    }
}