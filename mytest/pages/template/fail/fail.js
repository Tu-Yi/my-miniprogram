var fail = {
  onReflash : function (pages) {
    if (pages.length != 0) {
      pages[pages.length - 1].onLoad()
    }
  }
}
export default fail

