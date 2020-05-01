// BY zhangfei
import { Component,OnInit,ViewChild,Input,EventEmitter,Output } from "@angular/core";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { RootService } from "../../services/root.service";
import { MyModalService } from "../../services/myModal.service";
@Component({
	selector: "population-selected",
	template: `
        <div class="flex-base mt34 ml120">
			<div class="width320 border-gray3-1px">
				<div class="height34 line-height34 border-bottom-gray3-1px bgc-gray10 pl20">全部人群包</div>
				<div class="height200 bgc-gray9 column-scroll">
					<label *ngFor="let v of populations;let i = index" class="flex-start-center height34 line-height34 ml10">
						<input class="form-control" type="checkbox" [(ngModel)]="selected[i]" [attr.name]="'selected' + i">
						<div cutString [cutLength]="25" class="font14">{{ v.name }}</div>
					</label>
				</div>
			</div>
			<div class="width135 height234">
				<button class="btn btn-primary btn-sm dispaly-block row-center mt50 width85" (click)="addAll()">全部加入</button>
				<button class="btn btn-primary btn-sm dispaly-block row-center mt20 width85" (click)="addPopulations()">加入已勾选</button>
				<button class="btn btn-cancel btn-sm dispaly-block row-center mt20 width85" (click)="deleteAll()">全部清除</button>               
			</div>
			<div class="width320 border-gray3-1px">
				<div class="height34 line-height34 border-bottom-gray3-1px bgc-gray10 pl20">已选人群包</div>
				<div class="height200 bgc-gray9 column-scroll">
					<label *ngFor="let v of selectedPopulations;let i = index" class="flex-start-center height34 line-height34 ml10">
						<span class="icon-delete2 pointer" (click)="deletePopulation(i)"></span>
						<div cutString [cutLength]="25" class="font14 ml10">{{ v.name }}</div>
					</label>
				</div>
			</div>
		</div>
        
    `
})

export class PopulationSelectedComponent implements OnInit {

    @Output() outer: EventEmitter<any> = new EventEmitter();

    private populations = [];

	private selected = [];

	private selectedPopulations = [];

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
		this.rootService.populationList().subscribe(
			result => {
				this.populations = result.body.items;
			},
			error => {
				//this.myModalService.alert(error.message);
				this.populations = [
					{
						id: "1111",
						name: "广汽呵呵哒111111111111"
					},
					{
						id: "1111",
						name: "广汽呵呵哒111111111111"
					},
					{
						id: "1111",
						name: "广汽呵呵哒111111111111"
					},
					{
						id: "1111",
						name: "广汽呵呵哒111111111111"
					},
					{
						id: "1111",
						name: "广汽呵呵哒111111111111"
					},
					{
						id: "1111",
						name: "广汽呵呵哒111111111111"
					},
					{
						id: "1111",
						name: "广汽呵呵哒111111111111"
					},
					{
						id: "1111",
						name: "广汽呵呵哒111111111111"
					},
					{
						id: "1111",
						name: "广汽呵呵哒111111111111"
					}
				]
			}
		)
	}
	// 加入已勾选
	private addPopulations(){
		this.selectedPopulations = [];
		for(let i = 0;i < this.selected.length;i++){
			if(this.selected[i]){
				this.selectedPopulations.push(this.publicService.clone(this.populations[i]));
			}
		}
		this.selected = [];
	}
	// 全选
	private addAll(){
		this.selectedPopulations = [];
		this.selectedPopulations = this.publicService.clone(this.populations);
		this.selected = [];
	}
	// 删除全部
	private deleteAll(){
		this.selectedPopulations = [];
	}
	// 删除单个
	private deletePopulation(i){
		this.selectedPopulations.splice(i,1);
	}
}