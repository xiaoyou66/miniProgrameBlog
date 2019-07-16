//var WxParse = require('../../wxParse/wxParse.js');
var WxParse = require('../../wxParse/wxParse.js');
import Poster from '../../utils/poster';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    detail:"",
    createTime:"",
    totalVisits:"",
    defaultImageUrl:"",
    totalZans:"",
    totalComments:"",
    url:"",
    hasUserInfo:false,
    userInfo:{},
    isShow:false,//这个是是否显示下面的内容
    placeholder: "评论...",//提示
    focus:false,
    commentList:[],//评论列表
    commentContent:"",
    nodata_str: "暂无评论，赶紧抢沙发吧",
    isShowPosterModal: false,//是否展示海报弹窗
    posterImageUrl: "",//海报地址
    qrCode:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //把我们获取到的数据转成数组
    var strs = new Array()
    strs = options.id.split(",")
    //console.log(strs)
    //赋值结果
    this.setData({
      title: strs[2],
      createTime: strs[3],
      totalVisits: strs[4],
      defaultImageUrl: strs[1],
      totalZans: strs[5],
      url:strs[0],
      detail:strs[7]
    })
    //这里获取文章的内容
    this.getArticalDetail()
    //判断是否有用户信息
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } 
    //获取评论
    this.getComments()
  },
  //获取文章内容
  getArticalDetail: function()
  {
    wx.showLoading({
      title: '玩命加载中',
    })
    var that=this
    console.log(this.data.url)
    wx.request({
      url:"https://api.xiaoyou66.com/web/",
      data: {
        'url': that.data.url,
        'code':2
      },
      success(res) {
       // console.log()
        /*解析HTML*/
        var article = res.data
        WxParse.wxParse('article', 'html', article, that, 5)
        //console.log(that.data.posts)
        wx.hideLoading()//隐藏登录框
      }
    })
  },
  //获取文章的评论
  getComments:function()
  {
    var that = this
    this.data.commentList.length=0
    //console.log(this.data.url)
    wx.request({
      url: "https://api.xiaoyou66.com/web/",
      data: {
        'choose': 2,
        'url':that.data.url
      },
      success(res) {
        console.log(res.data)
        //获取文章评论数目
        that.setData({
          totalComments:"共有" + res.data.length + "评论"
        })
       
        for (var i = 0; i < res.data.length; i++)//把获取到的信息依次加到我们的文章列表里面
        {
          var arr = {}
          //把数据保存在字典中
          arr['cAvatarUrl'] = res.data[i][5]
          arr['cNickName'] = res.data[i][2]
          arr['createDate'] = res.data[i][4]
          arr['comment'] = res.data[i][3]
          arr['cOpenId'] = res.data[i][1]
          arr['_id'] = res.data[i][0]
          //给数组添加数据
          that.setData({
            commentList: that.data.commentList.concat(arr),
          })
        }
      }
    })
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

  },
  /**
 * 显示隐藏功能
 */
  showMenuBox: function () {
    this.setData({
      isShow: !this.data.isShow
    })
  },//失去焦点时显示的信息
  onReplyBlur: function (e) {
    let that = this;
    const text = e.detail.value.trim();
    if (text === '') {
      that.setData({
        commentId: "",
        placeholder: "评论...",
        toName: ""
      });
    }
  }, formSubmit: function (e) {
    if (!app.globalData.userInfo)
    {
      wx.showModal({
        title: '温馨提示',
        content: '登录后才能发言哦!',
      })
    }
    else
    {
      var that = this;
      var content = e.detail.value.inputComment;
      if (content == undefined || content.length == 0) {
        wx.showToast({
          title: '请输入内容',
          icon: 'none',
          duration: 1500
        })
        return
      }
      wx.request({
        url: "https://api.xiaoyou66.com/web/",
        data: {
          'choose':1 ,
          'openid': wx.getStorageSync('openid'),
          'nickname': app.globalData.userInfo.nickName,
          'comment':content,
          'usrImg': app.globalData.userInfo.avatarUrl,
          'webUrl':that.data.url
        },
        success(res) {
          if (res.data=="error")
          {
            wx.showToast({
              title: '评论失败!',
              icon: 'none',
              duration: 1500
            })
          }
          else
          {
            wx.showToast({
              title: '评论成功!',
              icon: 'none',
              duration: 1500
            })
            that.getComments()
            that.setData({
              commentContent:""
            })
          }
        }
      })
    }
  },/**
   * 生成海报成功-回调
   * @param {} e 
   */
  onPosterSuccess(e) {
    const { detail } = e;
    this.setData({
      posterImageUrl: detail,
      isShowPosterModal: true
    })
    console.info(detail)
  },
  /**
   * 生成海报失败-回调
   * @param {*} err 
   */
  onPosterFail(err) {
    console.info(err)
  },
  /**
   * 生成海报
   */
  onCreatePoster:function () {
    var that = this;
    if (that.data.posterImageUrl !== "") {
      that.setData({
        isShowPosterModal: true
      })
      return;
    }
    var posterConfig = {
      width: 750,
      height: 1200,
      backgroundColor: '#fff',
      debug: false
    }
    var blocks = [
      {
        width: 690,
        height: 808,
        x: 30,
        y: 183,
        borderWidth: 2,
        borderColor: '#f0c2a0',
        borderRadius: 20,
      },
      {
        width: 634,
        height: 74,
        x: 59,
        y: 680,
        backgroundColor: '#fff',
        opacity: 0.5,
        zIndex: 100,
      }
    ]
    var texts = [];
    texts = [
      {
        x: 113,
        y: 61,
        baseLine: 'middle',
        text: that.data.userInfo.nickName,
        fontSize: 32,
        color: '#8d8d8d',
        width: 570,
        lineNum: 1
      },
      {
        x: 32,
        y: 113,
        baseLine: 'top',
        text: '发现一篇很有意思的文章',
        fontSize: 38,
        color: '#080808',
      },
      {
        x: 59,
        y: 770,
        baseLine: 'middle',
        text: that.data.title,
        fontSize: 38,
        color: '#080808',
        marginLeft: 30,
        width: 570,
        lineNum: 2,
        lineHeight: 50
      },
      {
        x: 59,
        y: 875,
        baseLine: 'middle',
        text: that.data.detail,
        fontSize: 28,
        color: '#929292',
        width: 560,
        lineNum: 2,
        lineHeight: 50
      },
      {
        x: 315,
        y: 1100,
        baseLine: 'top',
        text: '长按识别小程序码,立即阅读',
        fontSize: 28,
        color: '#929292',
      }
    ];

    var imageUrl = that.data.defaultImageUrl
    imageUrl = imageUrl.replace('http://', 'https://')
    var images = [
      {
        width: 62,
        height: 62,
        x: 32,
        y: 30,
        borderRadius: 62,
        url: that.data.userInfo.avatarUrl, //用户头像
      },
      {
        width: 634,
        height: 475,
        x: 59,
        y: 210,
        url: imageUrl,//海报主图
      },
      {
        width: 220,
        height: 220,
        x: 70,
        y: 1000,
        url:"https://api.xiaoyou66.com/web/image/mini.jpg",//二维码的图
      }
    ];

    posterConfig.blocks = blocks;//海报内图片的外框
    posterConfig.texts = texts; //海报的文字
    posterConfig.images = images;

    that.setData({ posterConfig: posterConfig }, () => {
      Poster.create(true);    //生成海报图片
    });

  },
  /**
   * 点击放大图片
   * @param {} e 
   */
  posterImageClick: function (e) {
    wx.previewImage({
      urls: [this.data.posterImageUrl],
    });
  },
  /**
   * 隐藏海报弹窗
   * @param {*} e 
   */
  hideModal(e) {
    this.setData({
      isShowPosterModal: false
    })
  },
  /**
  * 保存海报图片
  */
  savePosterImage: function () {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.posterImageUrl,
      success(result) {
        console.log(result)
        wx.showModal({
          title: '提示',
          content: '二维码海报已存入手机相册，赶快分享到朋友圈吧',
          showCancel: false,
          success: function (res) {
            that.setData({
              isShowPosterModal: false,
              isShow: false
            })
          }
        })
      },
      fail: function (err) {
        console.log(err);
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("再次发起授权");
          wx.showModal({
            title: '用户未授权',
            content: '如需保存海报图片到相册，需获取授权.是否在授权管理中选中“保存到相册”?',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success: function success(res) {
                    console.log('打开设置', res.authSetting);
                    wx.openSetting({
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          console.log('获取保存到相册权限成功');
                        } else {
                          console.log('获取保存到相册权限失败');
                        }
                      }
                    })

                  }
                });
              }
            }
          })
        }
      }
    });
  }, //展示打赏二维码
  showQrcode:function (e) {
    wx.previewImage({
      current: ["https://api.xiaoyou66.com/web/image/price.png"],
      urls: ["https://api.xiaoyou66.com/web/image/price.png"]
    })
  },//点击连接时的处理
  wxParseTagATap:function(e)
  {
    console.log(e.currentTarget.dataset.src)
    wx.navigateTo({
      url: '../detail/original?url=' + e.currentTarget.dataset.src
    })
  },
  /**
 * 跳转原文
 */
  showoriginalUrl: function () {
    var data = this.data.url
    wx.navigateTo({
      url: '../detail/original?url=' + data
    })
  }
})