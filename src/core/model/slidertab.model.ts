/**
 * tab菜单模型，只能在onLoad()中调用init初始化
 */
export class SliderTab {
    public systemInfo;
    sliderWidth: number;
    sliderOffset: number;
    constructor(
        //选项卡标题
        public tabs: String[],
        //变更tab数据委托
        private updateSliderData: () => void,
        //当前选中序号
        public activeIndex: number = 0,
        //选项卡下面绿条初始位置
        private sliderLeft: number = 0) {

    }

    init(): void {
        wx.getSystemInfo({
            success: (res) => {
                this.systemInfo = res;
                this.sliderWidth = res.windowWidth / this.tabs.length;
                this.sliderLeft = (res.windowWidth / this.tabs.length - this.sliderWidth) / 2;
                this.sliderOffset = res.windowWidth / this.tabs.length * this.activeIndex;

                this.updateSliderData();
            }
        });
    }

    get length(): number {
        return this.tabs.length;
    }
   
   get currentTab(){
       if(this.activeIndex >= this.tabs.length){
           throw new Error("tab的ActiveIndex 大于了 tabs的长度")
       }else if(this.activeIndex < 0){
           throw new Error("tab的ActiveIndex 不能为负数")
       }
       return this.tabs[this.activeIndex];
   }

}