import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class RootService extends BaseService{

	constructor(
		protected http: Http
	) {
		super(http)
		this.baseUrl += this.getBaseUrl();
	}

	public regionList(){
		return this.http.get(this.baseUrl +"/basic/regions",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public populationList(){
		return this.http.get(this.baseUrl +"/advertise/populations",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public appList(options){
		return this.http.post(this.baseUrl +"/channel/apps",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public brandList(){
		return this.http.get(this.baseUrl +"/basic/brands",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public adxList(){
		return this.http.get(this.baseUrl +"/channel/adxs",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public appTypeList(){
		return this.http.get(this.baseUrl +"/channel/appTypes",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public contractList(){
		return this.http.get(this.baseUrl +"/channel/contracts",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public getPolicy(id){
		return this.http.get(this.baseUrl +"/advertise/policy/" + id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public createPolicy(options){
		return this.http.post(this.baseUrl +"/advertise/policy" ,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public updatePolicy(id,options){
		return this.http.put(this.baseUrl +"/advertise/policy/" + id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public auditCampaign(id,options){
		return this.http.put(this.baseUrl +"/advertise/campaign/odinAudit/" + id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public updatePackage(id,options){
		return this.http.put(this.baseUrl +"/advertise/package/" + id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public batchAddNoDeviceID(options){
		return this.http.post(this.baseUrl +"/channel/nodid" ,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public nodidList(options?){
		let params = new URLSearchParams();
		if(options){
            for(let key in options){
                params.set(key, options[key]);
            }			
        }
		return this.http.get(this.baseUrl +"/nodids"+ (options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
}