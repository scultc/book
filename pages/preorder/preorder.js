// pages/index/register.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // verifCode:'',
    account:'',
    verifText:'获取验证码',
    currentTime:61,
    btndisabled:false,
    
    //globalData中的选择的时间
    time:"",
    deskAndChairs:{
      1:[],
      2:[],
      3:[],
      4:[],
      5:[],
      6:[],
      7:[],
      8:[],
    },
    
    selectedDesk:"0",
    selectedChair:"0",
    userPhone:"",
    sourceData:{},
    availableDesk:[1,2,3,4,5],
    availableChairs:[1,2,3,4],//存放pos
    deskBtnClicked:false,
    chairBtnClicked:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  clickSelectDesk: function(){
   
      this.setData({
        deskBtnClicked:true,
      });

  
  },
  selectDesk: function(event){
    this.setData({
      selectedDesk:event.target.dataset.id+"",
    });
    this.setData({
      deskBtnClicked:false,
    })
    console.log(event.target.dataset.id);
  },
  selectChair: function(event){
    this.setData({
      selectedChair:event.target.dataset.id+"",
    });
    this.setData({
      chairBtnClicked:false,
    });
  },
  clickSelectChair: function(){
    this.setData({
      chairBtnClicked:true,
    })
  },
  onLoad: function (options) {
    // wx.navigateTo({
    //   url: '../logs/logs?name=time'
    // })


    // this.setData({
    //   time:options.time,
    //   userPhone:options.userPhone,
    // });


    
    //请求所有预约
    // /position/getall 包含手机号信息
    let that = this;
    wx.request({
      url: 'http://132.232.91.230:8080/position/getall',
      method:'POST',
      
      success: function(res){
        console.log(res.data);
        console.log("data: "+res.data[0].positionId);
        that.setData({
          sourceData:res.data,
        });
        
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
  backLoginBtn: function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  forgetPwd: function (options) {
    wx.navigateTo({
      url: '../forgetPwd/forgetPwd',
    })
  },
  getVerifCode: function(){
    var that = this;
    console.log(this.data.account);
    if (this.data.account.length!=11){
      wx.showToast({
        title:'手机号码错误',
        icon:'loading',
        duration:2000,
      })
      setTimeout(function(){
        wx.hideToast(),2000
      })
    }
    else{
      wx.request({
        url: 'http://132.232.91.230:8080/position/getcode',
        header:{
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method:'POST',
        
        data:{
          'phonenumber':this.data.account,

        },
        success: function(res){
          console.log(res.data);
          that.setData({
            btndisabled:true,
          })
          let interval = null;
          let currentTime = that.data.currentTime;
          interval = setInterval(function(){
            currentTime--;
            that.setData({
              verifText:currentTime+'s后获取',
            })
            if (currentTime<=0){
              clearInterval(interval);
              that.setData({
                verifText:'重新获取',
                btndisabled:false,
                currentTime:61,
              })
            }
          }, 1000)
        },
      })
    }
  },
  inputPhone: function(event){
    this.setData({
      account:event.detail.value,
    });
    // console.log(event.detail.value);
  },
  formSubmit: function (e) {
    console.log(e.detail.value.verifCode);
    if (e.detail.value.account.length == 0 ) {

      wx.showToast({

        title: '手机号码不得为空!',

        icon: 'loading',

        duration: 2000

      })

      setTimeout(function () {

        wx.hideToast()

      }, 2000)

    } else if (e.detail.value.account.length != 11) {

      wx.showToast({

        title: '请输入11位手机号码!',

        icon: 'loading',

        duration: 2000

      })

      setTimeout(function () {

        wx.hideToast()

      }, 2000)

    

    
    } 
    else if (e.detail.value.verifCode.length==0){
      wx.showToast({
        title: '验证码为空',
        icon: 'loading',
        duration:2000
      })
      setTimeout(function () {

        wx.hideToast()

      }, 2000)
    }
    else {
      
      wx.request({

        url: 'http://132.232.91.230:8080/user/register',

        header: {

          "Content-Type": "application/x-www-form-urlencoded"

        },

        method: "POST",

        data: { account: e.detail.value.account, password: e.detail.value.password1,
          code:e.detail.value.verifCode,
          invitecode:e.detail.value.invitecode,
         },

        success: function (res) {
          wx.navigateTo({
            url: '../login/login',
          })
          
            
        },
        fail: function(){
          console.log("submit fail");
        },
        complete: function(){
          console.log("submit complete");
        },

        
      })

    }

  },

})
