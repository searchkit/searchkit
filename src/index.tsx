import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app/src/App.tsx";

import ESClient from "./domain/ESClient.ts"
import { Router, Route, Link } from 'react-router'
import history from "./domain/history.ts"
import SearchkitProvider from "./components/SearchkitProvider.ts"

const searcher = new ESClient("http://localhost:9200", "assets")

searcher.listenToHistory(history)


class Root extends React.Component<any, any> {
	render(){
		return (
			<SearchkitProvider searcher={searcher}>
				<App/>
			</SearchkitProvider>
		)
	}
}


ReactDOM.render((
	<Router history={history}>
		<Route path="/movies-app" component={Root}/>
	</Router>
), document.getElementById('root'))
