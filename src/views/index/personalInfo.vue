<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="8">

                <div class="user_img">
                    <!-- <img :src="personalInfo.avatar" alt="用户头像" >
                    <p>
                        <button type="button" class="el-button filter-item el-button--primary" @click="uploadAvatar()">
                            <i class="fa fa-cloud-upload" aria-hidden="true"></i><span>上传头像</span>
                        </button>
                    </p> -->

                    <img v-if="newImageUrl" :src="newImageUrl" alt="用户头像">
                    <img v-else :src="personalInfo.avatar" alt="用户头像">

                    <el-upload class="avatar-uploader"
                               action="none"
                               :show-file-list="false" :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload">
                        <button type="button" class="el-button filter-item el-button--primary" style="margin-top:10px">
                            <i class="fa fa-cloud-upload" aria-hidden="true"></i><span>上传头像</span>
                        </button>
                    </el-upload>

                </div>

            </el-col>

            <el-col :span="16">
                <div class="user_info">
                    <h2>个人信息
                        <el-button size="small" v-if="!editable" @click="editable = true" style="float:right;"
                                   icon="edit">编辑
                        </el-button>
                    </h2>
                    <div class="user_info_form" v-if="editable">

                        <el-form label-position="right" label-width="100px" :model="personalInfo">

                            <el-form-item label="昵称">
                                <el-input v-model="personalInfo.nickname"></el-input>
                            </el-form-item>
                            <el-form-item label="真实姓名">
                                <el-input v-model="personalInfo.trueName"></el-input>
                            </el-form-item>
                            <el-form-item label="性别">
                                <el-radio-group v-model="personalInfo.sex">
                                    <el-radio label="man">男</el-radio>
                                    <el-radio label="woman">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="邮件地址">
                                <el-input v-model="personalInfo.email" disabled=""></el-input>
                            </el-form-item>
                            <el-form-item label="个人简介">
                                <el-input type="textarea" v-model="personalInfo.introduction"></el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="submitForm()">提交</el-button>
                                <el-button @click="resetForm()">取消</el-button>
                            </el-form-item>

                        </el-form>

                    </div>

                    <div class="user_info_text" v-else>
                        <el-form label-position="right" label-width="100px" :model="personalInfo">

                            <el-form-item label="昵称：">
                                {{ personalInfo.nickname }}
                            </el-form-item>
                            <el-form-item label="真实姓名：">
                                {{ personalInfo.trueName }}

                            </el-form-item>
                            <el-form-item label="性别：">
                                <span v-if="personalInfo.sex == 'man'">男</span>
                                <span v-else>女</span>

                            </el-form-item>
                            <el-form-item label="邮件地址：">
                                {{ personalInfo.email }}

                            </el-form-item>
                            <el-form-item label="个人简介：">
                                {{ personalInfo.introduction }}

                            </el-form-item>


                        </el-form>
                    </div>
                </div>

            </el-col>
        </el-row>
        <div style="display: none" id="text">
            <el-form ref="form" :model="newData" label-width="80px" label-position="right" size="mini">
                <el-form-item label="上传文件" prop="name">
                    <el-upload
                            ref="upload"
                            multiple
                            name="File"
                            action=""
                            :auto-upload="false"
                            accept=".dll, .DLL, .xml, .XML, .jpg,.jepg , .png"
                            :http-request="httpRequest"
                            :on-remove="removeImgs"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span slot="tip" class="el-upload__tip">&nbsp;&nbsp;&nbsp;注意上传.jpg.jepg .png结尾的图片</span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="作者名称" prop="authorName">
                    <el-input v-model="newData.authorName"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="newForm" size="mini">确 定</el-button>
                <el-button @click="editDialog = false" size="mini">取 消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { global } from 'src/global/global';
  import { api } from 'src/global/api';

  const echarts = require('echarts');

  export default {
    data() {
      return {
        editable: false,
        personalInfo: {},
        newImageUrl: '',
        newData: {},
        file: []

      }
    },
    computed: {
      ...mapGetters({
        // 映射 this.personalInfo_init 为 store.getters.userInfo
        personalInfo_init: 'userInfo'
      })
    },
    mounted() {
      const vm = this;

      vm.resetForm();

    },
    methods: {
      // 提交表单
      submitForm() {
        const vm = this;
        vm.editable = false;
        const par = {
          account: vm.personalInfo.account,
          nickname: vm.personalInfo.nickname,
          trueName: vm.personalInfo.trueName,
          sex: vm.personalInfo.sex,
          email: vm.personalInfo.email,
          introduction: vm.personalInfo.introduction
        };

        console.log('修改信息入参为：', par)
      },
      // 重置表单
      resetForm() {
        const vm = this;
        vm.editable = false;
        vm.personalInfo = JSON.parse(JSON.stringify(vm.personalInfo_init));
      },

      handleAvatarSuccess(res, file) {
        this.newImageUrl = URL.createObjectURL(file.raw);
        alert('修改头像成功')
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      httpRequest(param) {
        this.file.push(param.file);// 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      },
      // 提交
      newForm() {
        var that=this;
        var upData = new FormData();
        this.$refs.upload.submit();// 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
        this.file.forEach(function(file) {// 因为要上传多个文件，所以需要遍历
          upData.append('files', file, file.name);
          // upData.append('file', this.file); //不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
        })
        upData.append('userName', JSON.stringify(this.newData)) // 这里需要转换一下格式传给后台
        this.axios.post('http://localhost:8080/bsm/uploadFiles', upData)
          .then(function(succ) {
            console.log(succ.data)
            if (succ.data.code == 200) {
              console.log("2000000000")
              that.file=[];
              that.removeImgs();
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      removeImgs(){
        this.$refs.upload.clearFiles();
      }

    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    #text {
        background: #fff;
        margin: 20px;
        padding: 20px
    }

    .user_img {
        /*width: 80%;*/
        padding: 20px;
        text-align: center;
        border: 1px solid #dee1e2;

        img {
            max-width: 200px;
            max-height: 200px;
            border-radius: 50%;
        }
    }

    .user_info {
        /*padding-bottom: 20px;*/
        border: 1px solid #dee1e2;

        h2 {
            margin: 0;
            font-weight: normal;
            padding: 10px 20px;
            border-bottom: 1px solid #dee1e2;

            .i_edit {
                float: right;
                font-size: 16px;
                color: #7ab8ed;
            }
        }
    }

    .user_info_form, .user_info_text {
        padding: 20px;
    }

    #income, #interest {
        width: 100%;
        height: 400px;
    }

    .el-form-item {
        margin-bottom: 0;
    }

    .avatar-uploader {
        margin-bottom: 32px;
    }
</style>
