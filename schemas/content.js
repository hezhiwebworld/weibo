/**
 * Created by Administrator on 2017/4/2.
 */
/**
 * Created by Administrator on 2017/4/2.
 */


var mongoose = require('mongoose');

//定义内容数据的表结构
module.exports = new mongoose.Schema({

    //关联字段
    category: {
        //类型
        type: mongoose.Schema.ObjectId,
        //应用
        ref: 'Content'
    },
    title: String,
    miaoshu: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    }


});
