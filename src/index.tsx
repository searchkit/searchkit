import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./App";

import {
	SearchkitManager,
	history,
	SearchkitProvider
} from "./core";
import { Router, Route, Link, Redirect } from 'react-router'

const searchkit = new SearchkitManager("movies")
searchkit.listenToHistory(history)


class Root extends React.Component<any, any> {
	render(){
		return (
			<SearchkitProvider searchkit={searchkit}>
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
