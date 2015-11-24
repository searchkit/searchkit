import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app/src/App.tsx";
import ESClient from "./domain/ESClient.ts"


const searcher = new ESClient("http://localhost:9200", "movies")		

const render = function(){	
	ReactDOM.render(<App searcher={searcher}/>, document.getElementById('root'));
}

searcher.resultsListener.subscribe(render)
render()