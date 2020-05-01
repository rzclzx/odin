import { Component,OnInit,ViewChildren,QueryList } from "@angular/core";
import { Router,ActivatedRoute,Params } from "@angular/router";
import { ChineseService } from "./services/chinese.service";
declare var require;
declare var $;
let path = require("./main.html");
@Component({
	selector: "ng-main",
	template: path
})

export class MainComponent implements OnInit {

    private menus: Array<any> = [];

	private leftMenus: Array<any> = [];

	private currentParent: Array<any> = [0];

	private currentChilds: Array<any> = [0,0];

	constructor(
        private chineseService: ChineseService
	) {}

    ngOnInit() {
        this.leftMenus = this.chineseService.config.MENU_ARRAY;
		this.currentInit();
    }
	// 面包屑
    private onActivate(e){
		if(e.mainMenusSubject){
			e.mainMenusSubject.subscribe({
				next: (data) => {
					this.menus = data;
				}
			})
		}else if(e.mainMenus){
			this.menus = e.mainMenus;
		}else{
			this.menus = [];
		}	
		this.currentInit();
	}
	// menu跳转
	private changeCurrent(type,i,j){
        
        if(type === "main"){
            if(this.currentParent[0] === i){
                this.currentParent[0] = undefined
            }else{
				this.currentParent[0] = i;
			}
        }else{
            this.currentChilds[0] = i;
			this.currentChilds[1] = j;
        }
        
    }
	public currentInit(){
        // menu焦点初始化
        let path = location.hash.split("#")[1].split("/")[2];
        for(let i = 0;i < this.leftMenus.length;i++){
            for(let j = 0;j < this.leftMenus[i].childs.length;j++){
                if(path === this.leftMenus[i].childs[j].nav.split("/")[2]){
                    this.currentParent[0] = i;
					this.currentChilds[0] = i;
                    this.currentChilds[1] = j;
                }
            }
        }
    }


}
