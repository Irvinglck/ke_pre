<template>
    <div class="app-container">
        <!--        <h2 style="color:red">-->
        <!--           产品管理页面-->
        <!--        </h2>-->

        <!-- 搜索条件 -->
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="产品型号"
                      v-model="listQuery.name">
            </el-input>

            <!--            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="产品类型"-->
            <!--                      v-model="listQuery.type">-->
            <!--            </el-input>-->


            <!-- <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="类型">
              <el-option v-for="item in  typeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
              </el-option>
            </el-select> -->

            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="primary" @click="handleCreate" icon="edit">添加</el-button>
            <el-button class="filter-item" type="primary" @click="synData" icon="edit">同步官网数据</el-button>
            <!-- <el-button class="filter-item" type="primary" @click="handleDelAll"  icon="edit">批量删除</el-button>
           <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button> -->

        </div>


        <!-- 表格 v-loading.body="listLoading"-->
        <!--<el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="list"-->
        <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="list"
                  element-loading-text="拼命加载中" border fit highlight-current-row>
            <!--<el-table-column type="selection" width="50">-->
            <!--</el-table-column>-->

            <el-table-column align="center" label='序号' width="70">
                <template slot-scope="scope">
                    {{ scope.row.idAttr }}
                </template>
            </el-table-column>

            <el-table-column label="型号" width="" align="center">
                <template slot-scope="scope">
                    <!--                    <a :href="scope.row.alt" class="" style="margin: 10px 0;display: inline-block;">-->
                    <!--                        <img :src="scope.row.images.small" alt="" style="vertical-align: middle;max-width: 100%;">-->
                    <!--                    </a>-->
                    {{scope.row.title}}
                </template>
            </el-table-column>
            <el-table-column label="打印机类型" width="" prop="title">
                <template slot-scope="scope">
                    <span v-if="scope.row.classid=='38'">多功能复合机</span>
                    <span v-else="scope.row.classid=='46'">打印机/一体机</span>
                </template>
            </el-table-column>
            <el-table-column label="名称" width="" prop="title">
                <template slot-scope="scope">
                    {{ scope.row.ftitle}}
                </template>
            </el-table-column>

            <!--            <el-table-column label="描述" width="">-->
            <!--                <template slot-scope="scope">-->
            <!--                    {{scope.row.smalltext}}-->
            <!--                </template>-->
            <!--            </el-table-column>-->

            <!--            <el-table-column label="产品特点" width="">-->
            <!--                <template slot-scope="scope">-->
            <!--                    <span>{{scope.row.cert}}</span>-->
            <!--                </template>-->
            <!--            </el-table-column>-->

            <el-table-column label="尺寸" align="center" width="" prop="rating.average">
                <template slot-scope="scope">
                    {{scope.row.outputsizemax}}
                </template>
            </el-table-column>

            <el-table-column align="center" prop="created_at" label="颜色" width="">
                <template slot-scope="scope">
                    <span>{{scope.row.colour}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="彩印打印速度" width="">
                <template slot-scope="scope">
                    <span>{{scope.row.output_speed_color}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="黑白打印速度" width="">
                <template slot-scope="scope">
                    <span>{{scope.row.output_speed_mono}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" prop="created_at" label="是否上传详情" width="">
                <template slot-scope="scope">
                    <el-button size="small" v-if="scope.row.haveImg=='true'" type="primary"
                               @click="proviewImg(scope.row)">已上传/预览
                    </el-button>
                    <el-button v-else size="small" type="danger" @click="undoneImage(scope.$index, scope.row)">未上传/上传
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="上传pdf" width="150px">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.havePdf=='true'" @click="overWritePdf(scope.row)" size="small" type="info">已上传pdf</el-button>
                    <el-button v-else size="small" type="warning" @click="handleUploadPdf(scope.row)">上传pdf</el-button>

                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150px">
                <template slot-scope="scope">

                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

                </template>
            </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.currPage"
                           :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!-- 上传产品pdf -->
        <el-dialog title="上传产品pdf" :visible.sync="dialogpdf">
            <el-form class="small-space" :model="productPdf" label-position="left" label-width="70px"
                     style='width: 400px; margin-left:50px;'>

                <!--                <el-form-item label="标题">-->
                <!--                    <el-input v-model="productPdf.title"></el-input>-->
                <!--                </el-form-item>-->
                <!--<el-form-item label="选择banner图片" :label-width="formLabelWidth">-->
                <el-form-item label="上传产品pdf">
                    <el-upload
                            class="upload-demo"
                            drag
                            :auto-upload="false"
                            :on-change="checkType"
                            action="none"
                            :show-file-list="flag"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip" style="color: red;">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogpdf = false">取 消</el-button>

                <el-button type="primary" @click="addProPdf()">确 定</el-button>
            </div>
        </el-dialog>
        <!--上传产品详情文件-->
        <el-dialog title="添加产品详情" :visible.sync="detailProDialog">
            <div id="text">
                <el-form ref="form" :model="newData" label-width="80px" label-position="right" size="mini">
                    <el-form-item label="上传文件" prop="name">
                        <el-upload
                                ref="upload"
                                multiple
                                name="File"
                                action=""
                                :auto-upload="false"
                                accept=".dll, .DLL, .xml, .XML, .jpg, .jepg, .png"
                                :http-request="httpRequest"
                                :on-remove="removeImgs"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <span slot="tip" class="el-upload__tip" style="color: red">&nbsp;
                                &nbsp;&nbsp;注意上传.jpg.jepg .png结尾的图片,最多上传8张
                            </span>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="参数描述" prop="proName" style="width: 500px">
                        <el-input v-model="newData.proName"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="uploadFiles()" size="mini">确 定</el-button>
                    <el-button @click="cancelDialog" size="mini">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 新增弹窗 -->
        <el-dialog :title="pageName" :visible.sync="dialogFormVisible">
            <el-form class="small-space" :model="product" label-position="left" label-width="70px"
                     style='width: 400px; margin-left:50px;'>

                <el-form-item label="型号" class="icon_star">
                    <el-input v-model="product.title"></el-input>
                </el-form-item>

                <el-form-item label="类型" class="icon_star">
                    <!--<el-input v-model="product.classid"></el-input>-->
                    <el-select v-model="product.classid" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.classid"
                                :label="item.label"
                                :value="item.classid">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="名称" class="icon_star">
                    <el-input v-model="product.ftitle"></el-input>
                </el-form-item>

                <el-form-item label="尺寸" class="icon_star">
                    <el-input v-model="product.outputsizemax"></el-input>
                </el-form-item>
                <el-form-item label="颜色" class="icon_star">
                    <el-input v-model="product.colour"></el-input>
                </el-form-item>
                <el-form-item label="彩印打印速度" class="icon_star">
                    <el-input v-model="product.outputSpeedColor"></el-input>
                </el-form-item>
                <el-form-item label="黑白打印速度" class="icon_star">
                    <el-input v-model="product.outputSpeedMono"></el-input>
                </el-form-item>


            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>

                <el-button type="primary" @click="handleCreateSubmit">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
  import { api } from 'src/global/api';

  export default {
    data() {
      return {

        list: null, // 表格list
        total: null,
        listLoading: true,
        listQuery: {
          currPage: 1,
          pageSize: 10,
          name: '',
          type: null// 类型
        },
        productPdf: {
          title: ''
        },
        product: {
          idAttr: '',
          title: '',
          classid: '',
          ftitle: '',
          outputsizemax: '',
          colour: '',
          outputSpeedColor: '',
          outputSpeedMono: ''
        },
        pageName: '',
        dialogpdf: false,
        flag: true,
        imgFile: null,
        fileList: [],
        typeOptions: [
          { key: '001', display_name: '类型1' },
          { key: '002', display_name: '类型2' },
          { key: '003', display_name: '类型3' }

        ],
        dialogFormVisible: false,
        form: {
          name: ''
        },
        detailProDialog: false,
        multipleSelection: [],
        newData: {},
        file: [],
        idAttr: '',//产品id
        options: [{
          classid: '38',
          label: '多功能复合机'
        }, {
          classid: '46',
          label: '打印机/一体机'
        }, {
          classid: '50',
          label: '其他'
        }],
        proInfoId: ''


      }
    },
    mounted() {
      const vm = this;
      vm.getList();
    },
    methods: {
      addProPdf() {
        //参考 https://blog.csdn.net/qq_42394457/article/details/96769170
        this.dialogpdf = false;
        let formData = new FormData();
        console.log('文件对象', this.imgFile)
        //这是提交到后台的文件
        formData.append('imgFile', this.imgFile.raw);
        formData.append('fileType', 'proPdf');
        formData.append('proInfoId', this.proInfoId);
        this.axios.post(api.uploadFileByType, formData)
          .then((suc) => {
            console.log('pdf上传成功');
            console.log(suc.data)
            this.$message({
              message: 'PDF上传成功',
              type: 'success'
            });
            this.flag = false;
            //重置输入库的值
            this.getList();
          })
          .catch((error) => {
            this.$message.error('上传失败');
            console.log(error)
          })

      },
      checkType(file, fileList) {
        console.log('file', file)
        console.log('fileList', fileList)
        this.imgFile = file;
        // this.imgFile.push(file);
        this.fileList.push(file)
      },

      //多文件上传
      httpRequest(param) {
        this.file.push(param.file);// 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      },
      // 多文件上传
      uploadFiles() {
        var that = this;
        var upData = new FormData();
        this.$refs.upload.submit();// 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
        this.file.forEach(function(file) {// 因为要上传多个文件，所以需要遍历
          upData.append('files', file, file.name);
          // upData.append('file', this.file); //不要直接使用我们的文件数组进行上传，你会发现传给后台的是两个Object
        })
        this.newData.idAttr = that.idAttr;
        upData.append('proDes', JSON.stringify(this.newData)) // 这里需要转换一下格式传给后台

        this.axios.post(api.uploadFiles, upData)
          .then(function(succ) {
            console.log(succ.data)
            if (succ.data.code == 200) {
              console.log('上传成功')
              that.file = [];
              that.removeImgs();
              that.detailProDialog = false;
              that.getList();
              that.idAttr = '';
              that.newData.proName = ''
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      cancelDialog() {
        this.file = [];
        this.removeImgs();
        this.detailProDialog = false;
        this.idAttr = '';
        this.newData.proName = ''
      },
      removeImgs() {
        this.$refs.upload.clearFiles();
      },
      // 获取列表数据
      async getList() {
        const vm = this;
        vm.listLoading = false;
        // 请求参数
        const par = {
          pageSize: vm.listQuery.pageSize,
          startIndex: (vm.listQuery.currPage - 1) * vm.listQuery.pageSize,
          proName: vm.listQuery.name         // 产品名称
          // tag: vm.listQuery.type       // 类型
        };
        //获取产品列表
        this.axios.get(api.proList, { params: par }).then(res => {
          vm.list = res.data.data.data;
          vm.total=res.data.data.totalCount;
        }).catch(error => {
          console.log(error)
        });
      },
      //预览已经上传的图片
      proviewImg(row) {
        console.log(row)
        console.log(11)
        // 带参跳转
        this.$router.push({ path: '/example/preProImgs', query: { idAttr: row.idAttr } });

      },
      //去上传照片
      undoneImage(index, row) {
        this.detailProDialog = true;
        console.log(index)
        console.log(row)
        this.idAttr = row.idAttr;
      },
      // 编辑
      handleEdit(index, row) {

        const vm = this;
        vm.pageName = '修改产品'
        console.log('编辑的row：', index, '-----', row);
        console.log(this.list[index]);

        let pro = this.list[index];
        this.product.idAttr = pro.idAttr;
        this.product.classid = pro.classid;
        this.product.colour = pro.colour;
        this.product.ftitle = pro.ftitle;
        this.product.outputsizemax = pro.outputsizemax;
        this.product.title = pro.title;
        this.product.outputSpeedColor = pro.output_speed_color;
        this.product.outputSpeedMono = pro.output_speed_mono;

        this.dialogFormVisible = true;

        // this.axios.get(api.updatePro,vm.product)
        //   .then((suc)=>{
        //     vm.getList();
        //   })
        // .catch((error)=>{
        //
        // })
      },
      //覆盖pdf
      overWritePdf(row){
        this.open(row);
      },
      open(row) {
        var that=this;
        this.$confirm('此操作将覆盖之前pdf文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log("proInfoId00000000000000000",row.idAttr)
          that.proInfoId = row.idAttr;
          // console.log("proInfoId",that.proInfoId)
          that.dialogpdf = true;

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消覆盖PDF'
          });
        });
      },
      //上传pdf
      handleUploadPdf(row) {
        this.proInfoId = row.idAttr;
        this.dialogpdf = true;
        // console.log(row)
        // console.log(this.proInfoId)

      },
      // 单个删除
      handleDelete(index, row) {
        this.$confirm(`此操作将删除产品 , 是否继续?`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dellPro(index, row);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      dellPro(index, row){
        const vm = this;
        console.log('单个删除选择的row：', index, '-----', row);
        let proId = { proId: row.idAttr }
        this.axios.get(api.delPro, { params: proId })
          .then((success) => {
            vm.getList();
            console.log('删除su')
          })
          .catch((error) => {
            console.log('删除fa')
            console.log('error')
          })
        vm.list.splice(index, 1)
      },
      // 批量删除
      handleDelAll() {
        const vm = this;
        console.log('批量删除选择的row：', vm.multipleSelection)
      },
      // 搜索
      handleFilter() {
        this.getList();
      },
      // 操作分页
      handleSizeChange(val) {
        // console.log('--------一页多少条：', val)
        this.listQuery.pageSize = val;
        this.getList();
      },
      // 操作分页
      handleCurrentChange(val) {
        // console.log('--------当前页：', val)
        this.listQuery.currPage = val;
        this.getList();
      },
      //同步官网数据
      synData(){
        var that=this;
        this.axios.get(api.synData)
          .then((suc)=>{
            console.log("suc--------------",suc)
            if(suc.data.code){
              that.getList();
              this.$message({
                message: '同步成功',
                type: 'success'
              });
            }
          })
          .catch((fail)=>{
            this.$message.error("同步失败");
          })
      },
      // 新增
      handleCreate() {
        this.pageName = '新增产品'
        this.dialogFormVisible = true;


        this.product.idAttr = '';
        this.product.classid = '';
        this.product.colour = '';
        this.product.ftitle = '';
        this.product.outputsizemax ='';
        this.product.title = '';
        this.product.outputSpeedColor = '';
        this.product.outputSpeedMono = '';
      },
      // 新增提交
      handleCreateSubmit() {
        const vm = this;
        console.log('新增入参：', vm.product)
        this.axios.post(api.addPro, vm.product).then(suc => {
          console.log('addPro成功')
          vm.getList();
          this.product.idAttr = '';
          this.product.classid = '';
          this.product.colour = '';
          this.product.ftitle = '';
          this.product.outputsizemax = '';
          this.product.title = '';
          this.product.outputSpeedColor = '';
          this.product.outputSpeedMono = ''
        }).catch(err => {
          console.log('addPro失败')
        })

        console.log('新增后', vm.list)

        this.dialogFormVisible = false;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handleDownload() {
        const vm = this;
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel');
          const tHeader = ['字段1', '字段2', '字段3', '字段4', '字段5'];
          const filterVal = ['chnlId', 'hisChnlId', 'chnlName', 'state', 'isavailable'];
          const list = vm.list;
          const data = vm.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '导出的列表excel');
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    }


  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .icon_star{
        position: relative;
    }
    .icon_star::after{
        content: "*";
        display: block;
        position: absolute;
        left: 60px;
        top: 17px;
        color: red;
    }
</style>
