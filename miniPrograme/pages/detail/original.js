Page({

  data: {
    contents:""
  },
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
               title: '复制成功'
            })
          }
        })
      }
    })
  },
  onLoad :function(e){
    this.setData({
      contents:e.url
    })
  }

})