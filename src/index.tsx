import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app/src/App.tsx";
import ESClient from "./domain/ESClient.ts"
import StateAccessors from "./domain/StateAccessors"
import { Router, Route, Link } from 'react-router'
import history from "./domain/history.ts"

window["historyRef"] = history


const searcher = new ESClient("http://localhost:9200", "movies")

history.listen((location)=>{
	console.log("location", location)
	searcher.setStateQuery(location.query)
	console.log(location.query)
	console.log(searcher.stateManager.state)
	searcher.search()
})

class Root extends React.Component<any, any> {
	render(){
		return <App searcher={searcher}/>
	}
}

ReactDOM.render((
	<Router history={history}>
		<Route path="/" component={Root}/>
	</Router>
), document.getElementById('root'))
