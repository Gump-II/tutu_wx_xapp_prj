import { Util } from './../../core/util/util';
export class LoadMoreWidget {
    static showLoading(page: IPage, text?: string, isLoadAllData: boolean = false): void {
        let loadMoreX: LoadMore = page.data.loadMoreX;
        if (Util.isNullOrUndefined(loadMoreX)) {
            loadMoreX = new LoadMore();
        }
        if (Util.isNullOrEmpty(text)) {
            text = "正在玩命加载中"
        }
        loadMoreX.loadText = text;
        loadMoreX.isLoading = true;
        loadMoreX.noData = isLoadAllData;
        page.setData({
            loadMoreX: loadMoreX
        })
    }

    static hideLoading(page: IPage): void {
        let loadMoreX: LoadMore = page.data.loadMoreX;
        if (Util.isNullOrUndefined(loadMoreX)) {
            loadMoreX = new LoadMore();
        }
        loadMoreX.isLoading = false;
        page.setData({
            loadMoreX: loadMoreX
        })
    }

    static showNoData(page: IPage): void {
        let loadMoreX: LoadMore = page.data.loadMoreX;
        if (Util.isNullOrUndefined(loadMoreX)) {
            loadMoreX = new LoadMore();
        }
        loadMoreX.isLoading = false;
        loadMoreX.noData = true;
        page.setData({
            loadMoreX: loadMoreX
        })
    }
}



export class LoadMore {
    isLoading: boolean;
    loadText: string;
    noData: boolean;
}