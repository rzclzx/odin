import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BaseService } from "./base.service";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class CreativeSizeManagementService extends BaseService{

	constructor(
		protected http: Http
	) {
		super(http)
		this.baseUrl += this.getBaseUrl() ;	
	}
		//图片尺寸
		public sizeList(pageNo:number,pageSize:number){
			return this.http.get(this.baseUrl+"/channel/sizes?pageNo=" + pageNo+"&pageSize="+pageSize,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		//查询尺寸不传参
		public sizelist(){
			return this.http.get(this.baseUrl+"/channel/sizes",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		
		public addSize(options){
			return this.http.post(this.baseUrl+"/channel/sizes",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		//图片广告位
		public imageList(pageNo:number,pageSize:number){
			return this.http.get(this.baseUrl+"/channel/imagePoses?pageNo=" + pageNo+"&pageSize="+pageSize,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}

		public addimagePoses(options){
			return this.http.post(this.baseUrl+"/channel/imagePoses",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}

		public adxs(){
			return this.http.get(this.baseUrl+"/channel/adxs",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		//开启
		public imageEnable(options){
			return this.http.put(this.baseUrl +"/channel/imagePoses/status/enable",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		//关闭
		public imagedisable(options){
			return this.http.put(this.baseUrl +"/channel/imagePoses/status/disable",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		//视频广告位
		public videoList(pageNo:number,pageSize:number){
			return this.http.get(this.baseUrl+"/channel/videoPoses?pageNo=" + pageNo+"&pageSize="+pageSize,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}

		public addvideoPoses(options){
			return this.http.post(this.baseUrl+"/channel/videoPoses",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		public getvideoId(id){
			return this.http.get(this.baseUrl+"/channel/videoPos/"+id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		//开启
		public videoEnable(options){
			return this.http.put(this.baseUrl +"/channel/videoPoses/status/enable",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		//关闭
		public videodisable(options){
			return this.http.put(this.baseUrl +"/channel/videoPoses/status/disable",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		//原生广告位
		public inflowList(pageNo:number,pageSize:number){
			return this.http.get(this.baseUrl+"/channel/infoflowPoses?pageNo=" + pageNo+"&pageSize="+pageSize,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		public inflowList1(){
			return this.http.get(this.baseUrl+"/channel/infoflowPoses",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		public addinflowPoses(options){
			return this.http.post(this.baseUrl+"/channel/infoflowPoses",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		public getinflowId(id){
			return this.http.get(this.baseUrl+"/channel/infoflowPoses/"+id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		public editinflowId(id,options){
			return this.http.put(this.baseUrl+"/channel/infoflowPoses/"+id,options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		//开启
		public flowEnable(options){
			return this.http.put(this.baseUrl +"/channel/infoflowPoses/status/enable",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		//关闭
		public flowdisable(options){
			return this.http.put(this.baseUrl +"/channel/infoflowPoses/status/disable",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		//原生广告位模板
		public infoflowTmpls(){
			return this.http.get(this.baseUrl+"/channel/infoflowTmpls",this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		public inflowTmplsList(pageNo:number,pageSize:number){
			return this.http.get(this.baseUrl+"/channel/infoflowTmpls?pageNo=" + pageNo+"&pageSize="+pageSize,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
		public addinflowTmpls(options){
			return this.http.post(this.baseUrl+"/channel/infoflowTmpls",options,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
		}
	//程序化渠道详情
	public adxId(id){
		return this.http.get(this.baseUrl+"/channel/adx/"+id,this.getHeadOptions()).map(this.extractData).catch(this.handleError);
	}
}