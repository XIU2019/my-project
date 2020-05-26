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
        <van-cell title="开始时间" v-bind:value="startTime" is-link @click="showPopupTime1"/>
        <van-cell title="结束时间" v-bind:value="endTime" is-link @click="showPopupTime2"/>
      </van-cell-group>
    </view>
    <van-popup v-bind:show="showTime" @close="onClose" position="bottom"
               custom-style="height: 50%">
      <van-datetime-picker
        type="datetime"
        v-bind:value="currentDate"
        v-bind:min-date="minDate"
        v-bind:max-date="maxDate "
        @input="onInput"
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
        showTime: false,
        startTime: '',
        endTime: "",
        minHour: 10,
        maxHour: 20,
        minDate: new Date().getTime(),
        maxDate: new Date(2019, 10, 1).getTime(),
        currentDate: new Date().getTime(),
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
      },
      //  设置折扣
      onChangeStep(event, id) {
        console.log(event.mp.detail, id);
        let discount = event.mp.detail;
        console.log(discount);
        this.goodList.map(item => {
          if (item._id === id)
            return item.discount = discount
        });
      },
      showPopupTime1() {
        this.showTime = true;
      },
      showPopupTime2() {
        this.showTime = true;
      },
      onClose() {
        this.showTime = false;
      },

      onInput(event) {
        this.currentDate=event.mp.detail;
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

  .box {
    width: 100%;
    height: 100%;
    background: #c4c4c4;
  }

  .box3 {
    width: 100%;
    height: 10%;
    background: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .boxMain {
    width: 100%;
    height: 90%;
    background: #ffffff;
  }
</style>
