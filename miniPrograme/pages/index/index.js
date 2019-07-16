//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    posts: [],
    pages:0,
    currentPage:1
  },
  onLoad:function (option) {
    this.getPostsList(1)
  },
  //获取文章
  getPostsList:function(id){
    wx.showLoading({
      title: '加载中..',
    })
    let that=this

    // if (that.data.LoadOk) {
    //   wx.hideLoading()
    //   return
    // }
    //获取文章
    wx.request({
        url: 'https://api.xiaoyou66.com/web/',
      data: {
        'id': id,
      },
      success(res) {
        console.log(res.data)
        that.data.Pages = res.data['pages']
        for (var i = 0; i < res.data['title'].length;i++)//把获取到的信息依次加到我们的文章列表里面
        {
          var arr ={}
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
  //下拉加载效果
  onReachBottom: function (){
    if(this.data.currentPage+1!=this.data.pages)
    {
      wx.showLoading({
        title: '玩命加载中！',
      })
      this.data.currentPage ++
      this.getPostsList(this.data.currentPage)
    }
  },
  //上拉刷新效果
  onPullDownRefresh: function(){
    wx.showLoading({
      title: '玩命加载中！',
    })
    this.data.currentPage=1
    this.data.posts.length=0
    this.getPostsList(this.data.currentPage)
  },
  //点击时显示文章内容
  bindPostDetail: function (e) {
    let blogId = e.currentTarget.id;
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../detail/detail?id=' + blogId
    })
  }

})