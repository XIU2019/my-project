<template>

  <view>
    <view>
      <van-tabs @change="onClickTitle">
        <van-tab title="外卖">
          <view v-for="(item, index) in orderList"
                :key="index">
            <van-cell>
              <view slot="title">
                {{index+1}}号
              </view>
              <view slot="right-icon" class="cell-value">
                {{item.paymentStatus}}
              </view>
            </van-cell>
            <van-cell>
              <van-row v-for="(item, _id) in item.goodList"
                       :key=" idx">
                <van-col span="6" offset="1">{{item.goodName}}</van-col>
                <van-col span="16">× {{item.num}}</van-col>
              </van-row>
              <van-row>
                <van-col span="6" offset="1">备注</van-col>
                <van-col span="16">{{item.orderInfo}}</van-col>
              </van-row>
              <van-row>
                <van-col span="24"> 实付￥{{item.totalMoney}}</van-col>
              </van-row>
              <van-row>
                <van-col span="24" class="cell-value" @click="oderDetail(item._id)">查看详情</van-col>
              </van-row>
            </van-cell>
            <van-cell>
              <van-row>
                <van-button type="default" size="small" @click="acceptOrders(item._id)">接受订单</van-button>
                <van-button type="default" size="small" @click="refuseOrders(item._id)">拒绝接单</van-button>
              </van-row>
            </van-cell>
          </view>
        </van-tab>
        <van-tab title="食堂">
           <view v-for="(item, index) in orderList"
                :key="index">
            <van-cell>
              <view slot="title">
                {{index+1}}号
              </view>
              <view slot="right-icon" class="cell-value">
                {{item.paymentStatus}}
              </view>
            </van-cell>
            <van-cell>
              <van-row v-for="(item, _id) in item.goodList"
                       :key=" idx">
                <van-col span="6" offset="1">{{item.goodName}}</van-col>
                <van-col span="16">× {{item.num}}</van-col>
              </van-row>
              <van-row>
                <van-col span="6" offset="1">备注</van-col>
                <van-col span="16">{{item.orderInfo}}</van-col>
              </van-row>
              <van-row>
                <van-col span="24"> 实付￥{{item.totalMoney}}</van-col>
              </van-row>
              <van-row>
                <van-col span="24" class="cell-value" @click="oderDetail(item._id)">查看详情</van-col>
              </van-row>
            </van-cell>
            <van-cell>
              <van-row>
                <van-button type="default" size="small" @click="acceptOrders(item._id)">接受订单</van-button>
                <van-button type="default" size="small" @click="refuseOrders(item._id)">拒绝接单</van-button>
              </van-row>
            </van-cell>
          </view>
        </van-tab>
        <van-tab title="退款">
          退款
        </van-tab>
      </van-tabs>
    </view>
  </view>

</template>
<script>

  export default {
    computed: {},
    onReady: function () {

    },
    onLoad() {
      this.getOrderList()
    },
    data() {
      return {
        orderList: [],
        selectedTitle: '外卖配送'

      }
    },
    methods: {

      onClickTitle(event) {
        console.log(event.mp.detail)
        let selectedTitle = event.mp.detail.title
        if (selectedTitle === "外卖") {
          this.selectedTitle = "外卖配送";
          this.getOrderList()
        } else if (selectedTitle === "食堂") {
          this.selectedTitle = "食堂自取";
          this.getOrderList()
        } else {
          this.selectedTitle = selectedTitle;
          this.getOrderList();
        }

      },
      //     获取列表
      getOrderList() {
        const that = this;
        const db = wx.cloud.database();
        const order = db.collection('order');
        if (that.selectedTitle === '退款') {
          order.where({
            serviceStatus: that.selectedTitle,
          }).where({
              orderStatus: '等待接单',
          }).get().then(res => {
            console.log(res);
            that.orderList = that.orderList.concat(res.data);
          }).catch(err => {
            console.log(err)
          })
        } else if (that.selectedTitle === "外卖配送" || that.selectedTitle === "食堂自取") {
          order.where({
            orderTypes: that.selectedTitle,
            orderStatus: '等待接单',
          })
            .get().then(res => {
            console.log(res);
            that.orderList = res.data;
          })
            .catch(err => {
              console.log(err)
            })
        }
      },
      //接受订单
      acceptOrders(id) {
        // console.log(id)
        //跟新食堂管理员端的Order表
        const db = wx.cloud.database();
        db.collection('orderAdmit').where({orderId: id})
          .update({
              data: {
                orderStatus: '已接单',
              }
            }
          ).then(res => {
          console.log(res)
        }).catch(err => {
            console.log(err)
          });
            db.collection('order').where({_id: id})
          .update({
              data: {
                orderStatus: '商家接单',
              }
            }
          ).then(res => {
          console.log(res)
        }).catch(err => {
            console.log(err)
          });
      },
      //  拒绝订单
      refuseOrders(id) {
        // console.log(id)
           const db = wx.cloud.database();
        db.collection('orderAdmit').where({orderId: id})
          .update({
              data: {
                orderStatus: '拒绝接单',
              }
            }
          ).then(res => {
          console.log(res)
        }).catch(err => {
            console.log(err)
          })
            db.collection('order').where({_id: id})
          .update({
              data: {
                orderStatus: '拒绝接单',
              }
            }
          ).then(res => {
          console.log(res)
        }).catch(err => {
            console.log(err)
          })
      }
      ,
      //  查看订单详情
      oderDetail(id) {
        console.log(id);
        wx.redirectTo({
          url: `/pages/orderDetail/main?order_id=${id}`,
        })
      }
      ,
    },
  }
</script>
<style scoped>
  .body {
    width: 100%;
    height: 100%;
    background: #b2b2b2;
  }

  .top {
    background: #f5f5f5;
    border-radius: 12px;
    padding: 5px 10px
  }

  .swiper {
    height: 120px;
    width: calc(100% - 16px)
  }

  .icon-item {
    width: 20%;
    padding: 10px 13px 0 13px;
    box-sizing: border-box;
  }

  .icon {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    color: #fff;
    font-size: 24px
  }

  .adv {
    border-right: 2px solid #eee
  }

  .adv img {
    width: 50px;
    height: 50px
  }

  .good {
    border-bottom: 1px solid #DDD8CE
  }

  .good img {
    width: 80px;
    height: 80px
  }

  my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
  }

  .title {
    font-size: 18px;
  }

  .price {
    padding-top: 2px;
    color: #e64340;
    font-size: 18px;
  }

  .cell-value {
    color: #ff2624 !important;
  }


</style>
