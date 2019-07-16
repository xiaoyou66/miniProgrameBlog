Page({
  /**
   * 页面的初始数据
   */
  data: {
    posts: [],
    url:"",
    pages:1,
    currentPage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    this.data.url=options.classify
    this.getPostsList(1)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function () {
    wx.showLoading({
      title: '玩命加载中！',
    })
    this.data.currentPage = 1
    this.data.posts.length = 0
    this.getPostsList(this.data.currentPage)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom:function () {
    if (this.data.currentPage + 1 != this.data.pages) {
      wx.showLoading({
        title: '玩命加载中！',
      })
      this.data.currentPage++
      this.getPostsList(this.data.currentPage)
    }
  },

  /**
  * 获取文章列表
*/
  getPostsList: function (id) {
    wx.showLoading({
      title: '加载中..',
    })
    var that = this
    //获取文章
    wx.request({
      url: 'https://api.xiaoyou66.com/web/',
      data: {
        'id':id,
        'choose': 3,
        'url':that.data.url
      },
      success(res) {
        console.log(res)
        that.data.pages = res.data['pages']
        console.log(that.data.pages)
        for (var i = 0; i < res.data['title'].length; i++)//把获取到的信息依次加到我们的文章列表里面
        {
          var arr = {}
          //把数据保存在字典中
          arr['title'] = res.data['title'][i]
          arr['defaultImageUrl'] = res.data['imgUrl'][i]
          arr['createTime'] = res.data['create'][i]
          arr['totalVisits'] = res.data['visits'][i]
          arr['totalZans'] = res.data['likes'][i]
          arr['totalComments'] = res.data['comments'][i]
          arr['detail'] = res.data['detail'][i]
          arr['urls'] = res.data['urls'][i]
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
  bindPostDetail:function(e)
  {
    let blogId = e.currentTarget.id;
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../../detail/detail?id=' + blogId
    })
  }

})