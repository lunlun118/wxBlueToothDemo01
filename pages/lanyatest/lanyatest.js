// pages/lanyatest/lanyatest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:"未初始化蓝牙适配器",
    connectedDeviceId:"",
    deviceId:"",
    services:"",
    servicesUUID:"0000FFF7-0000-1000-8000-00805F9B34FB",
    serviceId:"",
    notifyCharacteristicsId:"",
    writeCharacteristicsId: "",
    sendmsg:"",
    res:"",
  },
  lanyatest1(event){
    console.log(event);
    
    var that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('初始化蓝牙适配器成功')
        //页面日志显示
        that.setData({
          info: '初始化蓝牙适配器成功'
        })
      },
      fail: function (res) {
        console.log('请打开蓝牙和定位功能')
        that.setData({
          info: '请打开蓝牙和定位功能'
        })
      }
    })
  },
  lanyatest2(event){
    var that = this;
    wx.getBluetoothAdapterState({
 
      success: function (res) {
 
        //打印相关信息
        console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available);
 
        that.setData({
          info: JSON.stringify(res.errMsg) +"\n蓝牙是否可用：" + res.available
        })
 
      },
      fail: function (res) {
 
        //打印相关信息
        console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available);
 
        that.setData({
          info: JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available
        })
 
      },
      
      
    })
 
  },
  lanyatest3(event){
    var that = this;
    wx.startBluetoothDevicesDiscovery({
      //services: ['180A'], //如果填写了此UUID，那么只会搜索出含有这个UUID的设备，建议一开始先不填写
      success: function (res) {
        that.setData({
          info: "搜索设备" + JSON.stringify(res),
        })
        console.log('搜索设备返回' + JSON.stringify(res))
 
      }
    })
 
  },

  lanyatest4(event){
    var that = this;
    wx.getBluetoothDevices({
      success: function (res) {
        console.log(res);
        
        that.setData({
          info: "设备列表\n" + JSON.stringify(res.devices),
          devices: res.devices
        })
        console.log('搜设备数目：' + res.devices.length)
        console.log('设备信息：\n' + JSON.stringify(res.devices)+"\n")
      }
    })
  },
  lanyaconnect(event){
    var that = this;
    wx.createBLEConnection({
      deviceId: event.currentTarget.id,
      success: function (res) {
        console.log('调试信息：' + res.errMsg);
        that.setData({
          connectedDeviceId: event.currentTarget.id,
          info: "MAC地址：" + event.currentTarget.id  + '  调试信息：' + res.errMsg,
          
        })
      },
      fail: function () {
        console.log("连接失败");
      },
 
    })
 
  },
  lanyatest6(event){
    var that = this;
    wx.stopBluetoothDevicesDiscovery({
      success:function(res){
        console.log("停止搜索"+JSON.stringify(res.errMsg));
        that.setData({
          info:"停止搜索"+JSON.stringify(res.errMsg)
        });
      }
    });
      
  },
  lanyatest7(event){
    console.log("进来了");
    
    var that = this;
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log('services UUID:\n', JSON.stringify(res.services));
        for (var i = 0; i < res.services.length; i++) {
          console.log("第"+(i+1) + "个UUID:" + res.services[i].uuid+"\n")          
        }
        that.setData({
          services: res.services,
          info: JSON.stringify(res.services),
        })
      },
      fail:function(res){
        console.log(res);
        
      }
    })
 
  },



  

    // onBluetoothDeviceFound() {
    //   wx.onBluetoothDeviceFound((res) => {
    //     res.devices.forEach(device => {
    //       if (!device.name && !device.localName) {
    //         return
    //       }
    //       const foundDevices = this.data.devices
    //       const idx = inArray(foundDevices, 'deviceId', device.deviceId)
    //       const data = {}
    //       if (idx === -1) {
    //         data[`devices[${foundDevices.length}]`] = device
    //       } else {
    //         data[`devices[${idx}]`] = device
    //       }
    //       this.setData(data)
    //     })
    //   })
    // },

    lanyatest8(event){
      var that = this;
      var myUUID = that.data.servicesUUID;//具有读、写、通知、属性的服务uuid
      console.log('UUID=' + myUUID)
      wx.getBLEDeviceCharacteristics({
        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: that.data.connectedDeviceId,
        // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
        serviceId: myUUID,
        success: function (res) {
          console.log("%c getBLEDeviceCharacteristics", "color:red;");
          for (var i = 0; i < res.characteristics.length; i++) {
            console.log('特征值：' + res.characteristics[i].uuid)
   
            if (res.characteristics[i].properties.notify) {
              console.log("notifyServicweId：", myUUID);
              console.log("notifyCharacteristicsId：", res.characteristics[i].uuid);
              that.setData({
                notifyServicweId: myUUID,
                notifyCharacteristicsId: "0000ACE0-0000-1000-8000-00805F9B34FB",//手动设置notifyCharacteristicsId为这个UUID，为了方便写死在这里
   
              })
              console.log("打印notifyCharacteristicsId")
              console.log(that.data.notifyCharacteristicsId)
            }
            if (res.characteristics[i].properties.write) {
              console.log("writeServicweId：", myUUID);
              console.log("writeCharacteristicsId：", res.characteristics[i].uuid);
              that.setData({
                writeServicweId: myUUID,
                //writeCharacteristicsId: res.characteristics[i].uuid,
                writeCharacteristicsId: "0000ACE1-0000-1000-8000-00805F9B34FB",//手动设置writeCharacteristicsId为这个UUID，为了方便写死在这里
              })
   
            }
   
          }
          console.log('device getBLEDeviceCharacteristics:', res.characteristics);
   
          that.setData({
            msg: JSON.stringify(res.characteristics),
          })
        },
        fail: function () {
          console.log("fail");
        },
   
      })
   
   
   
   
    },
    lanyatest9(event){
      var that = this;
      var notifyServicweId = that.data.servicesUUID;  //具有写、通知属性的服务uuid
      var notifyCharacteristicsId = that.data.notifyCharacteristicsId;
      console.log("启用notify的serviceId", notifyServicweId);
      console.log("启用notify的notifyCharacteristicsId", notifyCharacteristicsId);
   
      wx.notifyBLECharacteristicValueChange({
        state: true, // 启用 notify 功能
        deviceId: that.data.connectedDeviceId,
        // 这里的 serviceId 就是that.data.servicesUUID
        serviceId: notifyServicweId,

        characteristicId: that.data.notifyCharacteristicsId,
        success: function (res) {
          console.log('notifyBLECharacteristicValueChange success', res.errMsg)
          var msg = '启动notify:' + res.errMsg
          that.setData({
            info: msg
          })
        },
        fail: function (res) {
          console.log("失败~~~~~~~~~~~~~");
          console.log('启动notify:' + res.errMsg);
          console.log("=======\n"+JSON.stringify(res));
        },
      })
   
   
    },

    lanyatest10(event){
      var that = this;
      console.log("开始接收数据");
   
   
      wx.onBLECharacteristicValueChange(function (res) {
        
        console.log("characteristicId：" + res.characteristicId)
        console.log("serviceId:" + res.serviceId)
        console.log("deviceId" + res.deviceId)
        console.log("Length:" + res.value.byteLength)
        console.log("hexvalue:" + res.value)
        console.log("hexvalue:" + ab2hex(res.value))
        that.setData({
          info: that.data.info + ab2hex(res.value)
        })
   
      })
   
    },
    lanyatest11(event){
      // var that = this
      
      // var hex = that.data.sendmsg;  //要发送的信息
      // console.log('要发送的信息是：'+hex);
      // //const typedArray = wx.base64ToArrayBuffer(hex)
      // var typedArray = new Uint8Array(hex);
      // console.log("========:"+typedArray);
      // // var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      // //   return parseInt(h, 16)
      // // }))
      // console.log(typedArray) 
      // var buffer1 = typedArray.buffer

      var that = this;
      var hex = that.data.sendmsg
      //定义hex.length个长度的buffer，
      var dataBuffer = new ArrayBuffer(hex.length)
      var dataView = new DataView(dataBuffer)
      for (var i = 0; i < hex.length; i++) {
        //dataView.setUint8(1, 100)第i个值设置为hex.charAt(i).charCodeAt()，传递过去的值是（十六进制）
        dataView.setUint8(i, hex.charAt(i).charCodeAt())
      }
    //let dataHex = that.ab2hex(dataBuffer);
      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        
        serviceId: that.data.servicesUUID,
        
        characteristicId: that.data.writeCharacteristicsId,
        // 这里的value是ArrayBuffer类型
        value: dataBuffer,
        success: function (res) {
          console.log('写入成功', res.errMsg)
        },
        fail(res){
          console.log('写入失败', res.errMsg)
        }
      })
   
    },
    lanyatest12(event){
      var that = this;
      wx.closeBLEConnection({
        deviceId: that.data.connectedDeviceId,
        success: function (res) {
          that.setData({
            connectedDeviceId: "",
          })
          console.log('断开蓝牙设备成功：' + res.errMsg)
        },
        fail:function(res){
          console.log('断开蓝牙设备失败：' + res.errMsg)
        }
      })
   
    },

   
   
   
    //获取输入框的数据
    getmsg(event){
      this.setData({
        sendmsg:event.detail.value
      })
      
    },
 

})

// 微信官方给的ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join(',');
}
