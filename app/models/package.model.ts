export class Package{
    id:number;
    items: Array<object>=[];
    selected: Array<string>=[];
    campaignId:number;
    clickUrl:string;
    deeplinkUrl:string;
    impressionUrl1:string;
    impressionUrl2:string;
    landpageUrl:string;
    name:string;
    needMonitorCode:string;
    advertiserName:string;
    campaignName:string;
    projectName:string;
    imageCreatives: Array<ImageCreatives>=[];
    infoflowCreatives: Array<InfoflowCreatives>=[];
    videoCreatives: Array<VideoCreatives>=[];
}

export class ImageCreatives{
    id:number;
    name:string;
    path:string;
}
export class InfoflowCreatives{
    description:string;
    iconPath:string;
    id:number;
    imagePaths:Array<object>=[];
    title:string;
}
export class VideoCreatives {
    id:number;
    name:string;
    path:string;
}