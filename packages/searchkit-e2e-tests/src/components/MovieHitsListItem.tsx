import * as React from 'react'

export const MovieHitsListItem = (props) => {
  const { bemBlocks, result } = props
  const url = 'http://www.imdb.com/title/' + result._source.imdbId
  const source: any = Object.assign({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa="hit">
      <div className={bemBlocks.item('poster')}>
        <img data-qa="poster" src={result._source.poster} />
      </div>
      <div className={bemBlocks.item('details')}>
        <a href={url} target="_blank">
          <h2
            className={bemBlocks.item('title')}
            dangerouslySetInnerHTML={{ __html: source.title }}
          ></h2>
        </a>
        <h3 className={bemBlocks.item('subtitle')}>
          Released in {source.year}, rated {source.imdbRating}/10
        </h3>
        <div
          className={bemBlocks.item('text')}
          dangerouslySetInnerHTML={{ __html: source.plot }}
        ></div>
      </div>
    </div>
  )
}
