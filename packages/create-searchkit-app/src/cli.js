import inquirer from 'inquirer';
import { connect, getApplicationFields } from "./index.mjs"
import 'isomorphic-unfetch'

async function run() {
  const answers = await inquirer.prompt(
   [
    {
      type: 'input',
      name: 'host',
      message: 'Enter your Elasticsearch host',
      default: 'http://localhost:9200'
    },
    {
      type: 'input',
      name: 'username',
      message: 'Enter your Elasticsearch username',
      default: 'elastic-admin'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your Elasticsearch password',
      default: 'elastic-password'
    },
    {
      type: 'input',
      name: 'indexName',
      message: 'indexName',
      default: 'imdb_movies'
    }
   ]
  );

  await connect(
    {
      host: answers.host,
      username: answers.username,
      password: answers.password
    },
    answers.indexName,
    "_search",
  );
  console.log();
  console.log("Connection successful");
  console.log();
  const fields = await getApplicationFields({
    connection: {
      host: answers.host,
      username: answers.username,
      password: answers.password
    },
    indexName: answers.indexName,
  });

  const configAnswers = await inquirer.prompt(
    [
     {
       type: 'checkbox',
       name: 'searchableFields',
       message: 'Choose searchable fields',
       choices: fields.searchable.map((field) => `${field.label} (${field.type})`)
     },
     {
        type: 'checkbox',
        name: 'resultFields',
        message: 'Choose result fields',
        choices: fields.result
     },
     {
        type: 'checkbox',
        name: 'facetableFields',
        message: 'Choose facet fields',
        choices: fields.facetable.map((field) => `${field.label} (${field.type})`)
      }
    ]
   );

}

run().catch((err) => {
  console.error(err);
  process.exit(1);
})