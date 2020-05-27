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
        <van-cell v-for="(item, idx) in goodList"
                  :key="idx" use-label-slot>
          <view slot="label">
            <van-row>
              <van-col span="8">{{item.goodName}}</van-col>
              <van-col span="8">￥{{item.price}}</van-col>
              <van-col span="8">
                <van-stepper v-bind:value="1 " input-width="40px" button-size="20px"
                             @change="onChangeStep($event,item._id)"/>
              </van-col>
            </van-row>
          </view>
        </van-cell>
        <van-cell title="设置活动时间"/>
        <van-cell title="开始时间" v-bind:value="startTime" is-link value-class="cell-value" @click="showPopupTime1"/>
        <van-cell title="结束时间" v-bind:value="endTime" is-link @click="showPopupTime2" value-class="cell-value"/>
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
      console.log(e);
      Object.assign(this.$data, this.$options.data());
      this.initGoodList();
    },
    onShow: function () {

    },
    onReady() {

    },
    data() {
      return {
        goodList: [],
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
      }
    },
    methods: {
      //初试化菜品信息
      initGoodList() {
        let value = wx.getStorageSync('goodList');
        if (value) {
          this.goodList = value;
        } else {
          this.goodList = '';
          console.log('2')
        }
        this.goodList.map(item => {
          item.discount = "";
          item.nowPrice = "";
        })
      },
      //  设置折扣
      onChangeStep(event, id) {
        console.log(event.mp.detail, id);
        let discount1=event.mp.detail/10;
        let discount = `${event.mp.detail}折`;
        const index = this.goodList.findIndex(item => item._id === id);
        this.goodList[index].discount = discount;
        let nowPrice = discount1 * this.goodList[index].price;
        this.goodList[index].nowPrice = nowPrice;
        this.$set(this.goodList, index, this.goodList[index])
        console.log(discount, nowPrice)
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
        var that = this;
        const db = wx.cloud.database();
        db.collection('sale').add({
          data: {
            goodList: that.goodList,
            startTime: that.startTime,
            endTime: that.endTime,
          }
        }).then(res => {
          console.log(res);
          wx.showToast({
            title: '保存成功',
          });
          // 转到菜品列表详情
          wx.navigateTo({
            url: "/pages/activities/main",
          })
        }).catch(err => {
          console.log(err)
          wx.showToast({
            title: '保存失败',
          })
        })
      }
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
