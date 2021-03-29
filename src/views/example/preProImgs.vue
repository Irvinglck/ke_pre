<template>
    <div class="app-container">
        <h2 class="h2-title">
<!--            <span>产品详情图片列表</span>-->
            <el-button type="primary"  @click="createPdf(true)">生成pdf</el-button>
            <!--<span style="color:#409EFF" @click="addBanner">添加Banner</span>-->
        </h2>
        <hr/>
        <el-row>
<!--            <el-col :span="4" v-for="(item, index) in imgList" :key="index" :offset="index >=2 ? 2 : 0"-->
            <el-col :span="4" v-for="(item, index) in imgList" :key="index" :offset="index >=0 ? 2 : 0"
                    style="margin-bottom: 5px">
                <el-card :body-style="{ padding: '0px' }">
                    <!--<img src="https://km-wx-1304476764.cos.ap-nanjing.myqcloud.com/banner/banner%402x.png" class="image">-->
                    <img :src=item class="image">
                    <div style="padding: 14px;">
                        <span>{{item.name}}</span>
                        <div class="bottom clearfix">
                            <time class="time">{{ currentDate }}</time>
                            <el-button type="text" @click="openAlert(item.bannerId,item.name)" class="button">删除
                            </el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!--添加banner对话框-->
        <!-- Form -->
        <!--<el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>-->

        <el-dialog title="添加banner图片" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="banner名称" :label-width="formLabelWidth" style="width: 500px">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="conformUp(false)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import { api } from 'src/global/api';

  export default {
    data() {
      return {
        currentDate: new Date(),
        imgList: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: ''
        },
        formLabelWidth: '120px',
        imgFile: null, //文件
        imgUrl: '',//头像url
        flag: true,
        fileList: [],
        idAttr:''
      }
    },
    mounted() {
      var that = this;
      that.getProImages();

    },

    methods: {
      //
      createPdf(flag){
        console.log("sdfasd",flag)
        const idattr={productId:this.idAttr}
        this.axios.get(api.creatPdfUp,{params:idattr})
          .then((suc)=>{
            console.log(suc)
          })
        .catch((fail=>{console.log(fail)}))
      },
      //获取图片列表
      getProImages() {
        var that=this;
        //接收上个跳转的参数
        var data = this.$route.query;
        that.idAttr=data.idAttr;
        const par = { proId: data.idAttr };
        //获取产品图片列表
        this.axios.get(api.getProImgs, { params: par })
        .then((suc)=>{
          console.log(suc)
          console.log(suc.data.code)
          if(suc.data.code==200){
            that.imgList=suc.data.data;
            console.log(that.imgList)
          }
        })
        .catch((error)=>{
          console.log("失败")
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped>


    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>
