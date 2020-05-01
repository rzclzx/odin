import { Directive, ElementRef, Renderer,Input,AfterViewInit } from "@angular/core";

declare var $;

@Directive({
	selector: "[cutString]"
})

export class CutStringDirective implements AfterViewInit{

    @Input() cutLength: number;

    constructor(
        private el: ElementRef,
        private renderer: Renderer 
    ) {}

    ngAfterViewInit(){
        this.init();
    }

    //元素更新初始化
    private init(): void{
        if(this.el.nativeElement.nodeName !== "INPUT"){
            let str = this.cut(this.el.nativeElement.innerText,this.cutLength);
            this.el.nativeElement.title = this.el.nativeElement.innerText;
            this.el.nativeElement.innerText = str;         
        }else{
            let str = this.cut(this.el.nativeElement.value,this.cutLength);
            this.el.nativeElement.title = this.el.nativeElement.value;
            this.el.nativeElement.value = str;
        }
    }

    //截取函数
    private cut(str: any,len: number): string{
        let st = str.toString();
        let maxlength = 0;
        let newStr = "";
        for(let i=0;i<st.length;i++){
            if(/[^\u0000-\u00FF]/.test(st[i])){
                maxlength = maxlength + 2;             
            }else{
                maxlength ++;
            }
            newStr += st[i];
            if(maxlength >= len){
                if(st.length-1 !== i){
                    newStr += "...";
                }         
                break;
            }
            
        }
        return newStr;      
    }
}