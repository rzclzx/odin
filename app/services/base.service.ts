import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams,RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "../resources/request.js";
declare var profiles;

@Injectable()
export class BaseService {

	public baseUrl: string = "";

	public tokenType: string;

	public token: string;

	public headers: Headers;

	public tokens: string;

	public requestOptions: Object;

	constructor(
		protected http: Http
	) {}

	public getBaseUrl(config?){
		let url =  eval(profiles + ".urlHref");
		return url + (config ? config : "");
	}

	public getHeadOptions(){
		// this.tokenType = window.localStorage.getItem("tokenType");
		// this.token = window.localStorage.getItem("token");
		// this.tokens = this.tokenType + " " + this.token;
		this.headers = new Headers({"Content-Type":"application/json"});
		this.requestOptions = new RequestOptions({ headers: this.headers });
		return profiles === "rap" ? undefined : this.requestOptions;
	}

	public create(options){
		return this.http.post(this.baseUrl, options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	
	public createAdvertiser(options){
		return this.http.post(this.baseUrl +"/advertiser",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public channelInfoflowPoses(pageNo:number,pageSize:number){
		return this.http.get(this.baseUrl + "/channel/infoflowPoses?pageNo=" + pageNo+"&pageSize="+pageSize,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public editAdvertiser(id: number,options){
		return this.http.put(this.baseUrl +"/advertiser/"+id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	
	public list(options?){
		let params = new URLSearchParams();
		if(options){
            for(let key in options){
                params.set(key, options[key]);
            }			
        }
		return this.http.get(this.baseUrl +"s"+ (options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public delete(ids){
		return this.http.delete(this.baseUrl +"s"+ "?ids=" + ids,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public get(id: string){
		return this.http.get(this.baseUrl +"/"+ id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public getId(id: number){
		return this.http.get(this.baseUrl +"/"+ id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public industries(){
		return this.http.get(this.baseUrl +"/industries",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public update(id: string, options){
		return this.http.put(this.baseUrl + "/" + id, options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public update1(id: number, options){
		return this.http.put(this.baseUrl + "/" + id, options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public status(id: string, statusObj){
		return this.http.put(this.baseUrl + "/enable/" + id, statusObj,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}


	public extractData(res) {
		if(!res){
			return {}
		}
		let body = {
			head: { httpCode: res.status },
			body: res._body ? res.json() : undefined
		};
		return body;
	}

	public handleError(error) {
		if(!error){
			Observable.throw({});
		}

		if(error.status == 401){
			console.clear();
			window.location.href = "#/login";
		}

		let errMsg: string;
		let body = error._body ? error.json() : undefined;
		let err = body.error || JSON.stringify(body);
		errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
		if(error.status != 401){
			console.error(errMsg);
		}	
		let message;
		if(error._body){
			if(error.json().data){
				if(Object.prototype.toString.call(error.json().data) == '[object Array]'){
					if(error.json().data[0] && error.json().data[0].defaultMessage){
						message = error.json().data[0].defaultMessage;
					}
				}
			}else{
				message = error.json().message;
			}
		}else{
			message = undefined;
		}
		
		let errObj = {
			status: error.status,
			code: error._body ? error.json().code : undefined,
			message: message
		}
		return Observable.throw(errObj);
	}
}