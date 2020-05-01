import { PublicService } from "../services/public.service"

export class TargetModal{

    public network: Array<any> = [
                    {
                        name: "wifi",
                        value: false,
                        id: "1"
                    },
                    {
                        name: "2G",
                        value: false,
                        id: "3"
                    },
                    {
                        name: "3G",
                        value: false,
                        id: "4"
                    },
                    {
                        name: "4G",
                        value: false,
                        id: "5"
                    }
                ];

    public carrier: Array<any> = [
                {
                    name: "中国移动",
                    value: false,
                    id: "1"
                },
                {
                    name: "中国联通",
                    value: false,
                    id: "2"
                },
                {
                    name: "中国电信",
                    value: false,
                    id: "3"
                }
            ];

    public device: Array<any> = [
                {
                    name: "手机",
                    value: false,
                    id: "1"
                },
                {
                    name: "平板",
                    value: false,
                    id: "2"
                }
            ];

    public os: Array<any> = [
                {
                    name: "android",
                    value: false,
                    id: "2"
                },
                {
                    name: "ios",
                    value: false,
                    id: "1"
                }
            ];

    constructor(network?,carrier?,device?,os?){
        if(network && network.length !== 0){
            for(let i = 0;i < this.network.length;i++){
                if(this.isExistByArr(this.network[i].id,network)){
                    this.network[i].value = true;
                }
            }
        }
        if(carrier && carrier.length !== 0){
            for(let i = 0;i < this.carrier.length;i++){
                if(this.isExistByArr(this.carrier[i].id,carrier)){
                    this.carrier[i].value = true;
                }
            }
        }
        if(device && device.length !== 0){
            for(let i = 0;i < this.device.length;i++){
                if(this.isExistByArr(this.device[i].id,device)){
                    this.device[i].value = true;
                }
            }
        }
        if(os && os.length !== 0){
            for(let i = 0;i < this.os.length;i++){
                if(this.isExistByArr(this.os[i].id,os)){
                    this.os[i].value = true;
                }
            }
        }
        
    }
    private isExistByArr(id,arr){
		if(!arr){
			return false;
		}
		for(let i = 0;i < arr.length;i++){
			if(arr[i] == id){
				return true
			}
		}
		return false;
	}
}