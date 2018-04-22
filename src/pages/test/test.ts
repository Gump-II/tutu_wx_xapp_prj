import { FormWidget } from './../../shared/widget/form.widget';
import { SystemService } from './../../core/service/system.service';
import { SliderTab } from '../../core/model/index';
import { SliderTouchService, Slider } from '../../core/service/slidetouch.service';
import { Type, AutoWired, Inject, Container } from "../../lib/ioc/index"
import { PersonService } from "./test.model"
import { LoggerService } from "../../core/service/index"
import { ServerRoute } from '../../shared/config/server.route';
import { FormControl } from '../../core/model/form.model';

@AutoWired
class TestPage implements IPage {
    sliderTab: SliderTab;

    formControls: Array<FormControl> = [
        {
            title: "姓名",
            name: "nikeName",
            value: "",
            placeholder: "请输入姓名",
            type: FormControl.inputType
        },
        {
            title: "电话",
            name: "phoneNum",
            value: "",
            placeholder: "请输入手机号",
            maxlength: 11,
            type: FormControl.inputType


        },
        {
            title: "出发地",
            name: "starting",
            value: "",
            placeholder: "请输入出发地",
            type: FormControl.inputType

        },
        {
            title: "目的地",
            name: "destination",
            value: "",
            placeholder: "请输入目的地",
            type: FormControl.inputType

        },
        {
            name: "date",
            title: "出行日期",
            value: "请选择出行日期",
            placeholder: "请选择出行日期",
            type: FormControl.dateType

        }, {
            title: "备注",
            name: "remark",
            value: "",
            placeholder: "请输入备注，可输入100字",
            maxlength: 100,
            type: FormControl.textAreaType

        }
    ]
    data = {
        sliderTab: this.sliderTab,
        text: "hello",
        winHeight: 500
    }
    setData?: (data: any) => void;

    @Inject
    @Type(LoggerService)
    private logger: LoggerService;

    @Inject
    @Type(SystemService)
    systemService: SystemService;

    submitOrder(event: any): void {
        let model = FormWidget.controlsToModel(this.formControls);
        console.log("model",model)
    }

    onFormControlChanged(control:FormControl):void{
    }

    initSliderTab(): void {
        this.sliderTab =
            new SliderTab(["选项", "选项二", "选项4", "选项5"],
                this.updateSliderTabData);
        this.sliderTab.init();


    }


    updateSliderTabData(): void {
        this.setData({
            sliderTab: this.sliderTab,
        })
    }

    onReady(): void {
        this.initSliderTab();
        this.setData({
            winHeight: this.systemService.getInfo().windowHeight
        })
        this.logger.log("winHeight", this.data.winHeight)
    }


    tabClick(e): void {
        this.sliderTab.sliderOffset = e.currentTarget.offsetLeft;
        this.sliderTab.activeIndex = e.currentTarget.id;
        this.updateSliderTabData();
    }


    tabChange(e): void {
        let activeIndex = e.detail.current;
        if (this.sliderTab.activeIndex < this.sliderTab.length) {
            let sliderOffset = this.sliderTab.systemInfo.windowWidth / this.sliderTab.length * activeIndex;
            this.sliderTab.activeIndex = activeIndex;
            this.sliderTab.sliderOffset = sliderOffset;
            this.updateSliderTabData();
        }
    }

    onShow(): void {
    }
}
Page(new TestPage())

