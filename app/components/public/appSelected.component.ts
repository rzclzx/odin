// BY zhangfei
import { Component,OnInit,ViewChild,Input,EventEmitter,Output } from "@angular/core";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { RootService } from "../../services/root.service";
import { MyModalService } from "../../services/myModal.service";
@Component({
	selector: "ng-app",
	template: `
        <div class="mymodal-content">
            <div class="flex-base">
                <div class="width370 height635">
                    <div class="flex-start-center">
                        <div class="mr10">媒体关键字</div>
                        <span class="icon-alert-022 campaign-appType-alertshow"></span>
                        <div class="campaign-appType-alert left150">
                            <div class="width250 line-height30 textleft wordwrap">1、最多输入500个关键字</div>
                            <div class="width250 line-height30 textleft wordwrap">2、每个关键字最多20个字</div>
                            <div class="width250 line-height30 textleft wordwrap">3、关键字之间用逗号或回车隔开</div>
                        </div>
                    </div>             
                    <textarea class="width370 height120 mt10" [(ngModel)]="name" name="name"></textarea>
                    <div class="flex-base mt10">
                        <label>
                            <input type="radio" [(ngModel)]="searchType" [value]="'0'" name="searchType1">模糊查询
                        </label>
                        <label class="ml20">
                            <input type="radio" [(ngModel)]="searchType" [value]="'1'" name="searchType2">精确查询
                        </label>
                    </div>
                    <div class="flex-start-center mt10">
                        <div class="width175">
                            <select class="form-control" [(ngModel)]="adxId">
                                <option [ngValue]="0">所有渠道</option>
                                <option *ngFor="let v of adxs;let i = index" [ngValue]="v.id">{{ v.name }}</option>
                            </select>
                        </div>
                        <button class="btn btn-primary btn-sm height30 ml40 width65" (click)="search()">查询</button>
                    </div>
                    <div class="flex-base mt10 height50 line-height50 width370 textcenter">
                        <div class="border-text-1px border-right0 width-35">媒体名称</div>
                        <div class="border-text-1px border-right0 width-30">媒体分类</div>
                        <div class="border-text-1px width-35">所属渠道</div>
                    </div>
                    <div #scrollApp class="width370 height310 border-text-1px border-top0 column-scroll font12" (scroll)="addItems('scrollApp',100,apps,appsCache)">
                        <div *ngFor="let v of apps;let i = index" class="height34 line-height34 flex-start-center">
                            <div class="width40 height34 line-height34 pl10">
                                <input *ngIf="!selected[i]" type="checkbox" [(ngModel)]="v.isSelected" [attr.name]="'isSelected' + i"> 
                                <span *ngIf="selected[i]" class="icon-checked2"></span>
                            </div>                                  
                            <div class="width90 height34 textcenter" cutString [cutLength]="10">{{ v.name }}</div>
                            <div class="width110 height34 textcenter" cutString [cutLength]="10">{{ v.oneLevelName }}</div>
                            <div class="width110 height34 textcenter" cutString [cutLength]="10">{{ v.adxName }}</div>
                        </div>
                    </div>
                    <div class="textright mt10 font12">共 {{ appsCache.length }} 条</div>
                </div>
                <div class="width135 height635">
                    <button class="btn btn-primary btn-sm dispaly-block row-center mt350 width85" (click)="addAll()">全部加入</button>
                    <button class="btn btn-primary btn-sm dispaly-block row-center mt20 width85" (click)="deleteAll()">全部删除</button>
                    <button class="btn btn-primary btn-sm dispaly-block row-center mt20 width85" (click)="addApps()">加入已勾选</button>
                </div>
                <div class="width370 height635">
                    <div class="flex-between-center">
                        <div>已加入的媒体</div>
                        <div class="font12">共 {{ selectedAppsCache.length }} 条</div>
                    </div>
                    <div class="flex-base mt10 height50 line-height50 width370 textcenter">
                        <div class="border-text-1px border-right0 width-35">媒体名称</div>
                        <div class="border-text-1px border-right0 width-30">媒体分类</div>
                        <div class="border-text-1px width-35">所属渠道</div>
                    </div>
                    <div #scrollSelected class="width370 height518 border-text-1px border-top0 column-scroll font12" (scroll)="addItems('scrollSelected',100,selectedApps,selectedAppsCache)">
                        <div *ngFor="let v of selectedApps;let i = index" class="height34 line-height34 flex-start-center">
                            <div class="width40 height34 line-height34 pl10">
                                <span class="icon-delete2 pointer" (click)="deleteOne(i)"></span>
                            </div>                                  
                            <div class="width90 height34 textcenter" cutString [cutLength]="10">{{ v.name }}</div>
                            <div class="width110 height34 textcenter" cutString [cutLength]="10">{{ v.oneLevelName }}</div>
                            <div class="width110 height34 textcenter" cutString [cutLength]="10">{{ v.adxName }}</div>
                        </div>
                    </div>
                    <div class="flex-base mt10">
                        <label class="ml20">
                            <input type="radio" [(ngModel)]="isInclude" [value]="'1'">选择媒体
                        </label>
                        <label class="ml20">
                            <input type="radio" [(ngModel)]="isInclude" [value]="'0'">排除媒体
                        </label>
                    </div>
                </div>
            </div>
            <div class="flex-end-center mt50">
                <button class="btn btn-cancel btn-sm height30 width65 mr20" (click)="cancel()">取消</button>
                <button class="btn btn-primary btn-sm height30 width65 mr20" (click)="confirm()">保存</button>
            </div>
        </div>
        
    `
})

export class AppComponent implements OnInit {

    @Output() outer: EventEmitter<any> = new EventEmitter();

    @Input() app;

    @ViewChild("scrollApp") scrollApp;

    @ViewChild("scrollSelected") scrollSelected;

    private name: string = "";

    private searchType: string = "0";

    private adxId: any = 0;

    private adxs = [];

    private apps = [];

    private selectedApps = [];

    private selected = [];

    private isInclude: string = "1";

    private isInit = false;

    private appsCache = [];

    private selectedAppsCache = [];

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
        private rootService: RootService,
        private myModalService: MyModalService
	) {}

	ngOnInit() {
        this.rootService.adxList().subscribe(
            result => {
                this.adxs = result.body.items;
                this.selectedInit();
            },
            error => {
                this.myModalService.alert(error.message);
            }

        )
	}
    // 右侧选择初始化
    private selectedInit(){
        if(!this.app.isInclude){
            return;
        }
        this.isInclude = this.app.isInclude;
        if(this.app.value && this.app.value.length !== 0){
            this.rootService.appList({ids:this.app.value}).subscribe(
                result => {
                    this.selectedAppsCache = result.body.items;
                    this.addItems("scrollSelected",100,this.selectedApps,this.selectedAppsCache,true);
                    this.judSelected();
                },
                error => {
                    this.myModalService.alert(error.message);
                }
            )
        }    
    }
    // 搜索
    private search(){
        let arr = [];
        let name;
        name = this.publicService.removeBlank(this.name);
        name = this.publicService.blankToPoint(name);
        name = this.publicService.transformPoint(name);   
        if(name === ""){
            this.myModalService.alert(this.chineseService.config.SEARCH_NULL)
            return;
        }
        arr = name.split(",");
        if(arr.length > 500){
            this.myModalService.alert("最多输入500个关键字");
            return;
        }
        for(let i = 0;i < arr.length;i++){
            if(arr[i].length > 20){
                this.myModalService.alert("单个关键字不能超过20个字符");
                return;
            }
        }
        let options = {
            names: arr,
            adxId: this.adxId,
            searchType: this.searchType
        }
        this.appsCache = [];
        for(let i = 0;i < 1000;i++){
            this.appsCache.push({
                oneLevelName: "分类" + i%3 + 1,
                name: "媒体名称" + i % 5 + 1,
                adxName: "渠道名称" + i%4 + 1,
                id: i
            })
        }
        this.addItems("scrollApp",100,this.apps,this.appsCache,true);
        this.judSelected();
        // this.rootService.appList(options).subscribe(
        //     result => {
        //         this.appsCache = result.body.items;
        //         this.addItems("scrollApp",100,this.apps,this.appsCache,true);
        //         this.judSelected();
        //     },
        //     error => {
        //         this.appsCache = [];
        //         for(let i = 0;i < 1000;i++){
        //             this.appsCache.push({
        //                 oneLevelName: "分类" + i%3 + 1,
        //                 name: "媒体名称" + i % 5 + 1,
        //                 adxName: "渠道名称" + i%4 + 1,
        //                 id: i
        //             })
        //         }
        //         this.addItems("scrollApp",100,this.apps,this.appsCache,true);
        //         this.judSelected();
        //         this.myModalService.alert(error.message);
        //     }
        // )
    }
    // 滚动加载
    private addItems(name,Length,apps,caches,isRemove?){
        isRemove && apps.splice(0,apps.length);
        let appLength = apps.length;
        let cacheLength = caches.length;
        let endLength;
        if(cacheLength - appLength === 0){
            return;
        }else if(cacheLength - appLength < Length){
            endLength = cacheLength;
        }else{
            endLength = Length + appLength;
        }
        if(!isRemove){
            if(this[name].nativeElement.scrollHeight - this[name].nativeElement.scrollTop - this[name].nativeElement.offsetHeight < 10){
                for(let i = appLength;i < endLength;i++){
                    apps.push(this.publicService.clone(caches[i]))
                }
            }
        }else{
            for(let i = appLength;i < endLength;i++){
                apps.push(this.publicService.clone(caches[i]))
            }
        }
        
    }
    // private 加入已勾选
    private addApps(){
        for(let i = 0;i < this.apps.length;i++){
            if(this.apps[i].isSelected){
                if(!this.publicService.isExistByArrObj(this.apps[i].id,this.selectedAppsCache,"id")){
                    this.selectedAppsCache.push(this.publicService.clone(this.apps[i]));
                }
            }
        }
        this.addItems("scrollSelected",100,this.selectedApps,this.selectedAppsCache,true);
        this.judSelected();
    }
    // 判断左侧是否已选
    private judSelected(){
        this.selected = [];
        if(this.selectedAppsCache.length === 0){
            for(let i = 0;i < this.apps.length;i++){
                this.apps[i].isSelected = false;
                this.selected[i] = false;
            }
        }else{
            for(let i = 0;i < this.apps.length;i++){
                this.apps[i].isSelected = this.publicService.isExistByArrObj(this.apps[i].id,this.selectedAppsCache,"id") ? true : false;
                this.selected[i] = this.publicService.isExistByArrObj(this.apps[i].id,this.selectedAppsCache,"id") ? true : false;
            }
        }
    }
    // 全部加入
    private addAll(){
        for(let i = 0;i < this.appsCache.length;i++){
            if(!this.publicService.isExistByArrObj(this.appsCache[i].id,this.selectedAppsCache,"id")){
                this.selectedAppsCache.push(this.publicService.clone(this.appsCache[i]));
            }       
        }
        this.addItems("scrollSelected",100,this.selectedApps,this.selectedAppsCache,true);
        this.judSelected();
    }
    // 删除全部
    private deleteAll(){
        this.selectedAppsCache = [];
        this.selectedApps = [];
        this.judSelected();
    }
    // 删除单个
    private deleteOne(i){
        this.selectedAppsCache.splice(i,1);
        this.addItems("scrollSelected",100,this.selectedApps,this.selectedAppsCache,true);
        this.judSelected();
    }
    // 取消
    private cancel(){
        this.outer.emit(this.app);
    }
    // 确定
    private confirm(){
        
        if(!this.isInclude){
            this.outer.emit({});
        }else{
            let value = [];
            for(let i = 0;i < this.selectedAppsCache.length;i++){
                value.push(this.selectedAppsCache[i].adxId + "|" + this.selectedAppsCache[i].id);
            }
            this.outer.emit({
                isInclude: this.isInclude,
                value: value
            });
        }
        
    }
}