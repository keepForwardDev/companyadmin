<style lang="less" scoped>
  @import './common.less';
  @import '~@/plugin/ztree/css/zTreeStyle/zTreeStyle.css';
</style>
<template>
  <div>
    <Card style="height:100%">
      <template>
        <Collapse v-model="search" simple>
          <Panel name="1" ref="panelKey">
            <span style="color: #2D8cF0;">点击收缩查询条件
              <div class="operate">
                <Button @click.stop="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索
                </Button>
                <Button @click.stop="batchDelete()" class="search-btn" type="error"><Icon type="ios-trash"/>&nbsp;&nbsp;删除
                </Button>
                <Button @click.stop="newRes()" class="search-btn" type="success"><Icon type="ios-add-circle"/>&nbsp;&nbsp;新增
                </Button>
              </div>
            </span>
            <div class="search-con search-con-top" slot="content">
              <div class="search-param">
                <span class="title">资源名称：</span>
                <div class="param">
                  <!--<Select v-model="searchKey" class="search-col">
                    <Option v-for="item in searchColumns" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}
                    </Option>
                  </Select>-->
                  <Input v-model="searchParams.name"/>
                </div>
              </div>
              <div class="search-param">
                <span class="title">菜单名称：</span>
                <div class="param">
                  <Input v-model="searchParams.menuName" placeholder="请输入所属菜单"/>
                </div>
              </div>
              <div class="search-param">
                <span class="title">资源编码：</span>
                <div class="param">
                  <Input v-model="searchParams.code" placeholder=""/>
                </div>
              </div>
              <div class="search-param">
                <span class="title">访问地址：</span>
                <div class="param">
                  <Input v-model="searchParams.url" placeholder=""/>
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </template>
      <div class="content">
        <Table :columns="column" :data="tableData" :loading="tableLoading" @on-selection-change="selectChange">
          <template slot-scope="{ row, index }" slot="ope">
            <Button @click="editRes(row)" icon="md-create" type="primary" shape="circle" size="small"
                    title="编辑"></Button> &nbsp;&nbsp;
            <Button @click="deleteResource(row)" icon="ios-trash" type="error" shape="circle" size="small"
                    title="删除"></Button>
          </template>
        </Table>
      </div>
      <div class="pageTool">
        <template>
          <Page :total="pager.total" show-total :current="pager.current" :pageSize="pager.size" show-sizer
                @on-page-size-change="pageSizeChange" @on-change="currentChange" :page-size-opts="pageSize"/>
        </template>
      </div>
      <div class="backup">
        <template>
          <BackTop :height="100" :bottom="200">

          </BackTop>
        </template>
      </div>
    </Card>
    <Modal
      v-model="seeAble"
      width="700px"
      ok-text="保存"
      :loading="loading"
      :scrollable="true"
      @on-ok="saveForm"
      :title="title"
    >
      <Form :model="formItem" :label-width="200" :rules="ruleValidate" ref="Form">
        <Row>
          <Col :span="span">
          <FormItem prop="name">
            <template slot="label">
              <span class="label-item">资源名称</span>
            </template>
            <Input v-model="formItem.name" placeholder="请输入资源名称"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem>
            <template slot="label">
              <span class="label-item">资源链接</span>
            </template>
            <Input v-model="formItem.url" placeholder="请输入资源链接"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem prop="code">
            <template slot="label">
              <span class="label-item">资源编码</span>
            </template>
            <Input v-model="formItem.code" placeholder="请输入唯一编码"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem>
            <template slot="label">
              <span class="label-item">资源描述</span>
            </template>
            <Input v-model="formItem.description" placeholder="请输入资源描述" type="textarea"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem>
            <template slot="label">
              <span class="red-star">*</span>
              <span class="label-item">所属菜单</span>
            </template>
            <template>
              <!--<Tree :data="tableData" ref="tree"></Tree>-->
              <ul id="tree1" class="ztree" style="width:230px; overflow:auto;"></ul>
            </template>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem>
            <template slot="label">
              <span class="label-item">排序号</span>
            </template>
            <InputNumber v-model="formItem.sort" placeholder="请输入排序号" size="large"></InputNumber>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal
      v-model="deleteAble"
      width="300px"
      :draggable="true"
      :loading="deleteLoading"
      @on-ok="confirmDelete" title="确认">
      是否确认删除？
    </Modal>
  </div>
</template>
<script>
  import {getMenuResources, getTree, saveResource, deleteResource} from '@/api/menu'
  import {sloveErr} from '@/libs/util'
  import '@/plugin/ztree/js/jquery-1.4.4.min.js'
  import '@/plugin/ztree/js/jquery.ztree.all.js'
  import { checNotNull } from '@/libs/validate'
  export default {
    name: 'sys_res',
    components: {},
    data() {
      return {
        searchColumns: [
          {
            key: 'name',
            title: '资源名称'
          },
          {
            key: 'menuName',
            title: '所属菜单'
          },
          {
            key: 'code',
            title: '资源编码'
          },
          {
            key: 'url',
            title: '资源链接'
          }
        ],
        span: 20,
        searchParams: {
          name: '',
          menuName: '',
          code: '',
          url: ''
        },
        search: '1',
        loading: true,
        seeAble: false,
        deleteAble: false,
        deleteLoading: false,
        tableLoading: true,
        deleteId: '',
        title: '新增',
        column: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '资源名称',
            key: 'name'
          },
          {
            title: '资源链接',
            key: 'url',
          },
          {
            title: '资源编码',
            key: 'code'
          },
          {
            title: '描述',
            key: 'description'
          },
          {
            title: '所属菜单',
            key: 'menuName'
          },
          {
            title: '排序号',
            key: 'sort'
          },
          {
            title: '操作',
            slot: 'ope',
            width: 150,
            align: 'center'
          }
        ],
        tableData: [],
        treeData: [],
        select: [],
        ruleValidate: {
          name: checNotNull(),
          code: checNotNull()
        },
        formItem: {
          id: '',
          name: '',
          code: '',
          url: '',
          description: '',
          sort: 0,
          menuId: ''

        },
        pager: {
          current: 1,
          total: 0,
          size: 15
        },
        pageSize: [15, 30, 45, 60],
        setting: {
          data: {
            simpleData: {
              enable: true,
              idKey: 'id',
              pidKey: 'parentId',
              rootId: 'null'
            }
          },
          callback: {
            beforeClick: function (treeId, treeNode, clickFlag) {
              var treeObj = $.fn.zTree.getZTreeObj("tree1")
              var nodes = treeObj.getSelectedNodes()
              if (nodes.length > 0) {
                treeObj.cancelSelectedNode(nodes[0])
                if (nodes[0].id === treeNode.id) {
                  return false
                }
              }
              return true
            }
          }
        }

      }
    },
    methods: {
      getData() {
        this.tableLoading = true
        let params = Object.assign({}, this.searchParams, this.pager)
        getMenuResources(params).then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.data.records
            this.pager.total = res.data.data.total
            this.pager.current = res.data.data.current
          } else {
            this.$Message.error(res.data.msg)
          }
          this.tableLoading = false
        }).catch(err => {
          sloveErr(err, this)
          this.tableLoading = false
        })
      },
      handleSearch() {
        this.$refs['panelKey'].isActive = false
        this.getData()
      },
      pageSizeChange(pageSize) {
        this.pager.size = pageSize
        this.handleSearch()
      },
      currentChange(current) {
        this.pager.current = current
        this.handleSearch()
      },
      newRes() {
        this.title = '新增'
        this.formItem = {
          id: '',
          name: '',
          code: '',
          url: '',
          description: '',
          sort: 0,
          menuId: ''

        }
        this.seeAble = true
      },
      editRes(row) {
        this.title = '编辑'
        this.formItem = {
          id: row.id,
          name: row.name,
          code: row.code,
          url: row.url,
          description: row.description,
          sort: row.sort,
          menuId: row.menuId

        }
        setTimeout(() => {
          this.$refs['Form'].validate()
          var treeObj = $.fn.zTree.getZTreeObj('tree1')
          var node = treeObj.getNodeByParam('id', row.menuId, null)
          treeObj.selectNode(node)
        }, 500)
        this.seeAble = true
      },
      selectChange(selection) {
        var array = new Array()
        for (var i in selection) {
          array.push(selection[i].id)
        }
        this.select = array
      },
      saveForm() {
        this.loading = true
        var treeObj = $.fn.zTree.getZTreeObj('tree1')
        var nodes = treeObj.getSelectedNodes()
        if (nodes.length>0) {
          this.formItem.menuId = nodes[0].id
        } else {
          this.$Message.warning('请选择所属菜单!')
          this.recoverBtn()
          return
        }
        this.$refs['Form'].validate(valid => {
          if (valid) {
            saveResource(this.formItem).then(res => {
              if (res.data.code === 1) {
                this.$Message.success(res.data.msg)
                this.seeAble = false
                this.getZtree()
                this.handleSearch()
              } else {
                this.$Message.error(res.data.msg)
                this.recoverBtn()
              }
            }).catch(err => {
              sloveErr(err, this)
              this.recoverBtn()
            })
          } else {
            this.recoverBtn()
          }
        })
      },
      recoverBtn() {
        setTimeout(() => {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }, 1000)
      },
      deleteResource (row) {
        this.deleteAble = true
        this.deleteId = row.id
      },
      batchDelete () {
        if (this.select.length === 0) {
          this.$Message.warning('请勾选需要删除的数据!')
          return
        }
        this.deleteId = this.select.join(',')
        this.deleteAble = true
      },
      confirmDelete() {
        var params= {
          id: this.deleteId
        }
        deleteResource(params).then(res => {
          this.$Message.success(res.data.msg)
          this.getZtree()
          this.handleSearch()
        }).catch(err => {
          sloveErr(err, this)
        })
      },
      getZtree() {
        getTree().then(res => {
          if (res.data.code === 1) {
            $.fn.zTree.init($("#tree1"), this.setting, res.data.data)
          } else if (res.data.code === -1) {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          sloveErr(err, this)
        })
      }

    },
    mounted() {
      this.$refs['panelKey'].isActive = false
    },
    created() {
      this.getData()
      this.getZtree()
    }
  }
</script>
