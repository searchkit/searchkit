import {Component} from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app/src/App";

import SearchkitManager from "./domain/new/SearchkitManager";
import { Router, Route, Link, Redirect } from 'react-router'
import history from "./domain/history"
import SearchkitProvider from "./domain/new/SearchkitProvider"

const searchkit = new SearchkitManager("movies")
searchkit.listenToHistory(history)


class Root extends Component<any, any> {
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
