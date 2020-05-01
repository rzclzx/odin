import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class PackageService extends BaseService{

	constructor(
		protected http: Http
	) {
		super(http)
		this.baseUrl += this.getBaseUrl("/advertise") + "/package";	}

	public getId(id: number){
		return this.http.get(this.baseUrl +"/"+ id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public create1(options){
		return this.http.post(this.baseUrl+"/creative", options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public create2(campaignId:number,options){
		return this.http.post(this.baseUrl,{campaignId,options},this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public getId1(options){
		return this.http.get(this.baseUrl+"s",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
}