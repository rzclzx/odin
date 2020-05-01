import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";



@Injectable()
export class ProjectDetailService extends BaseService{

	constructor(
		protected http: Http,
		protected router: Router,
	) {
		super(http)
		this.baseUrl += this.getBaseUrl("/advertise") + "/project";
	}

}