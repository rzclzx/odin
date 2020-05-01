import { Component,OnInit,ViewChild } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { PackageService } from "../../services/package.service";
import { MyModalService } from "../../services/myModal.service";
declare var $;
declare var require;
let path = require("./packageAudit.html");

@Component({
	selector: "package-audit",
	template: path
})

export class PackageAuditComponent implements OnInit {

    @ViewChild("modalBanner") modalBanner;

    private id: string;

    private number1 = require("../../images/1.png");

    private number2 = require("../../images/2.png");

    private number3 = require("../../images/3.png");

    private yr = require("../../images/yr.png");

    private gr = require("../../images/gr.png");

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

	private packages = [];

	private page = {
		pageNo: 0,
		pageSize: 10,
		total: 0
	};

	private startDate: number = new Date().getTime();

	private endDate: number = new Date().getTime();

    private toggleArr = [];

    private isShowBanner: boolean = false;

    private creativeObj;


	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
        private packageService: PackageService,
        private myModalService: MyModalService,
        private router: Router,
        private route: ActivatedRoute
	) {}

	ngOnInit() {
        this.id = this.route.snapshot.params["id"]; 
        this.refresh({campaignId: this.id});
	}
    // 刷新列表
    private refresh(obj?){
        let options = {
			pageNo: this.page.pageNo + 1,
			pageSize: this.page.pageSize
		}
		if(obj){
			for(let i in obj){
				options[i] = obj[i];
			}
		}
		this.packageService.list(options).subscribe(
			result => {
                let rows = [];
                for (let i = 0,len = result.body.items.length; i < len; i++) {
                    rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
                }
                this.packages = rows;
                if(result.body.pager){
                    this.page = result.body.pager;
                    this.page.pageNo--;
                    if(!this.packages[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
                        this.page.pageNo--;
                    }
                }
				this.toggleInit();
			},
			error => {
                //this.myModalService.alert(error.message);
            }
        );
    }
    // 编辑按钮初始化
    private toggleInit(){
        this.toggleArr = [];
        for(let i = 0;i < this.packages.length;i++){
            this.toggleArr[i] = [false,false,false,false];
        }
    }
    // 编辑切换
    private toggle(i,j,id){
        if(id){
            let obj = this.publicService.clone(this.packages[i]);
            obj[id.split("-")[1]] = $("#" + id).val();
            this.packageService.update(this.packages[i].id,obj).subscribe(
                result => {
                    this.packages[i][id.split("-")[1]] = this.publicService.clone(obj[id.split("-")[1]]);
                    this.toggleArr[i][j] = !this.toggleArr[i][j];
                },
                error => {
                    //this.myModalService.alert(error.messaage);
                }
            )
        }else{
            this.toggleArr[i][j] = !this.toggleArr[i][j];
        }
        
    }
    // 显示轮播
    private showBanner(creatives,type){
        if(creatives.length === 0){
            this.myModalService.alert(this.chineseService.config.NO_CREATIVE);
            return;
        }
        this.isShowBanner = true;
        this.creativeObj = {
            type: type,
            creatives: creatives
        }
        this.modalBanner.open();
    }
    // 关闭轮播
    private closeBanner(){
        this.modalBanner.close();
        this.isShowBanner = false;
    }
    // 上一步
    private prevent(){
        this.router.navigate(["/home/campaign/audit/detailAudit/" + this.id]);
    }
    // 取消
	private cancel(){
        window.history.back(); 
    }
    // 通过下一步
    private save(){
        this.router.navigate(["/home/campaign/audit/adxAudit/" + this.id]);
    }
}