/*
promise形式 getSetting
*/
export const getSetting = () => {
    return new Promise((reslove, reject) => {
        wx.getSetting({
            success: (result) => {
                reslove(result);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

/*
promise形式 chooseAddress
*/
export const chooseAddress = () => {
    return new Promise((reslove, reject) => {
        wx.chooseAddress({
            success: (result) => {
                reslove(result);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}


/*
promise形式 openSetting
*/
export const openSetting = () => {
    return new Promise((reslove, reject) => {
        wx.openSetting({
            success: (result) => {
                reslove(result);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

/*
promise形式 showModal
@param {object} param0 参数
*/
export const showModal = ({
    content
}) => {
    return new Promise((reslove, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (res) => {
                reslove(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}


export const showToast = ({
    title
}) => {
    return new Promise((reslove, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (res) => {
                reslove(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

export const login = () => {
    return new Promise((reslove, reject) => {
        wx.login({
            timeout: 10000,
            success: (result) => {
                reslove(result);
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

export const requestPayment = (pay) => {
    return new Promise((reslove, reject) => {
        wx.requestPayment({
            ...pay,
            success: (result) => {
                reslove(result);
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}