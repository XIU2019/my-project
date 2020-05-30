<template>
  <view class="body">
    <view class="main">
      <scroll-view scroll-y="true" style="height: 100%;" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
        <van-cell-group>
          <van-field
            v-bind:value="goodList[0].goodName"
            label="菜品名:"
            placeholder="请输入菜品名"
            input-align="left"
            @change="onGoodChange($event)"
          />
        </van-cell-group>
        <van-cell-group>
          <van-field
            v-bind:value="goodList[0].price"
            label="价格:"
            placeholder="请输入价格"
            input-align="left"
            @change="onPriceChange($event)"
          />
        </van-cell-group>
        <!--    库存-->
        <van-cell-group>
          <van-field
            v-bind:value="goodList[0].stock"
            label="库存:"
            placeholder="请输入库存"
            input-align="left"
            @change="onStockChange($event)"
          />
        </van-cell-group>
        <van-radio-group v-bind:value="goodList[0].category" @change="onCategoryChange($event)">
          <van-cell-group>
            <van-cell>
              <van-row>
                <van-col class="title">类别:</van-col>
              </van-row>
              <van-row>
                <van-col span="8">
                  <van-radio name="早餐" checked-color="#FF2426">早餐</van-radio>
                </van-col>
                <van-col span="8">
                  <van-radio name="午餐" checked-color="#FF2426">午餐</van-radio>
                </van-col>
                <van-col span="8">
                  <van-radio name="晚餐" checked-color="#FF2426">晚餐</van-radio>
                </van-col>
              </van-row>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <!--    自评评分-->
        <van-cell>
          <view slot="title">
            <view>
              自评：
              <van-rate v-bind:value="goodList[0].score" @change="onScoreChange($event)"/>
            </view>

          </view>
        </van-cell>
        <!--    菜品描述-->
        <van-cell-group>
          <van-cell title="描述：" use-label-slot>
            <view slot="label">
              <van-field
                v-bind:value="goodList[0].description"
                type="textarea"
                placeholder="请输入菜品描述"
                v-bind:autosize=" { maxHeight: 100, minHeight: 20} "
                v-bind:border="false"
                @change="onDescriptionChange($event)"
              />
            </view>
          </van-cell>
        </van-cell-group>
        <!--    上传图片-->
        <view>

          <van-grid column-num="3">
            <van-grid-item
              v-for="(item, index) in images" :key="index"
            >
              <view slot="icon">
                <img
                  style="width: 60px; height: 30px;"
                  v-bind:src="item"
                >
              </view>
              <view slot="text">
                <van-icon name="cross" color="red" @click="deleteImage(index)"/>
              </view>
            </van-grid-item>
            </van-grid-item>
            <van-grid-item icon="photo-o" text="上传图片" @click="uploadImg"/>
          </van-grid>
          <view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="foot" @click="submit">
      <text class="text">保存</text>
    </view>
  </view>
</template>
<script>
  export default {
    onLoad(e) {
      console.log(e.id);
      this.initGoodList();
      Object.assign(this.$data, this.$options.data());//用于重新定义data的数据
      this.id = e.id;
    },
    onShow() {
      this.initGoodList();
    },
    onReady() {
      this.initGoodList();
    },
    data() {
      return {
        goodName: '',
        price: '',
        category: ['早餐', '午餐', '晚餐'],
        description: '',
        stock: '',
        detail: [],
        content: '6',
        score: 5,
        images: [],
        fileIds: [],
        goodList: [],
        id: '',//菜品的id
      }
    },
    methods: {
      initGoodList() {
        let value = wx.getStorageSync('goodList');
        if (value) {
          this.goodList = value;
          // console.log(value)
        } else {
          this.goodList = '';
          console.log('2')
        }

        this.goodList = this.goodList.filter(item => item._id === this.id);
        // this. downloadFile()
      },
      //  从云存储下载图片
      downloadFile() {
        if (this.goodList.length > 0) {
          let fileIds = this.goodList[0].fileIds.toString();
          console.log(fileIds);
          wx.cloud.downloadFile({
            fileID: fileIds, // 文件 ID
            success: res => {
              // 返回临时文件路径
              console.log(res.tempFilePath);
              this.images = this.images.concat(res.tempFilePath);
            },
            fail: console.error
          })
        }
      },


      upper(e) {
        // console.log(e)
      },

      lower(e) {
        // console.log(e)
      },

      scroll(e) {
        // console.log(e)
      },
      //添加菜品
      onGoodChange: function (event) {
        this.goodList [0].goodName = event.mp.detail
        // console.log(' goodName:', this.goodName)
      },
      onCategoryChange(event) {
       this.goodList [0].category = event.mp.detail
        // console.log('category:', this.category)
      },
      onPriceChange(event) {
        this.goodList [0].price = event.mp.detail
        // console.log('price :', this.price)
      },
      onStockChange(event) {
        this.goodList [0].stock = event.mp.detail
        // console.log('stock :', this.stock)
      },
      onDescriptionChange(event) {
        this.goodList [0].description = event.mp.detail
        // console.log(' description :', this.description)
      },
      // onContentChange: function (event) {
      //   this.content = event.mp.detail
      //   console.log('content:', this.content)
      // },
      onScoreChange: function (event) {
        this.goodList [0].score = JSON.stringify(event.mp.detail);
        // console.log('score:', this.score)
      },
      //提交
      submit: function () {
        var that = this
        wx.showLoading({
          title: '保存中',
        })
        let promiseArr = []
        for (let i = 0; i < that.images.length; i++) {
          promiseArr.push(new Promise((resolve, reject) => {
              console.log(promiseArr);
              let item = that.images[i];
              let suffix = /\.\w+$/.exec(item)[0];//正达表达式，返回文件的扩展名
              wx.cloud.uploadFile({
                  cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
                  filePath: item, // 小程序临时文件路径
                  success: res => {
                    // 返回文件 ID
                    console.log(res)
                    that.fileIds = that.fileIds.concat(res.fileID);
                    resolve()
                  },
                  fail: console.error
                }
              )
            }
          ))
        }
        Promise.all(promiseArr).then(res => {
          console.log(res);
          //更新数据
          wx.cloud.callFunction({
            name: 'updateGood',
            data: {
              _id: that.id,
              category: that.goodList [0].category,
              description: that.goodList [0].description,
              fileIds: that.fileIds,
              goodName: that.goodList [0].goodName,
              price: that.goodList [0].price,
              score: that.goodList [0].score,
              stock: that.goodList [0].stock,
            }
          }).then(res => {
            console.log(res);
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
            });
          })
            .catch(err => {
              console.log(err)
            });

          // 转到菜品列表详情
         wx.redirectTo({
            url: "/pages/productList/main",
          })
        })
          .catch(err => {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
              title: '保存失败',
            })
          })
      },
      //  上传图片
      uploadImg() {
        wx.chooseImage({
          count: 9,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: res => {
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths;
            console.log(tempFilePaths);
            this.images = this.images.concat(tempFilePaths);
          }
        })
      }
      ,
      //删除图片
      deleteImage(index) {
        console.log(index)
        this.images.splice(index, 1)
        console.log(this.images)
      }
      ,

    },
  }
</script>
<style scoped>
  .title {
    color: #000900;
  }

  .body {
    height: 100%;
    width: 100%;
    background: #e9e9e9;
  }

  .main {
    height: 85%;
    width: 100%;
    background: #ffffff;
  }

  .foot {
    height: 10%;
    width: 100%;
    background: #ff2624;
    margin: 10px auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .text {
    color: #e9e9e9;
  }
</style>
