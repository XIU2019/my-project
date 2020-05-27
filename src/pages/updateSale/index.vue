<template>
  <view class="body">
    <view class="boxMain ">
      <van-cell-group>
        <van-cell>
          <view slot="title">
            <van-row>
              <van-col span="8">菜品名称</van-col>
              <van-col span="8">菜品原价</van-col>
              <van-col span="8">设置折扣</van-col>
            </van-row>
          </view>
        </van-cell>
        <van-cell v-for="(item, idx) in saleList[0].goodList"
                  :key="idx" use-label-slot>
          <view slot="label">
            <van-row>
              <van-col span="8">{{item.goodName}}</van-col>
              <van-col span="8">￥{{item.price}}</van-col>
              <van-col span="8">
                <van-stepper v-bind:value="item.discount" input-width="40px" button-size="20px"
                             @change="onChangeStep($event,item._id)"/>
              </van-col>
            </van-row>
          </view>
        </van-cell>
        <van-cell title="设置活动时间"/>
        <van-cell title="开始时间" v-bind:value="saleList[0].startTime" is-link value-class="cell-value"
                  @click="showPopupTime1"/>
        <van-cell title="结束时间" v-bind:value="saleList[0].endTime" is-link @click="showPopupTime2"
                  value-class="cell-value"/>
      </van-cell-group>
    </view>
    <view class="box3" @click="onSubmit">
      <text class="text">保存</text>
    </view>
    <!--    开始时间-->
    <van-popup v-bind:show="showTime" @close="onClose1" position="bottom"
               custom-style="height: 50%">
      <van-datetime-picker
        type="datetime"
        v-bind:value="currentDate"
        v-bind:min-date="minDate"
        v-bind:max-date="maxDate "
        @input="onInputStartTime($event)"
        @confirm="confirmStartTime($event)"
      />
    </van-popup>
    <!--    结束时间-->
    <van-popup v-bind:show="show" @close="onClose2" position="bottom"
               custom-style="height: 50%">
      <van-datetime-picker
        type="datetime"
        v-bind:value="currentDate"
        v-bind:min-date="minDate"
        v-bind:max-date="maxDate "
        @input="onInputEndTime($event)"
        @confirm="confirmEndTime($event)"
      />
    </van-popup>
  </view>
</template>

<script>
  export default {
    computed: {},
    onLoad: function (e) {
      console.log(e.id);
      Object.assign(this.$data, this.$options.data());
      this.initSaleList();
      this.id = e.id
    },
    onShow: function () {
      this.initSaleList();
    },
    onReady() {
      this.initSaleList();
    },
    data() {
      return {
        saleList: [],
        show: false,
        showTime: false,
        startTime: '',
        endTime: "",
        minHour: 10,
        maxHour: 20,
        minDate: new Date().getTime(),
        maxDate: new Date(2020, 10, 1).getTime(),
        currentDate: new Date().getTime(),
        discount: "",
        id: "",//修改列表ID
        goodList: [],
      }
    },
    methods: {
      //初试化菜品信息
      initSaleList() {
        let value = wx.getStorageSync('saleList');
        if (value) {
          this.saleList = value;
        } else {
          this.saleList = '';
          console.log('2')
        }
        this.saleList = this.saleList.filter(item => item._id === this.id);
        // this.goodList=this.saleList[0].goodList[0];
      },
      //  设置折扣
      onChangeStep(event, id) {
        console.log(event.mp.detail, id);
        this.discount = event.mp.detail;
        console.log(this.discount);
        this.goodList.map(item => {
          if (item._id === id)
            return item.discount = this.discount
        });
      },
      showPopupTime1() {
        this.showTime = true;
      },
      showPopupTime2() {
        this.show = true;
      },
      onClose1() {
        this.showTime = false;
      },
      onClose2() {
        this.show = false;
      },

      onInputStartTime(event) {
        console.log(event.mp.detail);
        // const time1 = new Date(event.mp.detail);
        // this.currentDate = event.mp.detail;
        // console.log(time1);
        const now = new Date(event.mp.detail);
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const d = now.getDate();
        this.startTime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
        // this.startTime = time1.toLocaleDateString().replace(/\//g, "-") + " " + time1.toTimeString().substr(0, 8);
      },

      confirmStartTime(event) {
        const now = new Date(event.mp.detail);
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const d = now.getDate();
        this.startTime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
        this.showTime = false;
      },
      onInputEndTime(event) {
        console.log('1', event.mp.detail);
        const now = new Date(event.mp.detail);
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const d = now.getDate();
        this.endTime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
        console.log(this.endTime)
      },
      confirmEndTime(event) {
        const now = new Date(event.mp.detail);
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const d = now.getDate();
        this.endTime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
        this.show = false;
      },
      //  保存到数据库中
      onSubmit() {
        //更新数据
        var that = this;
        wx.cloud.callFunction({
          name: 'updateSale1',
          data: {
            _id: that.id,
            endTime: that.saleList[0].endTime,
            startTime: that.saleList [0].startTime,
            goodList: that.saleList [0].goodList,
          }
        }).then(res => {
          console.log(res);
          wx.hideLoading();
          wx.showToast({
            title: '修改成功',
          });
          // 转到菜品列表详情
          wx.navigateTo({
            url: "/pages/activities/main",
          })
        })
          .catch(err => {
            console.log(err)
          });

      },

    },
  }
</script>

<style>
  .body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    background: #eeeeee;
  }

  .main {
    width: 100%;
    height: 92%;
    background: #ffffff;
    margin: 0 auto;
  }

  .foot {
    width: 100%;
    height: 8%;
    background: #ffffff;
    margin: 0px auto;
  }

  .box1 {
    width: 20%;
    height: 100%;
    float: left;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .box2 {
    width: 40%;
    height: 100%;
    float: right;
    background: #ff2624;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
  }

  .text {
    color: #e9e9e9;
    font-size: 18px;
  }

  .text {
    color: #ffffff;
  }

  .box3 {
    width: 100%;
    height: 8%;
    background: #ff2624;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 10px auto;
  }

  .boxMain {
    width: 100%;
    height: 92%;
    background: #ffffff;
  }

  .cell-value {
    color: #000900 !important;
    font-size: 16px !important;
  }
</style>
