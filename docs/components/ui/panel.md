# Panel
This is a titled Panel component which can be collapsed, it is the default `containerComponent` used by our filter components


```jsx
import  {Panel} from "Searchkit"

const PanelExample ()=> (
  <Panel title="My Panel" collapsable={true} defaultCollapsed={false}>
    <p>my content...</p>
  </Panel>
)

```


## Props
  - `title` *(string)*  - the title of the panel
  - `collapsable` *(boolean)* - Whether the panel can be collapsed (defaults to false)
  - `defaultCollapsed` *(boolean) - Whether the panel can be collapsed (defaults to true when collapsable = true)
