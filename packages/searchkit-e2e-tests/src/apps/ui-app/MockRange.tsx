import * as React from 'react'
import { Panel, RangeSlider, renderComponent } from 'searchkit'

export class MockRange extends React.Component<any, any> {
  constructor(props) {
    super(props)
    const self = this
    this.state = {
      items: [
        { key: 0, doc_count: 0 },
        { key: 1, doc_count: 4 },
        { key: 2, doc_count: 5 },
        { key: 3, doc_count: 6 },
        { key: 4, doc_count: 7 },
        { key: 5, doc_count: 8 },
        { key: 6, doc_count: 0 },
        { key: 7, doc_count: 10 },
        { key: 8, doc_count: 4 },
        { key: 9, doc_count: 2 },
        { key: 10, doc_count: 0 }
      ],
      min: 0,
      max: 10,
      minValue: 2,
      maxValue: 5,
      onChange({ min, max }) {
        self.setState({
          minValue: min,
          maxValue: max
        })
      },
      onFinished({ min, max }) {
        self.setState({
          minValue: min,
          maxValue: max
        })
        console.log('Set range to ', min, ', ', max)
      }
    }
  }

  static defaultProps = {
    rangeComponent: RangeSlider,
    containerComponent: Panel
  }

  render(): React.ReactElement<any> {
    const { title, containerComponent, rangeComponent } = this.props
    return renderComponent(
      containerComponent,
      { title },
      renderComponent(rangeComponent, this.state)
    )
  }
}
