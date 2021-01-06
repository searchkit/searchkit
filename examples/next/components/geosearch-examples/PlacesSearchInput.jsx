import {
  EuiSuggest
} from "@elastic/eui"
import { useState } from 'react'


export default () => {
  const [list, setList] = useState([{
    type: { iconType: 'search', color: 'tint10' },
    label: 'test'
  }])

  const updateQuery = async (value) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=AIzaSyCnxbEhpVqsd7m-dDGb3mJrFEnZFSKdKOU&types=geocode`)
    const results = response.json()
    console.log(results)
  }

  return (
    <EuiSuggest suggestions={list} onInputChange={(target) => {
      updateQuery(target.value)
    }} />
  )
}
