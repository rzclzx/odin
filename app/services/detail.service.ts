import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class DetailService extends BaseService{

	constructor(
		protected http: Http
	) {
		super(http)
		this.baseUrl += this.getBaseUrl();
	}

	public brandsName(){
		return this.http.get(this.baseUrl +"/basic/brands",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public appTypesName(){
		return this.http.get(this.baseUrl +"/channel/appTypes",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
}