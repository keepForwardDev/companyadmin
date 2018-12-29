<style lang="less">
  @import './common.less';
</style>
<template>
  <div>
    <Card style="height:100%">
      <template>
        <Collapse v-model="search" simple>
          <Panel name="1" ref="panelKey">
            <span style="color: #2D8cF0;">点击展开查询条件
              <div class="operate">
                <Button @click.stop="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索
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
        <Table :columns="column" :data="tableData">
          <template slot-scope="{ row, index }" slot="operate">
            <Button @click="editRes" icon="md-create" type="primary" shape="circle" size="small"
                    title="编辑"></Button> &nbsp;&nbsp;
            <Button @click="deleteRes" icon="ios-trash" type="error" shape="circle" size="small"
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

  </div>
</template>
<script>
  import {getMenuResources, getTree} from '@/api/menu'
  import {sloveErr} from '@/libs/util'
  import '@/plugin/ztree/js/jquery-1.4.4.min.js'
  import '@/plugin/ztree/js/jquery.ztree.all.js'

  export default {
    name: '',
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
        searchParams: {
          name: '',
          menuName: '',
          code: '',
          url: ''
        },
        search: '1',
        loading: true,
        seeAble: false,
        title: '新增',
        column: [
          {
            title: '资源名称',
            key: 'name'
          },
          {
            title: '资源链接',
            key: 'url'
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
            slot: 'operate',
            width: 150,
            align: 'center'
          }
        ],
        tableData: [],
        formItem: {
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
        pageSize: [15, 30, 45, 55],
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
              var treeObj = $.fn.zTree.getZTreeObj("tree");
              var nodes = treeObj.getSelectedNodes();
              if (nodes.length > 0) {
                treeObj.cancelSelectedNode(nodes[0]);
              }
              return true
            }
          }
        }

      }
    },
    methods: {
      getData() {
        let params = Object.assign({}, this.searchParams, this.pager)
        getMenuResources(params).then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.data.records
            this.pager.total = res.data.data.total
            this.pager.current = res.data.data.current
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          sloveErr(err, this)
        })
      },
      handleSearch() {
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
        this.seeAble = true
      },
      editRes(row) {
        this.title = '编辑'
        this.seeAble = true
      },
      deleteRes(row) {

      },
      saveForm() {

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
      this.getData()
      setTimeout(() => {
        this.$refs['panelKey'].isActive = false
      }, 100)
    }
  }
</script>
