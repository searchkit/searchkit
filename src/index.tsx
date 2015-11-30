import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app/src/App.tsx";
import ESClient from "./domain/ESClient.ts"
import { Router, Route, Link } from 'react-router'
import history from "./domain/history.ts"
import SearchkitProvider from "./components/SearchkitProvider.ts"

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
		return (
			<SearchkitProvider searcher={searcher}>
				<App searcher={searcher}/>
			</SearchkitProvider>
		)
	}
}

ReactDOM.render((
	<Router history={history}>
		<Route path="/" component={Root}/>
	</Router>
), document.getElementById('root'))
