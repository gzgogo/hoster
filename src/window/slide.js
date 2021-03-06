const mokit = require('mokit');
const template = require('../common/template');
const utils = require('ntils');
const dialog = remote.dialog;
const ipcRenderer = require('electron').ipcRenderer;

module.exports = new mokit.Component({
  template: template('.slide'),

  props: {
    selectedItem: null,
    editItem: null,
    list: {
      value: []
    },
    filtrateList() {
      return this.list.filter(item => !item.hidden);
    }
  },

  //编辑一项
  edit(item) {
    if (item && item.type == 'remote') return;
    this.editItem = item;
  },

  //选择一项
  select(item) {
    this.selectedItem = item;
  },

  //添加一项
  add() {
    let item = {
      id: utils.newGuid(),
      type: 'local',
      name: '新配置',
      content: '',
      checked: true
    };
    this.list.push(item);
    this.select(item);
    this.edit(item);
  },

  //移除
  remove(item, event) {
    if (event) event.stopPropagation();
    let result = dialog.showMessageBox(null, {
      type: 'question',
      buttons: ['删除', '取消'],
      defaultId: 0,
      cancelId: 1,
      message: '删除配置',
      detail: `确认删除 "${item.name}" 吗？`
    });
    if (result == 1) return;
    let index = this.list.findIndex(i => i == item);
    this.list.splice(index, 1);
  },

  manifest() {
    let manifestItem = this.list.find(item => item.type == 'manifest');
    if (!manifestItem) {
      manifestItem = {
        id: utils.newGuid(),
        type: 'manifest',
        name: '远程清单',
        content: '',
        checked: false,
        hidden: true
      };
      this.list.push(manifestItem);
    }
    this.selectedItem = manifestItem;
  }

});