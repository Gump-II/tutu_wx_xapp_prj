
/**
 * 已弃用！！！！！
 * 滑动的tab服务, 在data中定义slider:Slider即可
 * 只能在onLoad之后初始化，因为要获取 systemInfo
 * 然后在相应的touchstart touchmove touchend 调用相关函数即可
 *  onLoad(): void {
        this.sliderTouchService = new SliderTouchService(this.slider, this.setSlierData, this.initSlider);
    }
     touchStart(e): void {
        this.slideTouch.touchStart(e);
    }
    touchMove(e): void {
        this.slideTouch.touchMove(e);
    }
    touchEnd(e): void {
        this.slideTouch.touchEnd(e);
    }

 * 
 * @author: ychost
 * @date  : 2017-2-7
 */
class SliderTouchService {
    private time: number  //触摸计时
    private interval: any;;
    private touchDot = 0;//触摸时的原点
    private slideOnceFlag: boolean = true;
    public systemInfo: any;
    private sliderWidth: number = 0;
    private sliderValidLength: number = 40; //滑动有效长度 px

    constructor(
        private slider: Slider,
        private setSliderData: (activeIndex, sliderOffset) => void,
        private initSlider: (sliderLeft, sliderOffset) => void) {
        this.init();
    }

    /**
     * 初始化获取设备分辨率
     */
    init(): void {
        wx.getSystemInfo({
            success: (res) => {
                this.systemInfo = res;
                this.slider.sliderWidth = res.windowWidth / this.slider.tabs.length;
                let sliderLeft = (res.windowWidth / this.slider.tabs.length - this.sliderWidth) / 2;
                let sliderOffset = res.windowWidth / this.slider.tabs.length * this.slider.activeIndex;

                this.initSlider(sliderLeft, sliderOffset)
            }
        });
    }

    /**
     * 应被page的bindtouchstart调用
     */
    touchStart(e): void {
        this.touchDot = e.touches[0].pageX; // 获取触摸时的原点
        // 使用js计时器记录时间    
        this.interval = setInterval( ()=> {
            this.time++;
        }, 100);
    }

    /**
     * 应被page的bindtouchmove调用
     */
    touchMove(e): void {
        let touchMove = e.touches[0].pageX;
        if (this.time < 10 && this.slideOnceFlag) {
            // 向左滑动   
            if (touchMove - this.touchDot <= -this.sliderValidLength) {
                let activeIndex = this.slider.activeIndex + 1;
                if (activeIndex < this.slider.tabs.length) {
                    let sliderOffset = this.systemInfo.windowWidth / this.slider.tabs.length * activeIndex;
                    this.setSliderData(activeIndex, sliderOffset);
                }
                this.slideOnceFlag = false;
            }
            // 向右滑动
            else if (touchMove - this.touchDot >= this.sliderValidLength) {
                let activeIndex = this.slider.activeIndex - 1;
                if (activeIndex >= 0) {
                    let sliderOffset = this.systemInfo.windowWidth / this.slider.tabs.length * activeIndex;
                    this.setSliderData(activeIndex, sliderOffset);
                }
                this.slideOnceFlag = false;
            }
        }
    }

    /**
     * 应被page的bindtouchend调用
     */
    touchEnd(e): void {
        clearInterval(this.interval);
        this.time = 0;
        this.slideOnceFlag = true;
    }
}

/**
 * tab的滑动条
 */
class Slider {
    //选项卡下面绿条位置
    sliderOffset: number;
    sliderWidth: number;

    constructor(
        //选项卡标题
        public tabs: String[],
        //当前选中序号
        public activeIndex: number = 0,
        //选项卡下面绿条初始位置
        public sliderLeft: number = 0) {

    }
}

export { Slider, SliderTouchService }