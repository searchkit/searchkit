import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app/src/App.tsx";
import ESClient from "./domain/ESClient.ts"
import StateAccessors from "./domain/StateAccessors"
import { Router, Route, Link } from 'react-router'


ReactDOM.render((
	<Router>
		<Route path="/" component={App}/>
	</Router>
), document.getElementById('root'))