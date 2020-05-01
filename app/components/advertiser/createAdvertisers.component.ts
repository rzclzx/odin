import { Component,OnInit,ViewChild,TemplateRef } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { Advertiser } from "../../models/advertiser.model";
import { AdvertiserRootService } from "../../services/advertiser.root.service";
import { MyModalService } from "../../services/myModal.service";
import { ChineseService } from "../../services/chinese.service";
import { PublicService } from "../../services/public.service";
import { ValidationService } from "../../services/validation.service";
import { BaseService } from "../../services/base.service";
import "./createAdvertisers.less";
import { FileUploader } from "ng2-file-upload";

declare var $;
declare var require;
declare var profiles;

var path = require("./createAdvertisers.html"); 

@Component({
	selector: "create-advertisers",
	template: path
})

export class CreateAdvertisersComponent implements OnInit {
	public mainMenus = [
        {
            name: "客户管理",
            value: undefined
        },
        {
            name: "广告主管理",
            value: "/home/advertiser/advertiserList"
		},
		{
            name: this.route.snapshot.params["id"] ? "编辑广告主" : "创建广告主",
            value: undefined
		}
    ];
    private advertiser: Advertiser = new Advertiser();   
    private pointTo = null;  
    private indexType=false;   
    private baseUrl: string;
	private baseImgUrl: string;
	private logoLoader :any;
	private accountLicenceLoader :any;
	private organizationCodeLoader :any;
	private businessLicenceLoader :any;
	private icpLoader :any;
	private qualificationShow:boolean;
	private industry;
	private editBoolean = false;
	private	logoPath: string;
	private	accountLicencePath: string;
	private organizationCodePath: string;
	private businessLicencePath: string;
	private icpPath: string;
	private	logoPathAlt: string;
	private	accountLicencePathAlt: string;
	private organizationCodePathAlt: string;
	private businessLicencePathAlt: string;
	private icpPathAlt: string;	
	private	id: number;
	private licenceDeadline: string;
	private	companyName: string;
	private	name: string;
	private address: string;
	private brand: string;
	private	contactNum: string;
	private	contacts: string;
	private email: string;
	private	industryId: number = 0;
	private isProtected: string;
	private licenceNo: string;
	private	organizationCode: string;
	private	qq: string;
	private	qualifications:{
				industryId:"",
				path:"",
				type:''
			};
	private	saleman: string;
	private	telephone: string;
	private websiteName: string;
	private websiteUrl: string;
	private	zip: string;



	//特殊资质
	private securitiesBusinessQualificationPermitPath: string;
	private futuresBusinessLicensePath: string;
	private fundManagementQualificationCertificatePath: string;
	private financialInstitutionLicensePath: string;
	private bankApprovalPath: string;
	private actingInsuranceLicensePath: string;
	private fundManagementQualificationCertificatePath_2: string;
	private operatingAStockUnderwritingBusinessLicensePath: string;
	private sanitaryPermitPath: string;
	private productionLicensePath: string;
	private administrativeApprovalDocumentsPath: string;
	private sanitaryPermitPath_2: string;
	private productionLicensePath_2: string;
	private foodDistributionLicensePath: string;
	private healthAndQuarantineCertificatePath: string;
	private entryAndExitInspectionAndQuarantineCertificatePath: string;
	private sanitaryPermitPath_3: string;
	private businessLicensePath: string;
	private theDrugApprovalDocumentsPath: string;
	private drugAdvertisingReviewFormPath: string;
	private drugInformationServiceLicensePath: string;
	
	
	private securitiesBusinessQualificationPermitLoader: any;
	private futuresBusinessLicenseLoader: any;
	private fundManagementQualificationCertificateLoader: any;
	private financialInstitutionLicenseLoader: any;
	private bankApprovalLoader: any;
	private actingInsuranceLicenseLoader: any;
	private fundManagementQualificationCertificateLoader_2: any;
	private operatingAStockUnderwritingBusinessLicenseLoader: any;
	private sanitaryPermitLoader: any;
	private productionLicenseLoader: any;
	private administrativeApprovalDocumentsLoader: any;
	private sanitaryPermitLoader_2: any;
	private productionLicenseLoader_2: any;
	private foodDistributionLicenseLoader: any;
	private healthAndQuarantineCertificateLoader: any;
	private entryAndExitInspectionAndQuarantineCertificateLoader: any;
	private sanitaryPermitLoader_3: any;
	private businessLicenseLoader: any;
	private theDrugApprovalDocumentsLoader: any;
	private drugAdvertisingReviewFormLoader: any;
	private drugInformationServiceLicenseLoader: any;
	
	
	private securitiesBusinessQualificationPermitPathAlt: string;
	private futuresBusinessLicensePathAlt: string;
	private fundManagementQualificationCertificatePathAlt: string;
	private financialInstitutionLicensePathAlt: string;
	private bankApprovalPathAlt: string;
	private actingInsuranceLicensePathAlt: string;
	private fundManagementQualificationCertificatePathAlt_2: string;
	private operatingAStockUnderwritingBusinessLicensePathAlt: string;
	private sanitaryPermitPathAlt: string;
	private productionLicensePathAlt: string;
	private administrativeApprovalDocumentsPathAlt: string;
	private sanitaryPermitPathAlt_2: string;
	private productionLicensePathAlt_2: string;
	private foodDistributionLicensePathAlt: string;
	private healthAndQuarantineCertificatePathAlt: string;
	private entryAndExitInspectionAndQuarantineCertificatePathAlt: string;
	private sanitaryPermitPathAlt_3: string;
	private businessLicensePathAlt: string;
	private theDrugApprovalDocumentsPathAlt: string;
	private drugAdvertisingReviewFormPathAlt: string;
	private drugInformationServiceLicensePathAlt: string;
	
	
	private elseIndustry : "";
        constructor(
        	private router: Router,
        	private route : ActivatedRoute,
            private publicService: PublicService,
            private advertiserRootService: AdvertiserRootService,
            private myModalService: MyModalService,
			private chineseService: ChineseService,    
			private validationService: ValidationService,
			private baseService : BaseService
        ) {}
    
        ngOnInit() {
        	this.dateInit();
        	this.id=this.route.snapshot.params["id"] ? this.route.snapshot.params["id"] : "";
        }
		
	private dateInit(){
		this.baseImgUrl = eval(profiles + ".imgurlHref");
		/*logo*/
        this.logoLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/upload/logo",
			autoUpload:true,
			allowedFileType:["image"],
        });
        /*基本资质*/
        this.accountLicenceLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.organizationCodeLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.businessLicenceLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.icpLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        /*特殊资质*/
        this.securitiesBusinessQualificationPermitLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.futuresBusinessLicenseLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.fundManagementQualificationCertificateLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.financialInstitutionLicenseLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.bankApprovalLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.actingInsuranceLicenseLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.fundManagementQualificationCertificateLoader_2 = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.operatingAStockUnderwritingBusinessLicenseLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.sanitaryPermitLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.productionLicenseLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.administrativeApprovalDocumentsLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.sanitaryPermitLoader_2 = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.productionLicenseLoader_2 = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.foodDistributionLicenseLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.healthAndQuarantineCertificateLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.entryAndExitInspectionAndQuarantineCertificateLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.sanitaryPermitLoader_3 = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.businessLicenseLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.theDrugApprovalDocumentsLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.drugAdvertisingReviewFormLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        this.drugInformationServiceLicenseLoader = new FileUploader({
            url:this.baseService.getBaseUrl()+"/advertise/advertiser/upload",
			autoUpload:true,
			allowedFileType:["image"],
        });
        
        
        this.listenUpload();
        
        //批量查询行业
        this.advertiserRootService.industryQuery().subscribe(
			result => {
				this.elseIndustry = result.body.items;
			},
			error => {
				//this.myModalService.alert(error.message);
			}
		)		
        
        
		if(this.route.snapshot.params["id"]){
			this.advertiserRootService.advertiserInformation(this.route.snapshot.params["id"]).subscribe(
				result => {
					if(result.head.httpCode == 200){
						var data = result.body;
						this.accountLicencePath = data.accountLicencePath;
						this.accountLicencePathAlt = data.accountLicencePath;
						this.address = data.address;
						this.brand = data.brand;
						this.businessLicencePath = data.businessLicencePath;
						this.businessLicencePathAlt = data.businessLicencePath;
						this.companyName = data.companyName;
						this.contactNum = data.contactNum;
						this.contacts = data.contacts;
						this.email = data.email;
						this.icpPath = data.icpPath;
						this.icpPathAlt = data.icpPath;
						this.id = data.id;
						this.industryId = data.industryId;
						this.isProtected = data.isProtected;
						this.licenceDeadline = data.licenceDeadline;
						this.licenceNo = data.licenceNo;
						this.logoPath = data.logoPath;
						this.logoPathAlt = data.logoPath;
						this.name = data.name;
						this.organizationCode = data.organizationCode;
						this.organizationCodePath = data.organizationCodePath;
						this.organizationCodePathAlt = data.organizationCodePath;
						this.qq = data.qq;
						this.saleman = data.saleman;
						this.telephone = data.telephone;
						this.websiteName = data.websiteName;
						this.websiteUrl = data.websiteUrl;
						this.zip = data.zip;
						this.editBoolean = true;
					} 
				},
				error => {
					//this.myModalService.alert(error.message);
				}
			)		
		}
	}
	//上传监听事件
	private listenUpload(): void{
	    	/*logo*/
	    	this.logoLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	    		//返回图片路径
	    		this.logoPathAlt = JSON.parse(response).path;
	    		//缩略图
				let files = $("#logo").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.logoPath = this.result;
				}			
	        };
	        /*基本资质*/
	    	this.logoLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	    		//返回图片路径
	    		this.logoPathAlt = JSON.parse(response).path;
	    		//缩略图
				let files = $("#logo").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.logoPath = this.result;
				}			
	        };
	        this.logoLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	    	
	        this.accountLicenceLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.accountLicencePathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#accountLicence").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.accountLicencePath = this.result;
				}
	        };
	        this.accountLicenceLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.businessLicenceLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.businessLicencePathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#businessLicence").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.businessLicencePath = this.result;
				}        	
	        };
	        this.businessLicenceLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.organizationCodeLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.organizationCodePathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#organizationCode").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.organizationCodePath = this.result;
				}
	        };
	        this.organizationCodeLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.icpLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.icpPathAlt= JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#icp").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.icpPath = this.result;
				}
	        };
	        this.icpLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        /*特殊资质*/
	      	/*1*/
	        this.securitiesBusinessQualificationPermitLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.securitiesBusinessQualificationPermitPathAlt= JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#securitiesBusinessQualificationPermit").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.securitiesBusinessQualificationPermitPath = this.result;
				}
	        };
	        this.securitiesBusinessQualificationPermitLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.futuresBusinessLicenseLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.futuresBusinessLicensePathAlt= JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#futuresBusinessLicense").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.futuresBusinessLicensePath = this.result;
				}
	        };
	        this.futuresBusinessLicenseLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.fundManagementQualificationCertificateLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.fundManagementQualificationCertificatePathAlt= JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#fundManagementQualificationCertificate").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.fundManagementQualificationCertificatePath = this.result;
				}
	        };
	        this.fundManagementQualificationCertificateLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.financialInstitutionLicenseLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.financialInstitutionLicensePathAlt= JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#financialInstitutionLicense").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.financialInstitutionLicensePath = this.result;
				}
	        };
	        this.financialInstitutionLicenseLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.bankApprovalLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.bankApprovalPathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#bankApproval").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.bankApprovalPath = this.result;
				}
	        };
	        this.bankApprovalLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.actingInsuranceLicenseLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.actingInsuranceLicensePathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#actingInsuranceLicense").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.actingInsuranceLicensePath = this.result;
				}
	        };
	        this.actingInsuranceLicenseLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.fundManagementQualificationCertificateLoader_2.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.fundManagementQualificationCertificatePathAlt_2 = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#fundManagementQualificationCertificate_2").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.fundManagementQualificationCertificatePath_2 = this.result;
				}
	        };
	        this.fundManagementQualificationCertificateLoader_2.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
        
        	this.operatingAStockUnderwritingBusinessLicenseLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.fundManagementQualificationCertificatePathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#operatingAStockUnderwritingBusinessLicense").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.operatingAStockUnderwritingBusinessLicensePath = this.result;
				}
	        };
	        this.operatingAStockUnderwritingBusinessLicenseLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.sanitaryPermitLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.sanitaryPermitPathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#sanitaryPermit").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.sanitaryPermitPath = this.result;
				}
	        };
	        this.sanitaryPermitLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.productionLicenseLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.productionLicensePathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#productionLicense").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.productionLicensePath = this.result;
				}
	        };
	        this.productionLicenseLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	               // this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.administrativeApprovalDocumentsLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.administrativeApprovalDocumentsPathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#administrativeApprovalDocuments").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.administrativeApprovalDocumentsPath = this.result;
				}
	        };
	        this.administrativeApprovalDocumentsLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
			this.sanitaryPermitLoader_2.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.sanitaryPermitPathAlt_2 = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#sanitaryPermit_2").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.sanitaryPermitPath_2 = this.result;
				}
	        };
	        this.sanitaryPermitLoader_2.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	               // this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.productionLicenseLoader_2.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.productionLicensePathAlt_2 = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#productionLicense_2").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.productionLicensePath_2 = this.result;
				}
	        };
	        this.productionLicenseLoader_2.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	               // this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.foodDistributionLicenseLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.foodDistributionLicensePathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#foodDistributionLicense").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.foodDistributionLicensePath = this.result;
				}
	        };
	        this.foodDistributionLicenseLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.healthAndQuarantineCertificateLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.healthAndQuarantineCertificatePathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#healthAndQuarantineCertificate").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.healthAndQuarantineCertificatePath = this.result;
				}
	        };
	        this.healthAndQuarantineCertificateLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.entryAndExitInspectionAndQuarantineCertificateLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.healthAndQuarantineCertificatePathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#entryAndExitInspectionAndQuarantineCertificate").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.healthAndQuarantineCertificatePath = this.result;
				}
	        };
	        this.entryAndExitInspectionAndQuarantineCertificateLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	               // this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
			
			this.sanitaryPermitLoader_3.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.sanitaryPermitPathAlt_3 = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#sanitaryPermit_3").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.sanitaryPermitPath_3 = this.result;
				}
	        };
	        this.sanitaryPermitLoader_3.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	        
	        this.businessLicenseLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.businessLicensePathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#businessLicense").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.businessLicensePath = this.result;
				}
	        };
	        this.businessLicenseLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	               // this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
			
			this.theDrugApprovalDocumentsLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.theDrugApprovalDocumentsPathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#theDrugApprovalDocuments").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.theDrugApprovalDocumentsPath = this.result;
				}
	        };
	        this.theDrugApprovalDocumentsLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	
			this.drugAdvertisingReviewFormLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.drugAdvertisingReviewFormPathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#drugAdvertisingReviewForm").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.drugAdvertisingReviewFormPath = this.result;
				}
	        };
	        this.drugAdvertisingReviewFormLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	               // this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	
			this.drugInformationServiceLicenseLoader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
	        	//返回图片路径
	    		this.drugInformationServiceLicensePathAlt = JSON.parse(response).path;
	    		//缩略图
	        	let files = $("#drugInformationServiceLicense").get(0).files;
				let reader = new FileReader();
				let that = this;
				reader.readAsDataURL(files[0]);
				reader.onload = function(e){
					that.drugInformationServiceLicensePath = this.result;
				}
	        };
	        this.drugInformationServiceLicenseLoader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
	            if(status == 401){
	                this.router.navigate(["/login"]);
	            }else if(response){
	                //this.myModalService.alert(JSON.parse(response).message);
	            }
	        }
	}
		
	
	private removePath(ele){
		this[ele]="";
		this[ele+"Alt"]="";
	}
	
	private submit(){
		if( this.validationService.validate() && !this.editBoolean){
			this.advertiserRootService.createAdvertiser({
				name : this.name,					//必需,广告主名称
				companyName : this.companyName, 		//必需,公司名称
				contactNum : this.contactNum, //必需,联系电话
				contacts : this.contacts,			//必需,联系人
				email : this.email,					//,必需常用邮箱	
				industryId : this.industryId,			//必需,所属行业ID
				isProtected : this.isProtected,			//必需,是否保护客户,1保护,0不保护
				websiteName:this.websiteName,				//必需,公司官网名称
				websiteUrl:this.websiteUrl,				//必需,公司官网地址
				zip: this.zip ? this.zip : "",						//邮编
				icpPath: this.icpPathAlt ? this.icpPathAlt : "",					//ICP证书图片路径
				accountLicencePath :  this.accountLicencePathAlt ? this.accountLicencePathAlt : "", 	//开户许可证图片路径
				address :  this.address ? this.address : "", 				//公司地址
				brand :  this.brand ? this.brand : "",					//品牌名称
				businessLicencePath :  this.businessLicencePathAlt ? this.businessLicencePathAlt : "",	//营业执照图片路径
				licenceDeadline :  this.licenceDeadline ? this.licenceDeadline : "",			//营业执照截止时间
				licenceNo :  this.licenceNo ? this.licenceNo : "",				//营业执照编号
				logoPath :  this.logoPathAlt ? this.logoPathAlt : "",				//品牌Logo图片路径
				organizationCode: this.organizationCode ? this.organizationCode : "",		//组织结构代码
				organizationCodePath: this.organizationCodePathAlt ? this.organizationCodePathAlt : "",	//组织结构代码证图片路径
				qq: this.qq ? this.qq : "",						//QQ号
				qualifications:[],
				saleman: this.saleman ? this.saleman : "",					//销售
				telephone :  this.telephone ? this.telephone : "",				//固定电话				
			}).subscribe(
				result => {
					this.id= result.body.id;
	                this.router.navigate(["/home/advertiser/advertiserDetail/"+this.id]);
				},
				error => {
					//this.myModalService.alert(error.message);
				}
			)
		}else if( this.validationService.validate() && this.editBoolean){
			this.advertiserRootService.editAdvertiser(this.id,{
				companyName : this.companyName, 		//必需,公司名称
				contactNum : this.contactNum, //必需,联系电话 
				contacts : this.contacts,			//必需,联系人
				email : this.email,					//,必需常用邮箱	
				industryId : this.industryId,			//必需,所属行业ID
				isProtected : this.isProtected,			//必需,是否保护客户,1保护,0不保护
				websiteName:this.websiteName,				//必需,公司官网名称
				websiteUrl:this.websiteUrl,				//必需,公司官网地址
				zip: this.zip ? this.zip : "",						//邮编
				icpPath: this.icpPathAlt ? this.icpPathAlt : "",					//ICP证书图片路径
				accountLicencePath :  this.accountLicencePathAlt ? this.accountLicencePathAlt : "", 	//开户许可证图片路径
				address :  this.address ? this.address : "", 				//公司地址
				brand :  this.brand ? this.brand : "",					//品牌名称
				businessLicencePath :  this.businessLicencePathAlt ? this.businessLicencePathAlt : "",	//营业执照图片路径
				licenceDeadline :  this.licenceDeadline ? this.licenceDeadline : "",			//营业执照截止时间
				licenceNo :  this.licenceNo ? this.licenceNo : "",				//营业执照编号
				logoPath :  this.logoPathAlt ? this.logoPathAlt : "",				//品牌Logo图片路径
				organizationCode: this.organizationCode ? this.organizationCode : "",		//组织结构代码
				organizationCodePath: this.organizationCodePathAlt ? this.organizationCodePathAlt : "",	//组织结构代码证图片路径
				qq: this.qq ? this.qq : "",						//QQ号
				qualifications:[],
				saleman: this.saleman ? this.saleman : "",					//销售
				telephone :  this.telephone ? this.telephone : "",				//固定电话
			}).subscribe(				
				result => {
	                this.router.navigate(["/home/advertiser/advertiserDetail/"+this.id]);
				},
				error => {
					//this.myModalService.alert(error.message);
				}
			)
		}else{		
			this.validationService.validateAll()
		}
			
	}
	
	private back(){
		this.router.navigate(["/home/advertiser/advertiserList"]);
	}

}