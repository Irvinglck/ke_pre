<template>
    <div class="app-container">
        <h2 class="h2-title">
            <span>首页banner图片替换</span>
            <el-button type="primary" style="margin-right: 150px" @click="dialogFormVisible = true">添加Banner</el-button>
            <!--<span style="color:#409EFF" @click="addBanner">添加Banner</span>-->
        </h2>
        <hr/>
        <el-row>
            <el-col :span="8" v-for="(item, index) in bannerList" :key="index" :offset="index >=0 ? 2 : 0"
                    style="margin-bottom: 5px">
                <el-card :body-style="{ padding: '0px' }">
                    <!--<img src="https://km-wx-1304476764.cos.ap-nanjing.myqcloud.com/banner/banner%402x.png" class="image">-->
                    <img :src=item.burl class="image">
                    <div style="padding: 14px;">
                        <span>{{item.name}}</span>
                        <div class="bottom clearfix">
                            <time class="time">{{ currentDate }}</time>
                            <el-button type="text" @click="openAlert(item.bannerId,item.name)" class="button">删除</el-button>
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
                <el-form-item label="选择banner图片" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            drag
                            :auto-upload="false"
                            :on-change="checkType"
                            action="none"
                            :file-list="fileList"
                            :show-file-list="flag"
                            >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip" style="color: red;">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
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
  import { global } from 'src/global/global';
  import { api } from 'src/global/api';

  export default {
    data() {
      return {
        currentDate: new Date(),
        bannerList: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: ''
        },
        formLabelWidth: '120px',
        imgFile: null, //文件
        imgUrl: '',//头像url
        flag: true,
        fileList:[]


      }
    },
    mounted() {
      var that = this;

      that.getBannerList();

        },
    methods: {
      //确定提交函数
      conformUp(flag) {
        //参考 https://blog.csdn.net/qq_42394457/article/details/96769170
        console.log(flag)
        this.dialogFormVisible = false;
        let formData = new FormData();
        console.log('文件对象', this.imgFile)
        //这是提交到后台的文件
        formData.append('imgFile', this.imgFile.raw);
        formData.append('fileType', 'banner');
        formData.append('bannerName', this.form.name);
        this.axios.post(api.uploadFileByType, formData)
          .then((suc) => {
            console.log('图片上传成功');
            console.log(suc.data)
            this.$message({
              message: this.form.name + '图片上传成功',
              type: 'success'
            });
            this.flag = false;
            //重置输入库的值
            this.form.name = '';
            //在重新刷新列表
            this.getBannerList();
          })
          .catch((error) => {
            this.$message.error('上传失败');
            console.log(error)
          })

      },

      //选中文件钩子函数,可以在这里做文件限制操作
      checkType(file, fileList) {
        console.log('file', file)
        console.log('fileList', fileList)
        this.imgFile = file;
        // this.imgFile.push(file);
        this.fileList.push(file)
        // this.imgUrl = URL.createObjectURL(this.imgFile.raw)
      },
      //获取列表数据
      getBannerList() {
        var that = this;
        global.get(api.kmBanner, {}, function(res) {
          if (res.body.code == 200) {
            that.bannerList = res.body.data;
          }
        }, function(error) {
          console.log('获取banner列表失败', error)
        }, true)
      },
      openAlert(bannerId,bannerName) {
        this.$confirm(`此操作将删除: ${bannerName} banner图片 , 是否继续?`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBanner(bannerId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //添加banner图片
      delBanner(bannerId) {
        console.log('delBanner')
        this.axios.delete(api.delBanner, { params: { 'bannerId': bannerId } }) //传参方式这样也可以 //{params:{"bannerId":bannerId}}
          .then((success) => {
            console.log(success.data)
            if (success.data.code === 200) {
              this.$message({
                message: '图片删除成功',
                type: 'success'
              });
              //刷新列表
              this.getBannerList();
            }
          })
          .catch((fail) => {
            console.log(fail)
          });

      }

    }  };
</script>

<style rel="stylesheet/scss" lang="scss">
    .h2-title {
        display: flex;
        justify-content: space-between;
    }

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
