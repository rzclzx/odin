import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class PolicyService extends BaseService{

	constructor(
		protected http: Http
	) {
		super(http)
		this.baseUrl += this.getBaseUrl("/advertise") + "/policy";
	}

	public policyEnable(id,options){
		return this.http.put(this.baseUrl +"/enable/"+id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public policyCreativeEnable(id,options){
		return this.http.put(this.baseUrl +"/creative/enable/"+id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public policyAuto(options){
		return this.http.post(this.baseUrl +"/auto",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public policybid(id,options){
		return this.http.put(this.baseUrl +"/realBid/"+id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
}