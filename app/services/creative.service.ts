import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class CreativeService extends BaseService{

	constructor(
		protected http: Http
	) {
		super(http)
		this.baseUrl += this.getBaseUrl("/advertise") + "/creative";	}

		public inputCreative(options){
			return this.http.put(this.baseUrl +"s",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		public putCreative(id,options){
			return this.http.put(this.getBaseUrl("/advertise/policy/creative")+"/"+id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		public putbid(id,options){
			return this.http.put(this.getBaseUrl("/advertise/policy/bid")+"/"+id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		public putPackage(id,options){
			return this.http.put(this.getBaseUrl("/advertise/policy/package")+"/"+id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
}