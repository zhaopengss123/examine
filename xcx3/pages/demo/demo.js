Page({
  data: {
    multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']],
    multiIndex: [0, 0]
  },
 

  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: [['无脊柱动物', '脊柱动物'], ['22', '33']],
      multiIndex: this.data.multiIndex
    };

    this.setData(data)


    
  }

})