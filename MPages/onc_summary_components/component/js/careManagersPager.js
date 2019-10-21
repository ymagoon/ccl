CareManagersPager = (function() {

  /**
   * Public Constructor to initialize a Pager.
   * @param {Number} total_results: A total count used to calculate the number of pages.
   * @param {Number} pageSize: The size of each page used to calculate the number of pages.
   * @param {Function} pageCallback: A callback to handle paging events.
   */
  function Pager(total_results, pageSize, pageCallback) {
    var pager = new MPageUI.Pager()
      .setCurrentPageLabelPattern("${currentPage} / ${numberPages}")
      .setPreviousLabel(CareManagers.i18n.PREVIOUS)
      .setNextLabel(CareManagers.i18n.NEXT)
      .setWrap(false)
      .setNumberPages(Math.ceil(total_results / pageSize))
      .setOnPageChangeCallback(pageCallback);

    // Save a reference to the page size.
    pager.pageSize = pageSize;

    // Add to the public api.
    pager.update = update;
    pager.numberPages = numberPages;

    return pager;
  }

  /**
   * Update the number of pages based on a new total and re-render.
   */
  function update(total_results) {
    this.setNumberPages(Math.ceil(total_results / this.pageSize));
    this.setCurrentPage(this.m_currentPage);
  }

  function numberPages() {
    return this.m_numberPages;
  }

  return Pager;
})();
