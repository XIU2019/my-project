// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-a1vlk',
  traceUser: true
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var _id = event._id
  var endTime = event.endTime
  var startTime = event.startTime
  var goodList = event.goodList

  try {
    return await db.collection('sale').doc(_id)
      .update({
        data: {
          endTime: endTime,
          startTime: startTime,
          goodList: goodList,
        },
      })
  } catch (e) {
    console.error(e)
  }


}