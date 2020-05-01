import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class AdvertiserRootService extends BaseService{

	constructor(
		protected http: Http
	) {
		super(http)
		this.baseUrl += this.getBaseUrl();
	}
	
	public getImage(options){
		console.log(this.baseUrl +"/advertise/image")
		return this.http.post(this.baseUrl +"/advertise/image",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public createAdvertiser(options){
		return this.http.post(this.baseUrl +"/advertise/advertiser",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public channelInfoflowPoses(pageNo:number,pageSize:number){
		return this.http.get(this.baseUrl + "/channel/infoflowPoses?pageNo=" + pageNo+"&pageSize="+pageSize,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public editAdvertiser(id: number,options){
		return this.http.put(this.baseUrl +"/advertise/advertiser/"+id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public advertiserInformation(id: number){
		return this.http.get(this.baseUrl +"/advertise/advertiser/"+ id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public createCreative(options){
		return this.http.post(this.baseUrl +"/advertise/package/creative",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public industryQuery(){
		return this.http.get(this.baseUrl +"/advertise/industrys",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public createUsers(options){
		return this.http.post(this.baseUrl +"/user",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public advertiserAudits( advertiserId:number){
		return this.http.get(this.baseUrl +"/advertise/advertiser/Audits/"+advertiserId,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
}