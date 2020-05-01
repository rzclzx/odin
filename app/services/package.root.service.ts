import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class PackageRootService extends BaseService{
	option:object;
	baseUrl:string;
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
		return this.http.post(this.baseUrl +"/advertiser",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public creativeslists(options?){
		let params = new URLSearchParams();
		if(options){
			for(let key in options){
				params.set(key, options[key]);
			}
		}
		return this.http.get(this.baseUrl + "/advertise/creatives"+(options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public editAdvertiser(id: number,options){
		return this.http.put(this.baseUrl +"/advertiser/"+id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	
	public advertiserInformation(id){
		return this.http.get(this.baseUrl +"/"+ id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public creativeStatus(id,enable){
		return this.http.put(this.baseUrl + "/advertise/package/creative/enable/"+id,{enable:enable},this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public createCreative(options){
		return this.http.post(this.baseUrl +"/advertise/package/creative",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public checkstatusCreative(options){
		return this.http.put(this.baseUrl +"/advertise/package/creative/odinAudit",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public importCreatives(options){
		let params = new URLSearchParams();
		if(options){
			for(let key in options){
				params.set(key, options[key]);
			}
		}
		return this.http.get(this.baseUrl +"/advertise/images"+(options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public queryadvertise(options){
		let params = new URLSearchParams();
		if(options){
			for(let key in options){
				params.set(key, options[key]);
			}
		}
		return this.http.get(this.baseUrl +"/advertise/projects"+(options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public querycampaigns(options){
		let params = new URLSearchParams();
		if(options){
			for(let key in options){
				params.set(key, options[key]);
			}
		}
		return this.http.get(this.baseUrl +"/advertise/campaigns"+(options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public queryCreative(options){
		let params = new URLSearchParams();
		if(options){
			for(let key in options){
				params.set(key, options[key]);
			}
		}
		return this.http.get(this.baseUrl +"/advertise/creatives"+(options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
	public querySize(){
		// let params = new URLSearchParams();
		// if(options){
		// 	for(let key in options){
		// 		params.set(key, options[key]);
		// 	}
		// }
		return this.http.get(this.baseUrl +"/channel/sizes",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public creativeEdit(id,options){
		return this.http.put(this.baseUrl +"/advertise/package/creative/"+id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}


	public headtitleinit(id){
		return this.http.get(this.baseUrl +"/advertise/package/"+id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public addvideocreative(options){
		let params = new URLSearchParams();
		if(options){
			for(let key in options){
				params.set(key, options[key]);
			}
		}
		return this.http.get(this.baseUrl +"/channel/videoPoses"+(options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public importCreativesVideo(options){
		let params = new URLSearchParams();
		if(options){
			for(let key in options){
				params.set(key, options[key]);
			}
		}
		return this.http.get(this.baseUrl +"/advertise/videos"+(options ? "?"+ params.toString() : ""),this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}


	public copypolicy(option){
		return this.http.post(this.baseUrl +"/advertise/policy/copy",option,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

	public copyAudited(option){
		return this.http.post(this.baseUrl +"/advertise/campaign/copy",option,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}

}