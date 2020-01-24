import * as React from 'react'

export const MovieHitsGridItem = (props) => {
  const { bemBlocks, result } = props
  const url = 'http://www.imdb.com/title/' + result._source.imdbId
  const source: any = Object.assign({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa="hit">
      <a href={url} target="_blank">
        <img
          data-qa="poster"
          className={bemBlocks.item('poster')}
          src={result._source.poster}
          width="170"
          height="240"
        />
        <div
          data-qa="title"
          className={bemBlocks.item('title')}
          dangerouslySetInnerHTML={{ __html: source.title }}
        ></div>
      </a>
    </div>
  )
}
