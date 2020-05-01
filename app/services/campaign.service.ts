import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class CampaignService extends BaseService{

	constructor(
		protected http: Http
	) {
		super(http)
		this.baseUrl += this.getBaseUrl("/advertise") + "/campaign";	}

	public copy(options){
		return this.http.post(this.baseUrl+"/copy", options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public getStatus(id:number,obj){
		return this.http.put(this.baseUrl+"/enable/"+ id,obj,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
}