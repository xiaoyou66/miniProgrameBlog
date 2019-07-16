// pages/diary/diary.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [],
    pages: 0,
    currentPage: 1
  },
  onLoad: function (option) {
    this.getPostsList(1)
  },
  //获取文章
  getPostsList: function (id) {
    wx.showLoading({
      title: '加载中..',
    })
    let that = this
    //获取文章
    wx.request({
      url: 'https://api.xiaoyou66.com/web/',
      data: {
        'id': id,
        'choose':5
      },
      success(res) {
        console.log(res.data)
        that.data.Pages = res.data['pages']
        for (var i = 0; i < res.data['title'].length; i++)//把获取到的信息依次加到我们的文章列表里面
        {
          var arr = {}
          //把数据保存在字典中
          arr['title'] = res.data['title'][i]
          arr['createTime'] = res.data['create'][i]
          //给数组添加数据
          that.setData({
            posts: that.data.posts.concat(arr),
          })
        }
        //console.log(that.data.posts)
        wx.hideLoading()//隐藏登录框
      }
    })
  },
  //下拉加载效果
  onReachBottom: function () {
    if (this.data.currentPage + 1 != this.data.pages) {
      wx.showLoading({
        title: '玩命加载中！',
      })
      this.data.currentPage++
      this.getPostsList(this.data.currentPage)
    }
  },
  //上拉刷新效果
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '玩命加载中！',
    })
    this.data.currentPage = 1
    this.data.posts.length = 0
    this.getPostsList(this.data.currentPage)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})