import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class ChannelRootService extends BaseService{

	constructor(
		protected http: Http
	) {
		super(http)
		this.baseUrl += this.getBaseUrl();
	}

	public batchQueryChannel( pageNo?:number, pageSize?:number){
		if( !pageNo && !pageSize){
			return this.http.get(this.baseUrl + "/channel/adxs",this.getHeadOptions()).map(this.extractData).catch(this.handleError);	
		}else{
			return this.http.get(this.baseUrl + "/channel/adxs?pageNo=" + pageNo+"&pageSize="+pageSize,this.getHeadOptions()).map(this.extractData).catch(this.handleError);	
		}
	}

	public findAdxDetail(id:number){
		return this.http.get(this.baseUrl + "/channel/adx/" + id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public createChannel(options){
		return this.http.post(this.baseUrl +"/channel/adx",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public editChannel(id:number,options){
		return this.http.put(this.baseUrl +"/channel/adx/" + id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public queryContracts(pageNo:number, pageSize:number, code:string, name:string, status:string){
		if(status){
			return this.http.get(this.baseUrl + "/channel/contracts?pageNo=" + pageNo + "&pageSize=" + pageSize + "&code=" + code + "&name=" + name + "&status=" + status,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}else{
			return this.http.get(this.baseUrl + "/channel/contracts?pageNo=" + pageNo + "&pageSize=" + pageSize + "&code=" + code + "&name=" + name,this.getHeadOptions()).map(this.extractData).catch(this.handleError);	
		}

	}
	
	public queryContract( id:number){
		return this.http.get(this.baseUrl +"/channel/contract/" + id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);	
	}
	
	public createContract(options){
		return this.http.post(this.baseUrl +"/channel/contract",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public editContract(id:number,options){
		return this.http.put(this.baseUrl +"/channel/contract/" + id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public queryAppTypes( options?){
		let params = new URLSearchParams();
		if(options){
			for(let key in options){
				params.set(key, options[key]);
			}
		}
		return this.http.get(this.baseUrl + "/channel/appTypes" + (options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public queryAppTypeDetail( id){
		return this.http.get(this.baseUrl +"/channel/appType/" + id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);	
	}
	
	public createAppType(options){
		return this.http.post(this.baseUrl +"/channel/appType",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public editAppType(id:number,options){
		return this.http.put(this.baseUrl +"/channel/appType/" + id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	 
	 public enableChange( id:number, options){
		return this.http.put(this.baseUrl +"/channel/adx/enable/" + id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	 
	public BatchQueryNoDeviceID( options?){
		let params = new URLSearchParams();
		if(options){
			for(let key in options){
				params.set(key, options[key]);
			}
		}
		return this.http.get(this.baseUrl + "/channel/nodids" + (options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public noEquipmentFlowSwitch( appId, adxId, options){
		return this.http.put(this.baseUrl +"/channel/nodid/enable/" + appId + "/" + adxId,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	 
	 
	 
}