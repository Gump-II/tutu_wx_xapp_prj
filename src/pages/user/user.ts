class UserPage implements IPage {

    data: any = {
        text: "用户中心"
    }
}

Page(new UserPage())