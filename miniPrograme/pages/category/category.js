// pages/category/category.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classifyList: [{
      'classifyName':"笔记",
      'classifyDesc':"学编程语言记的一些笔记",
      'url':"https://xiaoyou66.com/category/0000/"
    },
    {
      'classifyName': "个人感想",
      'classifyDesc': "记录自己的成长之路",
      'url': "https://xiaoyou66.com/category/1000/1300/"
      },
      {
        'classifyName': "个人作品",
        'classifyDesc': "我做的一些小项目",
        'url': "https://xiaoyou66.com/category/3000/"
      },
      {
        'classifyName': "日记",
        'classifyDesc': "记下每日点滴",
        'url': "https://xiaoyou66.com/category/1000/1200/"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },  /**
   * 跳转至专题详情
   * @param {} e 
   */
  openTopicPosts:function (e) {
    var classify = e.currentTarget.id;
    console.log(classify)
    if (classify =="https://xiaoyou66.com/category/1000/1200/")
    {
      wx.navigateTo({
        url: '../diary/diary' 
      })
    }else
    {
      wx.navigateTo({
        url: '../category/topiclist/topiclist?classify=' + classify
      })
    }
  }
})