// BY zhangfei
import { Component,OnInit,ViewChild,Input,EventEmitter,Output } from "@angular/core";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { RootService } from "../../services/root.service";
import { MyModalService } from "../../services/myModal.service";
@Component({
	selector: "device-list",
	template: `
        <div class="mymodal-content device-list">
            <div class="flex-base">
                <div class="width370 height450">
                    <div class="flex-between-center font12">
                        <div>可选白名单</div>
                    </div>
                    <div class="flex-start-center mt10 height50 line-height50 width370 textcenter bgc-blue8 border-gray3-1px border-top-blue9-1px border-bottom-blue9-2px color-bluebtn font14">
                        <div class="width-35">媒体名称</div>
                        <div class="width-30 mr10">
                            <div class="width-100">
                                <select class="form-control" [(ngModel)]="type" name="type" (change)="appList()">
                                    <option [ngValue]="undefined">全部类型</option>
                                    <option [ngValue]="1">图片</option>
                                    <option [ngValue]="2">视频</option>
                                    <option [ngValue]="3">原生</option>
                                </select>
                            </div>
                        </div>
                        <div class="width-30">
                            <div class="width-100">
                                <select class="form-control" [(ngModel)]="adxId" name="adxId" (change)="appList()">
                                    <option [ngValue]="undefined">全部渠道</option>
                                    <option cutString [cutLength]="10" *ngFor="let v of adxs;let i = index" [ngValue]="v.id">{{ v.name }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="width370 height310 border-gray3-1px border-top0 column-scroll font12 bgc-blue8">
                        <div *ngFor="let v of apps;let i = index" class="height34 line-height34 flex-start-center">
                            <div class="width40 height34 line-height34 pl10">
                                <input *ngIf="!selected[i]" type="checkbox" [(ngModel)]="v.isSelected" [attr.name]="'isSelected' + i"> 
                                <span *ngIf="selected[i]" class="icon-checked2"></span>
                            </div>                                  
                            <div class="width90 height34 textcenter" cutString [cutLength]="10">{{ v.appName }}</div>
                            <div class="width110 height34 textcenter" cutString [cutLength]="10">{{ v.type }}</div>
                            <div class="width110 height34 textcenter" cutString [cutLength]="10">{{ v.adxName }}</div>
                        </div>
                    </div>
                </div>
                <div class="width135 height450">
                    <button class="btn btn-primary btn-sm dispaly-block row-center mt120 width85" (click)="addAll()">全部加入</button>
                    <button class="btn btn-primary btn-sm dispaly-block row-center mt20 width85" (click)="deleteAll()">全部删除</button>
                    <button class="btn btn-primary btn-sm dispaly-block row-center mt20 width85" (click)="addApps()">加入已勾选</button>
                </div>
                <div class="width370 height450">
                    <div class="flex-between-center font12">
                        <div>已选白名单</div>
                    </div>
                    <div class="flex-base mt10 height50 line-height50 width370 textcenter bgc-blue8 border-gray3-1px color-bluebtn  border-top-blue9-1px border-bottom-blue9-2px font14">
                        <div class="width-35">媒体名称</div>
                        <div class="width-30">广告位分类</div>
                        <div class="width-35">全部渠道</div>
                    </div>
                    <div class="width370 height310 border-gray3-1px border-top0 column-scroll font12 bgc-blue8">
                        <div *ngFor="let v of selectedApps;let i = index" class="height34 line-height34 flex-start-center">
                            <div class="width40 height34 line-height34 pl10">
                                <span class="icon-delete2 pointer" (click)="deleteOne(i)"></span>
                            </div>                                  
                            <div class="width90 height34 textcenter" cutString [cutLength]="10">{{ v.appName }}</div>
                            <div class="width110 height34 textcenter" cutString [cutLength]="10">{{ v.type }}</div>
                            <div class="width110 height34 textcenter" cutString [cutLength]="10">{{ v.adxName }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    `
})

export class DeviceListComponent implements OnInit {

    @Output() outer: EventEmitter<any> = new EventEmitter();

    @Input() app;

    private apps = [];

    private adxs = [];

    private selectedApps = [];

    private selected = [];

    private type: number;

    private adxId: string;

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
            },
            error => {
                this.myModalService.alert(error.message);
            }
        )
        this.appList(true);
	}
    // private 加入已勾选
    private addApps(){
        for(let i = 0;i < this.apps.length;i++){
            if(this.apps[i].isSelected){
                if(!this.publicService.isExistByArrObj(this.apps[i].appId,this.selectedApps,"appId")){
                    this.selectedApps.push(this.publicService.clone(this.apps[i]));
                }
            }
        }
        this.judSelected();
        this.confirm();
    }
    // 判断左侧是否已选
    private judSelected(){
        this.selected = [];
        if(this.selectedApps.length === 0){
            for(let i = 0;i < this.apps.length;i++){
                this.apps[i].isSelected = false;
                this.selected[i] = false;
            }
        }else{
            for(let i = 0;i < this.apps.length;i++){
                this.apps[i].isSelected = this.publicService.isExistByArrObj(this.apps[i].appId,this.selectedApps,"appId") ? true : false;
                this.selected[i] = this.publicService.isExistByArrObj(this.apps[i].appId,this.selectedApps,"appId") ? true : false;
            }
        }
    }
    // 全部加入
    private addAll(){
        for(let i = 0;i < this.apps.length;i++){
            if(!this.publicService.isExistByArrObj(this.apps[i].appId,this.selectedApps,"appId")){
                this.selectedApps.push(this.publicService.clone(this.apps[i]));
            }       
        }
        this.judSelected();
        this.confirm();
    }
    // 删除全部
    private deleteAll(){
        this.selectedApps = [];
        this.judSelected();
        this.confirm();
    }
    // 删除单个
    private deleteOne(i){
        this.selectedApps.splice(i,1);
        this.judSelected();
        this.confirm();
    }
    // 列出app
    private appList(isInit){
        let options = {
			type: this.type,
            adxId: this.adxId
		}
        
		for(let i in options){
			options[i] === undefined && delete options[i]
		}
        this.rootService.nodidList(options).subscribe(
            result => {
                this.apps = result.body.items;
                if(isInit){
                    let arr = [];
                    for(let i = 0;i < this.app.length;i++){
                        arr.push(this.app[i].split("|")[1]);
                    }
                    console.log(arr)
                    for(let i = 0;i < this.apps.length;i++){
                        if(this.publicService.isExistByArr(this.apps[i].appId,arr)){
                            this.selectedApps.push(this.publicService.clone(this.apps[i]));
                        }
                    }
                    this.judSelected();
                }
            },
            error => {
                this.apps = [];
                for(let i =0;i<10;i++){
                    this.apps.push({
                        appId:i,
                        appName:"苹果",
                        adxId:i+1,
                        adxName: "呵呵",
                        type: "图片"
                    })
                }
                if(isInit){
                    let arr = [];
                    for(let i = 0;i < this.app.length;i++){
                        arr.push(this.app[i].split("|")[1]);
                    }
                    for(let i = 0;i < this.apps.length;i++){
                        if(this.publicService.isExistByArr(this.apps[i].appId,arr)){
                            this.selectedApps.push(this.publicService.clone(this.apps[i]));
                        }
                    }
                    this.judSelected();
                }
                this.myModalService.alert(error.message);
            }
        )
    }
    // 取消
    private cancel(){
        this.outer.emit(this.app);
    }
    // 确定
    private confirm(){   
        let value = [];
        for(let i = 0;i < this.selectedApps.length;i++){
            value.push(this.selectedApps[i].adxId + "|" + this.selectedApps[i].appId);
        }
        this.outer.emit(value);    
    }
}