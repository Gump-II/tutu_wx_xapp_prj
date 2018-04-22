/**
 *  行程详情
 * 
 * @export
 * @class TravelDetail
 * 
 * @author:ychost<c.yang@tutufree.com>
 * @date  :2017-2-15
 * 
 */
export class TravelDetail {
    _id: string;
    costDetail?: any;
    contract?: any;
    insurance?: any;
    brief?:string;
    cost?:string;
    date: string[];
    atlas: string[];
    pages: _TravelPage[];
    routes: string[];
    sitesDescribe: SitesDescribe[];
}

export class _TravelPage {
    _id: string;
    title: string;
    author: string;
    jsonParseData: string;
    icon: string;
}

export class Site {
    _id: string;
    name: string;
}

export class SitesDescribe {
    indexTable: number[];
    sites: Site[];
}

export class TravelDetailMenu {
    text: string;
    briefLogo: string;
    open: boolean;
    do?: Function;

}

