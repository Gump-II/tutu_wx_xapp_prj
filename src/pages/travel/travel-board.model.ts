
/**
 * 主页数据模型
 * 
 * @author:ychost<c.yang@aiesst.com>
 * @date  :2017-2-11
 */

/**
 * 主页广告面板
 */
export class CallBoard {
    cover: string;
    brief: string;
    url: string;
}

/**
 * 行旅途数据
 */
export class Journey {
    _id: string;
    cover: string;
    placard: string;
    cost: string;
    specialPrice: number;
    order: number;
    duration: number;
    salesPromotion: boolean;
    repulation:string;
}

/**
 * 主页请求返回数据
 */
export class TravelBoard {
    callBoard: Array<CallBoard>;
    journeys: Array<Journey>;
}


