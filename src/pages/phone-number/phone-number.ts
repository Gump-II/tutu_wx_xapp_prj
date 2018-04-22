

class ServicePage implements IPage {
    callContact(event): void {
        console.log("event", event)
        let phoneNumber = event.currentTarget.dataset.phonenumber;
        wx.makePhoneCall({
            phoneNumber: phoneNumber
        })
    }
}

Page(new ServicePage())