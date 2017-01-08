
import {defaults} from 'lodash'

export class PaginationHelper {
  
  currentPage: number
  totalPages: number
  translate: Function
  pages: Array<any>
  lastPage: number
  
  constructor({currentPage, totalPages, translate}){
    this.currentPage = currentPage
    this.totalPages = totalPages
    this.translate = translate
    this.pages = []
    this.lastPage = 0 // Last added page number
  }
  
  push(item){
    this.pages.push(item)
  }
  
  previous(options={}){
    this.push(defaults({
      key: "previous",
      label: this.translate('pagination.previous'),
      page: this.currentPage > 1 ? (this.currentPage - 1) : undefined,
      disabled: this.currentPage === 1
    }, options))
  }
  
  next(options={}){
    this.push(defaults({
      key: "next",
      label: this.translate('pagination.next'),
      page: this.currentPage < this.totalPages - 1 ? (this.currentPage + 1) : undefined,
      disabled: this.currentPage === this.totalPages
    }, options))
  }
  
  page(pageNumber, options={}){
    if (pageNumber > 0 && pageNumber <= this.totalPages){
      this.push(defaults({
        key: pageNumber,
        label: '' + pageNumber,
        page: pageNumber,
        active: pageNumber == this.currentPage
      }, options))
    }
  }
  
  range(minPage, maxPage, options={}){
    const min = Math.max(1, minPage)
    const max = Math.min(maxPage, this.totalPages)
    for(var i=min; i<= max; i++){
      this.page(i, options)
    }
  }
  
  ellipsis(options={}){
    this.push(defaults({ 
      key: "ellipsis-" + this.pages.length, 
      label: '...', 
      disabled: true 
    }, options))
  }
}

export const Paginator = {
  
  full(currentPage, totalPages, translate, pageScope=3){
    const builder = new PaginationHelper({
      currentPage, totalPages, translate
    })
    builder.previous()
    
    // First
    if (currentPage > pageScope + 1) builder.page(1)
    if (currentPage > pageScope + 2) builder.ellipsis()
    
    // Pages
    builder.range(currentPage - pageScope, currentPage-1)
    builder.page(currentPage, {active: true})
    builder.range(currentPage+1, currentPage + pageScope)
    
    // Last ellipsis
    if (currentPage < totalPages - pageScope) builder.ellipsis()
    
    builder.next()
    return builder.pages
  },
  
  relativePages(currentPage, totalPages, translate, pageScope=3){
    const builder = new PaginationHelper({
      currentPage, totalPages, translate
    })
    
    builder.range(currentPage - pageScope, currentPage-1)
    builder.page(currentPage, {active: true})
    builder.range(currentPage+1, currentPage + pageScope)
    
    return builder.pages
  },
  
  previousNext(currentPage, totalPages, translate){
    const builder = new PaginationHelper({
      currentPage, totalPages, translate
    })
    
    builder.previous()
    builder.next()
    
    return builder.pages
  },
  
  build({
      showNumbers=true,
      showPrevious=true, 
      showNext=true, 
      showEllipsis=true, 
      showFirst=true, 
      showLast=false
    }){
    return function(currentPage, totalPages, translate, pageScope=3){
      const builder = new PaginationHelper({
        currentPage, totalPages, translate
      })
      if (showPrevious) builder.previous() 
      if (showNumbers){
        if (showFirst && currentPage > pageScope + 1) builder.page(1)
        if (showEllipsis && currentPage > pageScope + 2) builder.ellipsis()
        
        builder.range(currentPage - pageScope, currentPage-1)
        builder.page(currentPage, {active: true})
        builder.range(currentPage+1, currentPage + pageScope)
        
        const lastEllipsisLimit = showLast ? (totalPages - pageScope - 1) : (totalPages - pageScope)
        if (showEllipsis && currentPage < lastEllipsisLimit) builder.ellipsis()
        if (showLast && (currentPage < totalPages - pageScope)) builder.page(totalPages)
      }
      if (showNext) builder.next()
      return builder.pages
    }
  }
}