import { NgModule } from "@angular/core";
import { RouterModule,Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FileUploadModule,FileSelectDirective } from "ng2-file-upload";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import {ClipboardModule} from '../node_modules/ngx-clipboard';
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
// 组件引入
import { CampaignFormComponent } from "./components/campaign/campaignForm.component";
import { ProjectFormComponent } from "./components/projectForm/projectForm.component";
import { ProjectListComponent } from "./components/projectList/projectList.component";
import {CampaignDetailComponent} from "./components/campaign/campaignDetail.component";
import { ModalRegionComponent } from "./components/public/modalRegion.component";
import { KpiComponent } from "./components/public/kpi.component";
import { AppComponent } from "./components/public/appSelected.component";
import { CreativeAppComponent } from "./components/public/creativeAppSelected.component";
import { PopulationSelectedComponent } from "./components/public/populationSelected.component";
import { ProjectDetailComponent } from "./components/projectDetail/projectDetail.component";
import { AdvertiserListComponent } from "./components/advertiser/advertiserList.component";
import { CreateUsersComponent } from "./components/advertiser/createUsers.component";
import { CreateAdvertisersComponent } from "./components/advertiser/createAdvertisers.component";
import { MobileBrandComponent } from "./components/public/mobileBrand.component";
import { PolicyDetailComponent } from "./components/policy/policyDetail.component";
import { PolicyListComponent } from "./components/policy/policyList.component";
import { PackageFormComponent } from "./components/package/packageForm.component";
import { PackageEditComponent } from "./components/package/packageEdit.component";
import { PackageDetailComponent } from "./components/package/packageDetail.component";
import { PackageListComponent } from "./components/package/packageList.component";
import { PackageCreativeComponent } from "./components/package/packageCreative.component";
import { addPackageVideoCreativeComponent } from "./components/package/addPackageVideoCreative.component";
import { NewIdeasForInformationFlowComponent } from "./components/package/newIdeasForInformationFlow.component";
import { PolicyFormComponent } from "./components/policy/policyForm.component";
import { CampaignAuditedComponent } from "./components/campaign/campaignAudited.component";
import { CampaignAuditComponent } from "./components/campaign/campaignAudit.component";
import { CopyAuditedComponent } from "./components/campaign/copyAudited.component";
import { CampaignListComponent } from "./components/campaign/campaignList.component";
import { CopypolicyComponent } from "./components/policy/copypolicy.component";
import { PolicyCreateComponent } from "./components/policy/policyCreate.component";
import { AuditListComponent } from "./components/package/auditList.component";
import { AuditDetailComponent } from "./components/campaign/auditDetail.component";
import { DetailAuditComponent } from "./components/audit/detailAudit.component";
import { AdxAuditComponent } from "./components/audit/adxAudit.component";
import { PackageAuditComponent } from "./components/audit/packageAudit.component";
import { BannerComponent } from "./components/public/banner.component";
import { AdvertiserDetailComponent } from "./components/advertiser/advertiserDetail.component";
import { PageComponent } from "./components/public/page.component";
import { PComponent } from "./components/app/app.component";
import { PackageMonitorCodeComponent } from "./components/package/packageMonitorCode.component";
import { EditMediaManagementComponent } from "./components/channel/editMediaManagement.component";
import { AddMediaManagementComponent } from "./components/channel/addMediaManagement.component";
import { EditMediaManagementProgramComponent } from "./components/channel/editMediaManagementProgram.component";
import { AddMediaManagementProgramComponent } from "./components/channel/addMediaManagementProgram.component";
import { MediaTypeManagementComponent } from "./components/mediaTypeManagement/mediaTypeManagement.component";
import { NewLevelMediaComponent } from "./components/mediaTypeManagement/newLevelMedia.component";
import { MediaManagementComponent } from "./components/channel/mediaManagement.component";
import { mediaManagementProgramComponent } from "./components/channel/mediaManagementProgram.component";
import { CreateEditChannelComponent } from "./components/programmaticChannel/createEditChannel.component";
import { ProgrammaticChannelComponent } from "./components/programmaticChannel/programmaticChannel.component";
import { PricingContractsComponent } from "./components/programmaticChannel/pricingContracts.component";
import { projectEstimateComponent } from "./components/finance/projectEstimate.component";
import { projectPayComponent } from "./components/finance/projectPay.component";
import { ImageSizeComponent } from "./components/channel/imageSize.component";
import { AddimageSizeComponent } from "./components/channel/addimageSize.component";
import { ImagePosesComponent } from "./components/channel/imagePoses.component";
import { ChannelDetailComponent } from "./components/programmaticChannel/channelDetail.component";
import { TrafficManagementComponent } from "./components/programmaticChannel/trafficManagement.component";
import { CreateEditPricingComponent } from "./components/programmaticChannel/createEditPricing.component";
import { DataChartComponent } from "./components/data/dataChart.component";
import { DataAddressComponent } from "./components/data/dataAddress.component";
import { DataNetworkComponent  } from "./components/data/dataNetwork.component";
import { DataAdvertComponent  } from "./components/data/dataAdvert.component";
import { DataFacilityComponent  } from "./components/data/dataFacility.component";
import { DataMediaComponent  } from "./components/data/dataMedia.component";
import { DataPointsComponent  } from "./components/data/dataPoints.component";
import { DeviceListComponent  } from "./components/public/deviceList.component";
import { SupplyDataComponent } from "./components/landingPageTracking/supplyData.component";
import { PlatformUniqueDataComponent } from "./components/landingPageTracking/platformUiqueData.component";
import { PlatformProviderUniqueDataComponent } from "./components/landingPageTracking/platformProviderUiqueData.component";
import { CompareDataComponent } from "./components/landingPageTracking/compareData.component";
import { CompareUniqueDataComponent } from "./components/landingPageTracking/compareUiqueData.component";
import { CompareProviderUniqueDataComponent } from "./components/landingPageTracking/compareProviderUiqueData.component";

// 指令引入
import { AddimagePosesComponent } from "./components/channel/addimagePoses.component";
import { VideoPosesComponent } from "./components/channel/videoPoses.component";
import { AddvideoPosesComponent } from "./components/channel/addvideoPoses.component";
import { EditvideoPosesComponent } from "./components/channel/editvideoPoses.component";
import { AnalysisOfRetentionDataComponent } from "./components/landingPageTracking/analysisOfRetentionData.component";
import { AnalysisOfThePageSurveyedComponent } from "./components/landingPageTracking/analysisOfThePageSurveyed.component";
import { DuringAnalysisComponent } from "./components/landingPageTracking/duringAnalysis.component";
import { EquimpentAnaltsisComponent } from "./components/landingPageTracking/equimpentAnaltsis.component";
import { SpatialAnalysisComponent } from "./components/landingPageTracking/spatialAnalysis.component";
import { NetworkAnalysisComponent } from "./components/landingPageTracking/networkAnalysis.component";
import { ChannelAuditComponent } from "./components/advertiser/channelAudit.component";
import { UserListComponent } from "./components/advertiser/userList.component";
import { TopUpDetailComponent } from "./components/advertiser/topUpDetail.component";
import { InflowPosesComponent } from "./components/channel/inflowPoses.component";
import { AddinflowPosesComponent } from "./components/channel/addinflowPoses.component";
import { EditinflowPosesComponent } from "./components/channel/editinflowPoses.component";
import { InflowTmplsComponent } from "./components/channel/inflowTmpls.component";
import { AddinflowTmplsComponent } from "./components/channel/addinflowTmpls.component";

// 指令引入
import { comprehensiveReportComponent } from "./components/datacenter/comprehensiveReport.component";
import { comprehensiveReporttwoComponent } from "./components/datacenter/comprehensiveReporttwo.component";
import { comprehensiveReportthreeComponent } from "./components/datacenter/comprehensiveReportthree.component";
import { comprehensiveReportfourComponent } from "./components/datacenter/comprehensiveReportfour.component";
import { CutStringDirective } from "./directives/cutString.directives";
import { ValidationDirective } from "./directives/validation.directives";
//服务引入
import { ValidationService } from "./services/validation.service";
import { BaseService } from "./services/base.service";
import { AppService } from "./services/app.service";
import { MyModalService } from "./services/myModal.service";
import { ChineseService } from "./services/chinese.service";
import { PublicService } from "./services/public.service";
import { CampaignService } from "./services/campaign.service";
import { ProjectService } from "./services/project.service";
import { PolicyService } from "./services/policy.service";
import { RootService } from "./services/root.service";
import { AdvertiserService } from "./services/advertiser.service";
import { AdvertiserRootService } from "./services/advertiser.root.service";
import { ChannelRootService } from "./services/channel.root.service";
import { PackageRootService } from "./services/package.root.service";
import { mediaManagementRootService } from "./services/mediaManagement.root.service";
import { ProjectDetailService } from "./services/projectDetail.service";
import { PackageService } from "./services/package.service";
import { CreativeService } from "./services/creative.service";
import { IndustryService } from "./services/industry.service";
import { DetailService } from "./services/detail.service";
import { CreativeSizeManagementService } from "./services/creativeSizeManagement.service";
import { DataService } from "./services/data.service";

export const childRoutes: Routes = [
	{ path: "" , redirectTo: "home/project/projectList", pathMatch: "full" },
	{ 
		path: "",
		children: [	
			{
				path: "advertiser",
				children:[
					{ path: "advertiserList", component:AdvertiserListComponent },
					{ path: "createUsers", component:CreateUsersComponent },
					{ path: "createAdvertisers", component:CreateAdvertisersComponent },
					{ path: "createAdvertisers/:id", component:CreateAdvertisersComponent },
					{ path: "advertiserDetail/:id", component:AdvertiserDetailComponent },
					{ path: "channelAudit/:id", component:ChannelAuditComponent },
					{ path: "userList/:id", component:UserListComponent },
					{ path: "topUpDetail/:id", component:TopUpDetailComponent },	
				]
			},
			{
				path: "campaign",
				children:[
					{ path: "campaignForm", component:CampaignFormComponent },
					{ path: "campaignForm/:projectId/:isProject", component:CampaignFormComponent },
					{ path: "campaignForm/:id", component:CampaignFormComponent },
					{ path: "campaignDetail/:campaignId", component:CampaignDetailComponent},
					{ path: "campaignDetail/:campaignId/:packageId", component:CampaignDetailComponent},
					{ path: "campaignList/:id", component:CampaignListComponent},
					{ path: "campaignAudited", component:CampaignAuditedComponent},
					{ path: "campaignAudit", component:CampaignAuditComponent},
					{ path: "copyAudited/:id/", component:CopyAuditedComponent},
					{ path: "copyAudited/:id/:campaignId", component:CopyAuditedComponent},
					
					{ path: "auditDetail/:campaignId", component:AuditDetailComponent},
					{
						path: "package",
						children:[
							{ path: "packageForm/:campaignId", component:PackageFormComponent },
							{ path: "packageEdit/:campaignId/:id", component:PackageEditComponent },
							{ path: "packageDetail/:campaignId/:packageId", component:PackageDetailComponent },
							{ path: "packageList/:campaignId", component:PackageListComponent },
							
							{ path: "packageCreative/:campaignId/:packageId/:tab", component:PackageCreativeComponent },
							{ path: "packageCreative/:campaignId/:packageId", component:PackageCreativeComponent },
							{ path: "packageCreative/:packageId", component:PackageCreativeComponent },

							{ path: "addPackageVideoCreative/:campaignId/:packageId", component:addPackageVideoCreativeComponent },
							{ path: "newIdeasForInformationFlow/:campaignId/:packageId", component:NewIdeasForInformationFlowComponent },
							{ path: "auditList/:campaignId", component:AuditListComponent },
							{ path: "packageMonitorCode/:campaignId/:packageId", component:PackageMonitorCodeComponent}
						]
					},	
					{
						path: "policy",
						children:[
							{ path: "policyDetail/:campaignId/:id", component:PolicyDetailComponent },
							{ path: "policyList/:campaignId", component:PolicyListComponent },
							{ path: "policyForm/:campaignId", component:PolicyFormComponent },
							{ path: "policyForm/:campaignId/:id", component:PolicyFormComponent },
							{ path: "policyCreate/:campaignId/:id", component:PolicyCreateComponent },
							{ path: "copypolicy/:campaignId/:id", component:CopypolicyComponent },
						]
					},	
					{
						path: "audit",
						children:[
							{ path: "detailAudit/:id", component:DetailAuditComponent },
							{ path: "adxAudit/:id", component:AdxAuditComponent },
							{ path: "packageAudit/:id", component:PackageAuditComponent },
							
						]
					},
					
				]
			},
			{
				path: "project",
				children:[
					{ path: "projectForm", component:ProjectFormComponent },
					{ path: "projectEdit/:id", component:ProjectFormComponent},
					{ path: "projectList", component:ProjectListComponent },	
					{ path: "projectDetail/:id",component:ProjectDetailComponent},
					{ path: "campaignList/:id", component:CampaignListComponent},
					{ path: "appp", component:PComponent},
				]
			},
			{
				path: "channel",
				children:[
					{ path: "programmaticChannel", component:ProgrammaticChannelComponent },
					{ path: "createEditChannel", component:CreateEditChannelComponent },
					{ path: "createEditChannel/:id", component:CreateEditChannelComponent },
				]
			},
			{
				path:"mediaTypeManagement",
				children:[					
					{ path: "mediaTypeManagementList", component: MediaTypeManagementComponent},
					{ path: "newLevelMedia/:level", component: NewLevelMediaComponent},
					{ path: "newLevelMedia/:level/:id", component: NewLevelMediaComponent},													
				]
			},
			{
				path:"programmaticChannel",
				children:[
					{ path: "channelList", component:ProgrammaticChannelComponent },
					{ path: "createEditChannel", component:CreateEditChannelComponent },
					{ path: "createEditChannel/:adxId", component:CreateEditChannelComponent },
					{ path: "pricingContracts/:adxId", component:PricingContractsComponent},
					{ path: "channelDetail/:adxId", component:ChannelDetailComponent},
					{ path: "trafficManagement/:adxId", component:TrafficManagementComponent},
					{ path: "createEditPricing/:adxId", component:CreateEditPricingComponent},
					{ path: "createEditPricing/:adxId/:contractId", component:CreateEditPricingComponent},					
					{ path: "mediaManagementProgram/:id", component:mediaManagementProgramComponent },
					{ path: "addMediaManagementProgram/:adxId", component:AddMediaManagementProgramComponent },
					{ path: "editMediaManagementProgram/:adxId/:id", component: EditMediaManagementProgramComponent},				
				]
			},
			{
				path:"mediaManagement",
				children:[
					{ path: "mediaManagement", component:MediaManagementComponent },
					{ path: "addMediaManagement", component:AddMediaManagementComponent },
					{ path: "editMediaManagement/:adxId/:id", component: EditMediaManagementComponent},
					{ path: "mediaTypeManagement", component: MediaTypeManagementComponent},
					{ path: "newLevelMedia/:level", component: NewLevelMediaComponent},
					{ path: "programmaticChannel", component:ProgrammaticChannelComponent },
					{ path: "createEditChannel", component:CreateEditChannelComponent },
					{ path: "createEditChannel/:id", component:CreateEditChannelComponent },
					/*{ path: "mediaManagementProgram/:id", component:mediaManagementProgramComponent },
					{ path: "addMediaManagementProgram/:adxId", component:AddMediaManagementProgramComponent },
					{ path: "editMediaManagementProgram/:adxId/:id", component: EditMediaManagementProgramComponent},*/
					// { path: "overshootManage", component:overshootManageComponent },
				]
			},
			{
				path: "finance",
				children:[
					{ path: "projectEstimate", component:projectEstimateComponent },
					{ path: "projectPay/:id", component:projectPayComponent },

				]
			},
			{
				path:"creativeSizeManagement",
				children:[
					{ path: "imageSize", component:ImageSizeComponent},
					{ path: "addimageSize", component:AddimageSizeComponent},
					{ path: "imagePoses", component:ImagePosesComponent},
					{ path: "addimagePoses", component:AddimagePosesComponent},
					{ path: "videoPoses", component:VideoPosesComponent},
					{ path: "addvideoPoses", component:AddvideoPosesComponent},
					{ path: "editvideoPoses/:id", component:EditvideoPosesComponent},
					{ path: "inflowPoses", component:InflowPosesComponent},
					{ path: "addinflowPoses", component:AddinflowPosesComponent},
					{ path: "editinflowPoses/:id", component:EditinflowPosesComponent},
					{ path: "inflowTmpls", component:InflowTmplsComponent},
					{ path: "addinflowTmpls", component:AddinflowTmplsComponent},
				]
			},
			{
				path: "data",
				children:[
					{ path: "dataChart", component:DataChartComponent },
					{path:"dataAddress",component: DataAddressComponent},
					{path:"dataNetwork",component: DataNetworkComponent},
					{path:"dataAdvert",component: DataAdvertComponent},
					{ path: "dataFacility", component:DataFacilityComponent },
					{ path: "dataMedia", component:DataMediaComponent },	
					{ path: "dataPoints", component: DataPointsComponent },
				]
			},
			{
				path:"datacenter",
				children:[
					{ path: "comprehensiveReport", component:comprehensiveReportComponent},
					{ path: "comprehensiveReporttwo", component:comprehensiveReporttwoComponent},
					{ path: "comprehensiveReportthree", component:comprehensiveReportthreeComponent},
					{ path: "comprehensiveReportfour", component:comprehensiveReportfourComponent},
				]
			},
			{
				path:"landingPageTracking",
				children:[
					{ path: "analysisOfRetentionData", component:AnalysisOfRetentionDataComponent},
					{ path: "analysisOfThePageSurveyed", component:AnalysisOfThePageSurveyedComponent},
					{ path: "duringAnalysis", component:DuringAnalysisComponent},
					{ path: "equipmentAnalysis", component:EquimpentAnaltsisComponent},
					{ path: "spatialAnalysis", component:SpatialAnalysisComponent},
					{ path: "networkAnalysis", component:NetworkAnalysisComponent},
					{ path: "analysisOfRetentionData/supplyData", component:SupplyDataComponent},
					{ path: "analysisOfRetentionData/platformUniqueData", component:PlatformUniqueDataComponent},
					{ path: "analysisOfRetentionData/platformProviderUniqueData", component:PlatformProviderUniqueDataComponent},
					{ path: "analysisOfRetentionData/compareData", component:CompareDataComponent},
					{ path: "compareData/compareUniqueData", component:CompareUniqueDataComponent},
					{ path: "compareData/compareProviderUniqueData", component:CompareProviderUniqueDataComponent}
				]
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(childRoutes),
		NgxDatatableModule,
		FormsModule,
		BrowserModule,
		HttpModule,
		CommonModule,
		FileUploadModule,
		Ng2Bs3ModalModule,
		ClipboardModule
	],
	declarations: [
		// 组件
		PComponent,
		comprehensiveReportComponent,
		comprehensiveReporttwoComponent,
		comprehensiveReportthreeComponent,
		comprehensiveReportfourComponent,
		AppComponent,
		CampaignFormComponent,
		ProjectFormComponent,
		ProjectListComponent,
		CampaignDetailComponent,
		ModalRegionComponent,
		KpiComponent,
		PopulationSelectedComponent,
		ProjectDetailComponent,
		AdvertiserListComponent,
		CreateUsersComponent,
		CreateAdvertisersComponent,
		MobileBrandComponent,
		PolicyDetailComponent,	
		PolicyListComponent,
		PackageFormComponent,	
		PackageEditComponent,
		PackageDetailComponent,
		PackageListComponent,
		PackageCreativeComponent,
		addPackageVideoCreativeComponent,
		NewIdeasForInformationFlowComponent,
		PolicyFormComponent,		
		CampaignAuditedComponent,
		CopyAuditedComponent,
		CampaignAuditComponent,
		CampaignListComponent,
		CopypolicyComponent,
		PolicyCreateComponent,
		AuditDetailComponent,
		AuditListComponent,
		DetailAuditComponent,
		AdxAuditComponent,
		PackageAuditComponent,
		BannerComponent,
		AdvertiserDetailComponent,
		PackageMonitorCodeComponent,
		ProgrammaticChannelComponent,
		CreateEditChannelComponent,
		PageComponent,
		MediaTypeManagementComponent,
		NewLevelMediaComponent,	
		ProgrammaticChannelComponent,
		CreateEditChannelComponent,
		MediaManagementComponent,
		mediaManagementProgramComponent,
		EditMediaManagementComponent,
		AddMediaManagementComponent,
		PricingContractsComponent,
		AddMediaManagementProgramComponent,
		EditMediaManagementProgramComponent,
		ImageSizeComponent,	
		AddimageSizeComponent,
		ImagePosesComponent,
		projectEstimateComponent,
		projectPayComponent,	
		ChannelDetailComponent,
		TrafficManagementComponent,
		CreateEditPricingComponent,
		DataChartComponent,
		DataAddressComponent,
		DataNetworkComponent,
		DataAdvertComponent,
		DataFacilityComponent,
		DataMediaComponent,
		DataPointsComponent,
		AnalysisOfRetentionDataComponent,
		AnalysisOfThePageSurveyedComponent,
		DuringAnalysisComponent,
		EquimpentAnaltsisComponent,
		SpatialAnalysisComponent,
		NetworkAnalysisComponent,
		DeviceListComponent,
		SupplyDataComponent,
		PlatformUniqueDataComponent,
		PlatformProviderUniqueDataComponent,
		CompareDataComponent,
		CompareUniqueDataComponent,
		CompareProviderUniqueDataComponent,		// 指令
		AddimagePosesComponent,
		VideoPosesComponent,
		AddvideoPosesComponent,		
		EditvideoPosesComponent,
		InflowPosesComponent,
		ChannelAuditComponent,
		UserListComponent,
		TopUpDetailComponent,
		InflowPosesComponent,		
		AddinflowPosesComponent,
		EditinflowPosesComponent,
		InflowTmplsComponent,
		AddinflowTmplsComponent,		
// 指令
		CutStringDirective,
		ValidationDirective,
		CreativeAppComponent,
	],
	providers: [
		// 服务
		ValidationService,
		AdvertiserRootService,
		PackageRootService,
		ChannelRootService,
		mediaManagementRootService,
		BaseService,
		AppService,
		MyModalService,
		ChineseService,
		PublicService,
		CampaignService,
		ChannelRootService,
		ProjectService,
		PolicyService,
		RootService,
		AdvertiserService,
		ProjectDetailService,
		PackageService,
		CreativeService,
		IndustryService,
		DetailService,
		CreativeSizeManagementService,
		DataService
	],
	exports: [ RouterModule ]
})

export class RoutingModule {

}