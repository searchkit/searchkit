import express from 'express';
import Client from '@searchkit/api';
import 'isomorphic-unfetch';
const app = express();
const config = {
    connection: {
        host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
    },
    search_settings: {
        highlight_attributes: ['title'],
        search_attributes: [{ field: 'title', weight: 3 }, 'actors', 'plot'],
        result_attributes: ['title', 'actors', 'poster', 'plot'],
        facet_attributes: [
            'type',
            { attribute: 'actors', field: 'actors.keyword', type: 'string' },
            'rated',
            { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' },
            { attribute: 'metascore', type: 'numeric', field: 'metascore' }
        ],
        sorting: {
            default: {
                field: '_score',
                order: 'desc'
            },
            _rated_desc: {
                field: 'rated',
                order: 'desc'
            }
        },
        snippet_attributes: ['plot'],
        query_rules: []
    }
};
const apiClient = Client(config);
app.use(express.json());
app.post('/api/search', async function (req, res) {
    const response = await apiClient.handleRequest(req.body);
    res.send(response);
});
app.listen(3001, () => {
    console.log('Server running on port 3000');
});
