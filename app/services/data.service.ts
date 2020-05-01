import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class DataService extends BaseService{

	constructor(
		protected http: Http
	) {
		super(http)
		this.baseUrl += this.getBaseUrl();
    }   
    public brandList(options?){
		let params = new URLSearchParams();
		if(options){
            for(let key in options){
                params.set(key, options[key]);
            }			
        }
		return this.http.get(this.baseUrl +"/advertise/advertisers"+ (options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
    }
    public dataProject(){
		return this.http.get(this.baseUrl +"/advertise/projects",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
    }
    public dataCampaigns(){
		return this.http.get(this.baseUrl +"/advertise/campaigns",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
    }

    public dataList(options?){
        let params = new URLSearchParams();
        if(options){
            for(let key in options){
                params.set(key, options[key]);
            }			
        }
		    return this.http.get(this.baseUrl +"/data/list" + (options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
    }
    

}