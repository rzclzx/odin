// BY zhangfei
import { Component,OnInit,ViewChild,Input,EventEmitter,Output } from "@angular/core";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { Router,ActivatedRoute } from "@angular/router";
import { RootService } from "../../services/root.service";
import { MyModalService } from "../../services/myModal.service";
@Component({
	selector: "ng-creative-app",
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
                            <select class="form-control" [(ngModel)]="adxType">
                                <option [ngValue]="undefined">广告位类型</option>
                                <option [ngValue]="'1'">图片</option>
                                <option [ngValue]="'2'">视频</option>
                                <option [ngValue]="'3'">原生</option>
                            </select>
                        </div>
                        <button class="btn btn-primary btn-sm height30 ml40 width65" (click)="search()">查询</button>
                    </div>
                    <div class="flex-base mt10 height50 line-height50 width370 textcenter">
                        <div class="border-text-1px border-right0 width-50">媒体名称</div>
                        <div class="border-text-1px width-50">广告位类型</div>                       
                    </div>
                    <div #scrollApp class="width370 height310 border-text-1px border-top0 column-scroll font12" (scroll)="addItems('scrollApp',100,apps,appsCache)">
                        <ng-container *ngFor="let v of apps;let i = index">
	                        <div *ngIf=" adxType == v.adxType ||  adxType == undefined " class="height34 line-height34 flex-start-center">
	                            <div class="width40 height34 line-height34 pl10">
	                                <input *ngIf="!selected[i]" type="checkbox" [(ngModel)]="v.isSelected" [attr.name]="'isSelected' + i"> 
	                                <span *ngIf="selected[i]" class="icon-checked2"></span>
	                            </div>                                  
	                            <div class="width140 height34 textcenter" cutString [cutLength]="10">{{ v.name }}</div>
	                            <div class="width160 height34 textcenter" cutString [cutLength]="10" *ngIf=" v.adxType == '1' ">图片</div> 
		                        <div class="width160 height34 textcenter" cutString [cutLength]="10" *ngIf=" v.adxType == '2' ">视频</div>   
		                        <div class="width160 height34 textcenter" cutString [cutLength]="10" *ngIf=" v.adxType == '3' ">信息流</div> 
	                        </div> 
	                    </ng-container>
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
                        <div class="border-text-1px border-right0 width-50">媒体名称</div>
                        <div class="border-text-1px width-50">广告位类型</div>
                        
                    </div>
                    <div #scrollSelected class="width370 height518 border-text-1px border-top0 column-scroll font12" (scroll)="addItems('scrollSelected',100,selectedApps,selectedAppsCache)">
                        <div *ngFor="let v of selectedApps;let i = index" class="height34 line-height34 flex-start-center">
                            <div class="width40 height34 line-height34 pl10">
                                <span class="icon-delete2 pointer" (click)="deleteOne(i)"></span>
                            </div>                                  
	                        <div class="width140 height34 textcenter" cutString [cutLength]="10">{{ v.name }}</div>
                            <div class="width160 height34 textcenter" cutString [cutLength]="10" *ngIf=" v.adxType == '1' ">图片</div> 
	                        <div class="width160 height34 textcenter" cutString [cutLength]="10" *ngIf=" v.adxType == '2' ">视频</div>   
	                        <div class="width160 height34 textcenter" cutString [cutLength]="10" *ngIf=" v.adxType == '3' ">信息流</div>         
	                        
                        </div>
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

export class CreativeAppComponent implements OnInit {

    @Output() outer: EventEmitter<any> = new EventEmitter();

    @Input() app;

    @ViewChild("scrollApp") scrollApp;

    @ViewChild("scrollSelected") scrollSelected;

    private name: string = "";

    private searchType: string = "0";

    private adxType: any = undefined;

    private adxs = [];

    private apps = [];

    private selectedApps = [];

    private selected = [];

    private isInclude: string = "1";

    private isInit = false;

    private appsCache = [];

    private selectedAppsCache = [];
	
	private adxId: number;

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private route: ActivatedRoute,
        private rootService: RootService,
        private myModalService: MyModalService
	) {
		this.adxId = this.route.snapshot.params["adxId"] - 0;
		console.log(this.adxId)
	}

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
        this.rootService.appList({ids:this.app.value}).subscribe(
            result => {
                this.selectedAppsCache = result.body.items
                console.log(this.selectedAppsCache)
//              this.addItems("scrollSelected",100,this.selectedApps,this.selectedAppsCache,true);
                true && this.selectedApps.splice( 0, this.selectedApps.length);
		        let appLength = this.selectedApps.length;
		        let cacheLength = this.selectedAppsCache.length;
		        let endLength;
		        if(cacheLength - appLength === 0){
		            return;
		        }else if(cacheLength - appLength < 100){
		            endLength = cacheLength;
		        }else{
		            endLength = 100 + appLength;
		        }
		        for(let i = appLength;i < endLength; i++){
		            this.selectedApps.push(this.publicService.clone(this.selectedAppsCache[i]))
			    }
		        this.judSelected()
            },
            error => {
                this.myModalService.alert(error.message);
            }
        )
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
        this.rootService.appList(options).subscribe(
            result => {
                this.appsCache = result.body.items;
                this.addItems("scrollApp",100,this.apps,this.appsCache,true);
                this.judSelected();
            },
            error => {
                this.myModalService.alert(error.message);
            }
        )
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
                    for(let v = 1; v < 4; v++){
                    	apps.push(this.publicService.clone(caches[i]))
                    	apps[ apps.length-1].adxType = v + ""
                    }
                }
            }
        }else{
            for(let i = appLength;i < endLength; i++){
                for(let v = 1; v < 4; v++){
                    apps.push(this.publicService.clone(caches[i]))
                   	apps[ apps.length-1].adxType = v + ""
                }
            }
        }
        
    }
    /*添加已选标记*/
    private (){
        for(let i = 0;i < this.apps.length;i++){
            this.apps[i].isSelected = false;
        }
    }
	// private 加入已勾选
    private addApps(){
        for(let i = 0;i < this.apps.length;i++){
            if(this.apps[i].isSelected){
                if(!this.publicService.isExistByArrObj2(this.apps[i].id,this.selectedAppsCache,"id",this.apps[i].adxType,"adxType")){
                    this.selectedAppsCache.push(this.publicService.clone(this.apps[i]));
                }
            }
        }
///     this.addItems("scrollSelected",100,this.selectedApps,this.selectedAppsCache,true);
        true && this.selectedApps.splice( 0, this.selectedApps.length);
        let appLength = this.selectedApps.length;
        let cacheLength = this.selectedAppsCache.length;
        let endLength;
        if(cacheLength - appLength === 0){
            return;
        }else if(cacheLength - appLength < 100){
            endLength = cacheLength;
        }else{
            endLength = 100 + appLength;
        }
        for(let i = appLength;i < endLength; i++){
            this.selectedApps.push(this.publicService.clone(this.selectedAppsCache[i]))
	    }
        this.judSelected()
	        
    }
    private judSelected(){
    	/*判断左侧是否已选*/
        this.selected = [];
        if(this.selectedAppsCache.length === 0){
            for(let i = 0;i < this.apps.length;i++){
                this.apps[i].isSelected = false;
                this.selected[i] = false;
            }
        }else{
        	for(let i = 0;i < this.apps.length;i++){
	            this.apps[i].isSelected = this.publicService.isExistByArrObj2(this.apps[i].id,this.selectedAppsCache,"id",this.apps[i].adxType,"adxType") ? true : false;
	            this.selected[i] = this.publicService.isExistByArrObj2(this.apps[i].id,this.selectedAppsCache,"id",this.apps[i].adxType,"adxType") ? true : false;
	        }
        }
    }
	/*全部加入*/
    private addAll(){
    	let appsCache = this.appsCache;
    	this.appsCache = [];
    	for(let i in appsCache){
    		for(let v = 1; v < 4; v++){
                this.appsCache.push(this.publicService.clone(appsCache[i]))
                this.appsCache[ this.appsCache.length-1].adxType = v + ""
            }
    	}
    	
        for(let i = 0;i < this.appsCache.length;i++){
            if(!this.publicService.isExistByArrObj2(this.appsCache[i].id,this.selectedAppsCache,"id",this.appsCache[i].adxType,"adxType")){
                this.selectedAppsCache.push(this.publicService.clone(this.appsCache[i]));
            }       
        }
        true && this.selectedApps.splice( 0, this.selectedApps.length);
        let appLength = this.selectedApps.length;
        let cacheLength = this.selectedAppsCache.length;
        let endLength;
        if(cacheLength - appLength === 0){
            return;
        }else if(cacheLength - appLength < 100){
            endLength = cacheLength;
        }else{
            endLength = 100 + appLength;
        }
        for(let i = appLength;i < endLength; i++){
            this.selectedApps.push(this.publicService.clone(this.selectedAppsCache[i]))
	    }
        this.judSelected();
    }
	/*删除全部*/
    private deleteAll(){
        this.selectedAppsCache = [];
        this.selectedApps = [];
        this.judSelected();
    }
	/*删除单个*/
    private deleteOne(i){
        this.selectedAppsCache.splice(i,1);
        true && this.selectedApps.splice( 0, this.selectedApps.length);
        let appLength = this.selectedApps.length;
        let cacheLength = this.selectedAppsCache.length;
        let endLength;
        if(cacheLength - appLength === 0){
            return;
        }else if(cacheLength - appLength < 100){
            endLength = cacheLength;
        }else{
            endLength = 100 + appLength;
        }
        for(let i = appLength;i < endLength; i++){
            this.selectedApps.push(this.publicService.clone(this.selectedAppsCache[i]))
	    }
        this.judSelected();
    }
	/*取消*/
    private cancel(){
        this.outer.emit(this.app);
    }
    // 确定
    private confirm(){
        console.log(this.selectedAppsCache)
        
        let options = {
        	items:[]
        };
        for(let i in this.selectedAppsCache){
        	options.items.push({
        		adxId : this.adxId,
        		enable : "1",
        		id : this.selectedAppsCache[i].id,
        		name : this.selectedAppsCache[i].name,
        		type : this.selectedAppsCache[i].adxType,
        	})
        }            
        this.rootService.batchAddNoDeviceID( options).subscribe(
            result => {
				if( result.head.httpCode == 200){
					this.outer.emit()
				}
            },
            error => {
                this.myModalService.alert(error.message);
            }
        )
        
        
        
//      if(!this.isInclude){
//          this.outer.emit({});
//      }else{
//          let value = [];
//          for(let i = 0;i < this.selectedAppsCache.length;i++){
//              value.push(this.selectedAppsCache[i].adxId + "|" + this.selectedAppsCache[i].id);
//          }
//          this.outer.emit({
//              isInclude: this.isInclude,
//              value: value
//          });
//      }   
    }
}