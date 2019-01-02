<style lang="less" scoped>
  @import '../menu/common.less';
  @import '~@/plugin/ztree/css/zTreeStyle/zTreeStyle.css';
</style>
<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <div class="search-param">
          <span class="title">角色名称：</span>
          <div class="param">
            <!--<Select v-model="searchKey" class="search-col">
              <Option v-for="item in searchColumns" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}
              </Option>
            </Select>-->
            <Input v-model="searchParams.name"/>
          </div>
        </div>
        <div class="search-param">
          <span class="title">角色编码：</span>
          <div class="param">
            <Input v-model="searchParams.code"/>
          </div>
        </div>
        <Button @click="handleSearch" class="search-btn" type="primary">
          <Icon type="search"/>&nbsp;&nbsp;搜索
        </Button>
        <div class="operate">
          <Poptip
            confirm
            title="确定删除吗？"
            @on-popper-show="checkSelected"
            placement="bottom"
            @on-ok="batchDelete()">
            <Button class="search-btn" type="error">
              <Icon type="ios-trash"/>&nbsp;&nbsp;删除
            </Button>
          </Poptip>
          <Button @click.stop="add()" class="search-btn" type="success">
            <Icon type="ios-add-circle"/>&nbsp;&nbsp;新增
          </Button>
        </div>
      </div>
      <div class="content">
        <Table :columns="columns" :data="tableData" :loading="tableLoading" @on-selection-change="selectChange">
          <template slot-scope="{ row, index }" slot="ope">
            <Button @click="editBtn(row)" icon="md-create" type="primary" shape="circle" size="small"
                    title="编辑"></Button> &nbsp;&nbsp;
            <Poptip
              confirm
              title="确定删除吗？"
              @on-ok="ok(row)">
              <Button icon="ios-trash" type="error" shape="circle" size="small"
                      title="删除"></Button>
            </Poptip>
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
              <span class="label-item">角色名称</span>
            </template>
            <Input v-model="formItem.name" placeholder="请输入角色名称"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem prop="code">
            <template slot="label">
              <span class="label-item">角色编码</span>
            </template>
            <Input v-model="formItem.code" placeholder="请输入角色唯一编码"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem>
            <template slot="label">
              <span class="label-item">资源描述</span>
            </template>
            <Input v-model="formItem.description" placeholder="请输入角色描述" type="textarea"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="span">
          <FormItem>
            <template slot="label">
              <span class="label-item">授予菜单</span>
            </template>
            <template>
              <!--<Tree :data="tableData" ref="tree"></Tree>-->
              <ul id="tree" class="ztree" style="width:230px; overflow:auto;"></ul>
            </template>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="24">
          <!--<Table :columns="columns" :data="tableData" :loading="tableLoading" @on-selection-change="selectChange">

           </Table>-->
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import '@/plugin/ztree/js/jquery-1.4.4.min.js'
  import '@/plugin/ztree/js/jquery.ztree.all.js'
  import {getRoleList, deleteRole, saveRole} from '@/api/system'
  import {getTree} from '@/api/menu'
  import {checNotNull} from '@/libs/validate'
  import {sloveErr} from '@/libs/util'

  export default {
    name: 'sys_role',
    components: {},
    data() {
      return {
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '角色名称',
            key: 'name'
          },
          {
            title: '角色编码',
            key: 'code'
          },
          {
            title: '角色描述',
            key: 'description'
          },
          {
            title: '创建人',
            key: 'createUser'
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '操作',
            slot: 'ope',
            width: 150,
            align: 'left'
          }
        ],
        searchKey: '',
        tableLoading: true,
        loading: true,
        seeAble: false,
        title: '新增',
        span: 20,
        formItem: {
          id: '',
          name: '',
          code: '',
          description: ''
        },
        ruleValidate: {
          name: checNotNull(),
          code: checNotNull()
        },
        tableData: [],
        select: [], // 被选中的数据
        pager: {
          current: 1,
          total: 0,
          size: 15
        },
        pageSize: [15, 30, 45, 60],
        searchParams: {
          name: '',
          code: ''
        },
        setting: {
          data: {
            simpleData: {
              enable: true,
              idKey: 'id',
              pidKey: 'parentId',
              rootId: 'null'
            }
          },
          check: {
            enable: true,
          },
          callback: {
            beforeClick: function (treeId, treeNode, clickFlag) {
              var treeObj = $.fn.zTree.getZTreeObj("tree");
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
      handleSearch() {
        this.getData()
      },
      getData() {
        this.tableLoading = true
        let params = Object.assign({}, this.searchParams, this.pager)
        getRoleList(params).then(res => {
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
      pageSizeChange(pageSize) {
        this.pager.size = pageSize
        this.handleSearch()
      },
      currentChange(current) {
        this.pager.current = current
        this.handleSearch()
      },
      batchDelete() {

      },
      add() {
        this.seeAble = true
        this.formItem = {
          id: '',
          name: '',
          code: '',
          description: ''
        }
      },
      editBtn(row) {
        this.title = '编辑'
        this.formItem = {
          id: row.id,
          name: row.name,
          code: row.code,
          description: row.description
        }
        setTimeout(() => {
          this.$refs['Form'].validate()
        }, 500)
        this.seeAble = true
      },
      ok(row) {
        var params = {
          ids: row.id
        }
        deleteRole(params).then(res => {
          if (res.data.code === 1) {
            this.$Message.success(res.data.msg)
            this.handleSearch()
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          sloveErr(err, this)
        })
      },
      batchDelete() {
        if (this.select.length === 0) {
          this.$Message.warning('请勾选需要删除的数据!')
          return
        }
        var params = {
          id: this.select.join(',')
        }
        this.ok(params)
      },
      checkSelected() {
        if (this.select.length === 0) {
          this.$Message.warning('请勾选需要删除的数据!')
          return false
        }
        return true
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
        this.$refs['Form'].validate(valid => {
          if (valid) {
            saveRole(this.formItem).then(res => {
              if (res.data.code === 1) {
                this.$Message.success(res.data.msg)
                this.seeAble = false
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
      getZtree() {
        getTree().then(res => {
          if (res.data.code === 1) {
            $.fn.zTree.init($("#tree"), this.setting, res.data.data);
          } else if (res.data.code === -1) {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          sloveErr(err, this)
        })
      }
    },
    mounted() {

    },
    created() {
      this.handleSearch()
      this.getZtree()
    }
  }
</script>
