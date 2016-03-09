
const defaults = require("lodash/defaults")

export function generatePages(currentPage, totalPages, options) {
  const {
    showNumbers=true,
    pageScope=3,
    showNext=true,
    showPrevious=true,
    showLast=true
  } = options

  var pages = []

  if (showPrevious) pages.push({
    type: "previous",
    page: currentPage > 1 ? (currentPage - 1) : undefined,
    disabled: currentPage === 1
  })
  if (showNumbers){
    if (currentPage > pageScope + 1) pages.push({ type: "number", page: 1 })
    if (currentPage > pageScope + 2) pages.push({ type: "ellipsis" })
    if (currentPage > 1) {
      const min = Math.max(1, currentPage - pageScope)
      for (let i = min; i < currentPage; i++) pages.push({ type: "number", page: i })
    }
    pages.push({ type: "number", page: currentPage, active: true })
    if (currentPage < totalPages) {
      const max = Math.min(currentPage + pageScope, totalPages)
      for (let i = currentPage + 1; i <= max; i++) pages.push({ type: "number", page: i })
    }
    const lastEllipsisLimit = showLast ? (totalPages - pageScope - 1) : (totalPages - pageScope)
    if (currentPage < lastEllipsisLimit) pages.push({ type: "ellipsis" })
    if (showLast && (currentPage < totalPages - pageScope)) pages.push({ type: "number", page: totalPages })
  }
  if (showNext) pages.push({
    type: "next",
    page: currentPage < totalPages - 1 ? (currentPage + 1) : undefined,
    disabled: currentPage === totalPages
  })

  return pages
}
