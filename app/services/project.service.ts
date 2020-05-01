import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class ProjectService extends BaseService{

	constructor(
		protected http: Http
	) {
		super(http)
		this.baseUrl += this.getBaseUrl("/advertise") + "/project";	}

	public getId(id: number){
		return this.http.get(this.baseUrl +"/"+ id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
}