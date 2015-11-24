import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app/src/App.tsx";
import ESClient from "./domain/ESClient.ts"

ReactDOM.render(<App/>, document.getElementById('root'));


var client = new ESClient("http://localhost:9200", "movies")

client.setQuery({})

client.search().then(function(results){
	console.log(results)
})