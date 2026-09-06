# Elasticsearch Search UI Components
Searchkit is an open source library which helps you build a great search experience with **Elasticsearch**.
Works with Javascript, React, Vue, Angular, and more.


[![npm version](https://badge.fury.io/js/searchkit.svg)](https://badge.fury.io/js/searchkit)  ![Discord Shield](https://discordapp.com/api/guilds/778278262304276521/widget.png?style=shield) [![](https://data.jsdelivr.com/v1/package/npm/searchkit/badge)](https://www.jsdelivr.com/package/npm/searchkit)


[Website](https://www.searchkit.co/) | [Demos](https://www.searchkit.co/demos) | [Documentation](https://www.searchkit.co/docs/getting-started) | [Discord](https://discord.gg/CRuWmSQZQx)

![Alt Text](apps/web/public/overview.gif)

Searchkit provides a Search UI for Elasticsearch or Opensearch. With Searchkit, you can use Instantsearch components like Searchbox, refinement filters and results (and many more!) to build a search experience.

Searchkit is great for anyone who want to build a search experience quickly.

**Searchkit simplifies Search UI with Elasticsearch:**
  - UI Search Components for React, Vue, Angular, and more
  - Searchkit Node API proxies Elasticsearch requests from the browser.
  - Ability to use Elasticsearch Query DSL for advanced queries

## Searchkit AI Bot

[Searchkit](https://codeparrot.ai/oracle?owner=searchkit&repo=searchkit) Bot will help you understand this repository better. You can ask for code examples, installation guide, debugging help and much more.


## Demos
* [Movies Search](https://www.searchkit.co/demo)
* [Semantic Search](https://codesandbox.io/p/sandbox/github/searchkit/searchkit/tree/main/examples/with-semantic-search-nextjs)
* [Geo Search](https://www.searchkit.co/geo-search-demo)
* [Camp Availability Search](https://www.searchkit.co/camping-sites-demo)
* [Autocomplete](https://www.searchkit.co/autocomplete)

## Quick Start Guides
* [Searchkit with Javascript](https://www.searchkit.co/docs/getting-started/with-javascript)
* [Searchkit with React](https://www.searchkit.co/docs/getting-started/with-react)
* [Searchkit with Vue](https://www.searchkit.co/docs/getting-started/with-vue)
* [Searchkit with Angular](https://www.searchkit.co/docs/getting-started/with-angular)

## Tutorials
* [Searchkit with Next.js](https://www.searchkit.co/tutorials/with-nextjs)
* [Semantic Search](https://www.searchkit.co/tutorials/semantic-search)
* [Searchkit with Availability Search](https://www.searchkit.co/tutorials/build-availability-search-ui)

## Codesandbox Examples
* [Searchkit with JS Widgets](https://codesandbox.io/s/github/searchkit/searchkit/tree/main/examples/with-ui-instantsearchjs)
* [Searchkit with Vue](https://codesandbox.io/s/github/searchkit/searchkit/tree/main/examples/with-ui-vue)
* [Searchkit with Next.js](https://codesandbox.io/s/github/searchkit/searchkit/tree/main/examples/with-ui-nextjs-react)
* [Proxy with Express.js](https://codesandbox.io/s/github/searchkit/searchkit/tree/main/examples/proxy-elasticsearch/with-express-typescript-esm)

## Code Examples (on Github)
* [Searchkit with Next.JS](https://github.com/searchkit/searchkit/tree/main/examples/with-ui-nextjs-react)
* [Searchkit with Javascript](https://github.com/searchkit/searchkit/tree/main/examples/with-ui-instantsearchjs)
* [Searchkit with Vue](https://github.com/searchkit/searchkit/tree/main/examples/with-ui-vue)

## Proxy Elasticsearch Quick Starts
* [Searchkit with Next.js Functions](https://www.searchkit.co/docs/proxy-elasticsearch/with-next-js)
* [Searchkit with Cloudflare Workers](https://www.searchkit.co/docs/proxy-elasticsearch/with-cloudflare-workers)
* [Searchkit with Express.js](https://www.searchkit.co/docs/proxy-elasticsearch/with-express-js)

## Video Tutorials
* [Searchkit Intro Video Tutorial with Instantsearch.js](https://www.youtube.com/watch?v=R6iYpEuCdVs)
* [Searchkit Node API Video Tutorial](https://www.youtube.com/watch?v=8ztvn1-VZ_U)

Or checkout our [documentation](https://searchkit.co/docs) for more examples.

## Installation

Either install via npm or yarn

```bash
npm install searchkit @searchkit/api @searchkit/instantsearch-client
```

or via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@searchkit/instantsearch-client@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4"></script>
<script src="https://cdn.jsdelivr.net/npm/searchkit@latest"></script>
```

## Setup Elasticsearch

Searchkit requires Elasticsearch 7.0 or higher or Opensearch 2.4 or higher. 

Below we are using Docker to run Elasticsearch.

```bash
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.6.2
docker network create elastic
docker run --name elasticsearch --net elastic -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "xpack.security.enabled=false" -e http.cors.enabled=true -e "http.cors.allow-origin='*'" -e http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization -e http.cors.allow-credentials=true -e network.publish_host=localhost -e xpack.security.enabled=false docker.elastic.co/elasticsearch/elasticsearch:8.6.2
```

then lets add an index and some data

```bash
curl --location --request PUT 'http://localhost:9200/products' \
--header 'Content-Type: application/json' \
--data-raw '{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "description": {
        "type": "text"
      },
      "price": {
        "type": "integer"
      },
      "categories": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      }
    }
  }
}'

curl --location --request POST 'http://localhost:9200/products/_doc' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Apple iPhone 12 Pro Max",
  "description": "The iPhone 12 Pro Max is the most powerful iPhone ever. It has a 6.7-inch Super Retina XDR display, a Ceramic Shield front cover, and a triple-camera system with a LiDAR scanner. It also has a 5G connection, a 6-core CPU, and a 4-core GPU. The iPhone 12 Pro Max is available in 128GB, 256GB, and 512GB storage options.",
  "categories": ["phones", "apple"],
  "price": 800
}'
 
curl --location --request POST 'http://localhost:9200/products/_doc' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Apple iPhone 12 Pro",
  "description": "The iPhone 12 Pro is the most powerful iPhone ever. It has a 6.1-inch Super Retina XDR display, a Ceramic Shield front cover, and a triple-camera system with a LiDAR scanner. It also has a 5G connection, a 6-core CPU, and a 4-core GPU. The iPhone 12 Pro is available in 128GB, 256GB, and 512GB storage options.",
  "categories": ["phones", "apple"],
  "price": 700
}'
```

## Setup Searchkit

Searchkit compatible with all Instantsearch frameworks. Below is an example using react-instantsearch.

```tsx
import Searchkit from "searchkit"
import Client from '@searchkit/instantsearch-client'

// import your InstantSearch components
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination, RangeInput } from 'react-instantsearch';

const sk = new Searchkit({
  connection: {
    host: 'http://localhost:9200',
    // with an apiKey
    // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-api-key
    // apiKey: '##########'
    // with a username/password
    // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-usernamepassword
    //auth: {
    //  username: "elastic",
    //  password: "changeme"
    //}
  },
  search_settings: {
    search_attributes: [{ field: 'title', weight: 3 }, 'actors', 'plot'],
    result_attributes: ['title', 'actors', 'poster', 'plot'],
    highlight_attributes: ['title'],
    facet_attributes: [
      { attribute: 'actors', field: 'actors.keyword', type: 'string' },
      { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' }
    ]
  }
})

const searchClient = Client(sk);

const App = () => (
  <InstantSearch
    indexName="imdb_movies"
    searchClient={searchClient}
  >
    <SearchBox />
    <div className="left-panel">
      <RefinementList attribute="actors" searchable={true} limit={10} />
      <RangeInput attribute="imdbrating" />
    </div>
    <div className="right-panel">
      <Hits />
      <Pagination />
    </div>
  </InstantSearch>
}
```

follow along with the [Getting Started](https://www.searchkit.co/docs/getting-started/with-react) guide.

## Hide Elasticsearch from the browser

Searchkit Node API allows you to proxy requests to Elasticsearch from the browser. This is useful if you want to hide Elasticsearch from the browser, or if you want to add user permission filters to the query.

* [Searchkit with Next.js Functions](https://www.searchkit.co/docs/proxy-elasticsearch/with-next-js)
* [Searchkit with Cloudflare Workers](https://www.searchkit.co/docs/proxy-elasticsearch/with-cloudflare-workers)
* [Searchkit with Express.js](https://www.searchkit.co/docs/proxy-elasticsearch/with-express-js)

## Query Customisation

Searchkit has an out the box query builder, but you can also customise the query by passing a getQuery function to the apiClient.

```ts
const results = await apiClient.handleRequest(req.body, {
  getQuery: (query, search_attributes) => {
    return [
      {
        combined_fields: {
          query,
          fields: search_attributes,
        },
      },
    ];
  },
});
```

### Semantic Query Search

Searchkit supports KNN query search. Below is an example of a KNN query search.

```ts
  const results = await client.handleRequest(req.body, {
    getKnnQuery(query, search_attributes, config) {
      return {
        field: 'dense-vector-field',
        k: 10,
        num_candidates: 100,
        // supported in latest version of Elasticsearch
        query_vector_builder: { 
          text_embedding: {
            model_id: 'cookie_model',
            model_text: query
          }
        }
      }
    }
  });
  ```

Follow along with the [Semantic Search](https://www.searchkit.co/tutorials/semantic-search) tutorial.

### Advanced Customisation

You can also override the entire query with request hooks. Below is an example of a request hook that adds a rescore query to the first search request.

You can apply this at `beforeSearch` and `afterSearch`.

```ts
  const results = await client.handleRequest(req.body, {
    hooks: {
      beforeSearch: (searchRequests) => {
        const uiRequest = searchRequests[0]
 
        return [
          {
            ...uiRequest,
            body: {
              ...uiRequest.body,
              rescore: {
                window_size: 100,
                query: {
                  rescore_query: {
                    match: {
                      plot: {
                        query: uiRequest.body.query,
                        operator: "and",
                      },
                    },
                  },
                  query_weight: 1,
                  rescore_query_weight: 10,
                }
              }
            }
          },
          searchRequests.slice(1, searchRequests.length)
        ]
        
      },
    }
  });
  ```

read more in the api docs [here](https://www.searchkit.co/docs/api-documentation/searchkit#requestoptions-hooks).

## Query Rules

Query rules allows you to customize the behavior of the search experience. You can use query rules to boost or filter results, or to change the ranking of results, based on a set of conditions.

Below is an example of a query rule that boosts results for movies with Dan Aykroyd or Charlie Sheen, and filters results to only show movies if the query is the word "movie".

```js

{
  id: '1',
  conditions: [
    [
      {
        context: 'query',
        value: 'movie',
        match_type: 'exact'
      }
    ]
  ],
  actions: [
    {
      action: 'QueryBoost',
      query: 'actors:"Dan Aykroyd" OR actors:"Charlie Sheen"',
      weight: 2
    },
    {
      action: 'QueryFilter',
      query: 'type:"movie"'
    }
  ]
}

```

read more at [Query Rules](https://www.searchkit.co/docs/query-rules) docs.

### NPM Packages
* Searchkit [Documentation](https://www.searchkit.co/docs/api-documentation/searchkit)
* @searchkit/api [Documentation](https://www.searchkit.co/docs/api-documentation/api)
* @searchkit/instantsearch-client [Documentation](https://www.searchkit.co/docs/api-documentation/instantsearch-client)

## FAQ

**Q: Do I need to expose Elasticsearch to the public internet?**

Searchkit proxies requests to Elasticsearch.

Searchkit offers both options, either perform the search directly from the browser, or use the Searchkit API to proxy requests to Elasticsearch. Directly from the browser offers great developer experience & prototyping. Once you are ready to deploy, you can use the Searchkit API to proxy requests to Elasticsearch.

**Q: Do I need to use React?**

You can use React, React Native, Vue, Angular. You dont even need to use a frontend framework, you can use plain Javascript and HTML with instantsearch.js widgets.

**Q: Which version of Elasticsearch is supported?**

Searchkit is compatible with Elasticsearch 7.0 and above + Opensearch 2.0 and above.

**Q: Do you support Android and iOS?**

Potentially. Searchkit API mimics the Algolia API, so it should be possible to use the Algolia Instantsearch client with Searchkit API with a few tweaks. If you are interested in this, please let us know.

**Q: Why would I use Searchkit instead of Algolia?**

Elasticsearch has alot of advantages over Algolia. You might want to use Elasticsearch as a cheaper alternative to Algolia, especially if you have a large dataset. You might want to run Elasticsearch on your own infrastructure, or have greater control over the query relevance. 


## 🌐 Web Resources & Interactive Index
- [CATEGORY CONTROLLER 2](https://studyplayings.web.app/category-controller-2.html)
- [EMOJI SMASHER SMILEY GAME](https://ilearnworldjp.pages.dev/emoji-smasher-smiley-game.html)
- [CATEGORY LOGIC538](https://themindzone.pages.dev/category-logic538.html)
- [HIGH HEELS COLLECT RUN](https://studyquests.github.io/high-heels-collect-run.html)
- [NONOGRAM MASTER](https://quizverses.github.io/nonogram-master.html)
- [CATEGORY CASUAL 2](https://quizverses.github.io/category-casual-2.html)
- [CATEGORY RUNNING](https://theskillquest.pages.dev/category-running.html)
- [CATEGORY COLLECT565](https://quizverses.github.io/category-collect565.html)
- [FARM MAHJONG 3D](https://thelearnquesters.pages.dev/farm-mahjong-3d.html)
- [INDEX11](https://themindplays.pages.dev/index11.html)
- [EVONY THE KINGS RETURN](https://themindplaying.web.app/evony-the-kings-return.html)
- [CATEGORY BATTLE 2](https://quizverses.github.io/category-battle-2.html)
- [CLOAK MASTER SHOOTER RUN](https://studyplaying.github.io/cloak-master-shooter-run.html)
- [SUPERHERO DROP AND SAVE](https://thelearnquesters.pages.dev/superhero-drop-and-save.html)
- [MERGE BEASTS](https://thequizzone.pages.dev/merge-beasts.html)
- [FIND THE FROG HIDDEN OBJECTS](https://thequizzone.pages.dev/find-the-frog-hidden-objects.html)
- [CATEGORY CASUAL](https://quizverses-9d2f2.web.app/category-casual.html)
- [OFFROAD LIFE 3D](https://quizverses.github.io/offroad-life-3d.html)
- [PUZZLE BLOCKS FILL IT COMPLETELY](https://studyplaying.github.io/puzzle-blocks-fill-it-completely.html)
- [ZOMBIES WEAPON MERGE 4](https://thequizzone.pages.dev/zombies-weapon-merge-4.html)
- [HAPPY ASMR CARE](https://quizverses.github.io/happy-asmr-care.html)
- [WEST FRONTIER SHARPSHOOTER 3D](https://themindplaying.web.app/west-frontier-sharpshooter-3d.html)
- [3D CHESS MASTER](https://themindplays.pages.dev/3d-chess-master.html)
- [MY PERFECT YEAR PLANNER](https://thequizzone.pages.dev/my-perfect-year-planner.html)
- [CATEGORY 3D1 371](https://studyplayings.web.app/category-3d1-371.html)
- [MERGE MASTER SKIBIDI BOP](https://studyplaying.github.io/merge-master-skibidi-bop.html)
- [AMMO RUSH MASTER](https://learnquesters.pages.dev/ammo-rush-master.html)
- [NUTCRACKER NEW YEARS ADVENTURES](https://thelearnquesters.pages.dev/nutcracker-new-years-adventures.html)
- [PULL THE PINS](https://quizverses.pages.dev/pull-the-pins.html)
- [CATEGORY COOKING46](https://quizverses.pages.dev/category-cooking46.html)
- [BLOXORZ BLOCK PUZZLE 3D](https://thequizzone.pages.dev/bloxorz-block-puzzle-3d.html)
- [ROYAL JEWELS MATCH](https://studyplayings.web.app/royal-jewels-match.html)
- [FOOD TRUCK CHEF](https://themindplay.pages.dev/food-truck-chef.html)
- [CATEGORY ANIMAL](https://studyplayings.web.app/category-animal.html)
- [ANIME DRESS UP DOLL DRESS UP](https://themindplaying.web.app/anime-dress-up-doll-dress-up.html)
- [CATEGORY MAKEUP](https://thequizzone.pages.dev/category-makeup.html)
- [VISUAL MEMORY DRAG DROP](https://quizverses-9d2f2.web.app/visual-memory-drag-drop.html)
- [ROBOCARPOLI](https://themindplaying.web.app/robocarpoli.html)
- [NINJA SPELL MATCH](https://studyplaying.github.io/ninja-spell-match.html)
- [PAPER WARS BATTLES AND UPGRADES](https://thequizzone.pages.dev/paper-wars-battles-and-upgrades.html)
- [FIND THE GHOST CAT](https://quizverses.github.io/find-the-ghost-cat.html)
- [CATEGORY STORY45](https://studyplaying.github.io/category-story45.html)
- [CLASSIC LABYRINTH 3D MAZE](https://learnquester.github.io/classic-labyrinth-3d-maze.html)
- [SAND BLOCK BLAST](https://thequizzone.pages.dev/sand-block-blast.html)
- [OBBY 3D SPRUNKI PARKOUR](https://learnquester.pages.dev/obby-3d-sprunki-parkour.html)
- [THE ROMAN EMPIRE COLOSSEUM](https://learnquester.pages.dev/the-roman-empire-colosseum.html)
- [SURVIVAL ISLAND EVO](https://iskillquest.pages.dev/survival-island-evo.html)
- [INDEX15](https://thequizzone.pages.dev/index15.html)
- [BLOCK DROPPING MERGE](https://themindplaying.web.app/block-dropping-merge.html)
- [TRY TO COUNT THE BOXES BRAIN TRAINING](https://learnquester.pages.dev/try-to-count-the-boxes-brain-training.html)
- [ULTIMATE ROBO DUEL 3D](https://iskillquest.pages.dev/ultimate-robo-duel-3d.html)
- [BIKING EXTREME 3D](https://themindplaying.web.app/biking-extreme-3d.html)
- [AIRWAYS MAZE](https://themindplaying.web.app/airways-maze.html)
- [SKIBRONX RUNNER](https://quizverses.github.io/skibronx-runner.html)
- [CATEGORY POOL 3](https://thequizzone.pages.dev/category-pool-3.html)
- [TANKGANK COM](https://studyplayings.web.app/tankgank-com.html)
- [DRILL QUEST](https://studyplaying.github.io/drill-quest.html)
- [GLOSSY BUBBLES CHALLENGE](https://studyplayings.web.app/glossy-bubbles-challenge.html)
- [BLUE VS RED](https://studyplaying.github.io/blue-vs-red.html)
- [THE WALKING DEADBLOCKS](https://thequizzone.pages.dev/the-walking-deadblocks.html)
- [EXCAVATOR SIMULATOR 3D](https://thelearnquesters.pages.dev/excavator-simulator-3d.html)
- [BIG HEAD](https://thelearnquesters.pages.dev/big-head.html)
- [TWISTED ROPE](https://iskillquest.pages.dev/twisted-rope.html)
- [ONLINE PORTAL](https://cryptotify9.onrender.com/)
- [CATEGORY INCREMENTAL](https://thelearnquesters.pages.dev/category-incremental.html)
- [MR CAPPUCCINO ASSASSINO](https://learnquester.pages.dev/mr-cappuccino-assassino.html)
- [MAGIC BOTTLES](https://thelearnquesters.pages.dev/magic-bottles.html)
- [TYPE SPRINT](https://thelearnquester.web.app/type-sprint.html)
- [NOOB JAILBREAK 2](https://learnquester.pages.dev/noob-jailbreak-2.html)
- [CATEGORY CAR](https://studyplayings.web.app/category-car.html)
- [STICKMAN SHOOTER BROS](https://themindplaying.web.app/stickman-shooter-bros.html)
- [MY PET CARE SALON](https://themindplaying.web.app/my-pet-care-salon.html)
- [INDIAN SUV OFFROAD SIMULATOR](https://thelearnquesters.pages.dev/indian-suv-offroad-simulator.html)
- [CATEGORY STRATEGY](https://thelearnquesters.pages.dev/category-strategy.html)
- [FRUIT NINJA](https://quizverses.github.io/fruit-ninja.html)
- [KINGDOM WARS TD](https://quizverses-9d2f2.web.app/kingdom-wars-td.html)
- [MOTO ATTACK BIKE RACING](https://learnquester.pages.dev/moto-attack-bike-racing.html)
- [CATEGORY DRAWING GAMES](https://studyplayings.pages.dev/category-drawing-games.html)
- [HEROES OF THE ARENA](https://thelearnquesters.pages.dev/heroes-of-the-arena.html)
- [CATEGORY MOUSE](https://studyplayings.pages.dev/category-mouse.html)
- [CATEGORY CARE](https://themindplay.pages.dev/category-care.html)
- [CATEGORY STICKMAN](https://quizverses-9d2f2.web.app/category-stickman.html)
- [BOAT MANIA](https://thelearnquesters.pages.dev/boat-mania.html)
- [INDEX7](https://themindzone.pages.dev/index7.html)
- [BUBBLE CLASSIC](https://thelearnquester.web.app/bubble-classic.html)
- [COZY GARDEN IDLE](https://studyplayings.web.app/cozy-garden-idle.html)
- [CATEGORY PHYSICS371](https://thequizzone.pages.dev/category-physics371.html)
- [ONE HERO](https://studyplayings.web.app/one-hero.html)
- [SWORD AND SPIN](https://quizverses.github.io/sword-and-spin.html)
- [BONNIE FITNESS FRENZY](https://quizverses.github.io/bonnie-fitness-frenzy.html)
- [CATEGORY MMO24](https://themindplay.pages.dev/category-mmo24.html)
- [CATEGORY OBSTACLE299](https://quizverses-9d2f2.web.app/category-obstacle299.html)
- [CATEGORY SCIENCE18](https://thequizzone.pages.dev/category-science18.html)
- [THE SURVEY](https://themindplays.pages.dev/the-survey.html)
- [CATEGORY OBSTACLE](https://quizverses-9d2f2.web.app/category-obstacle.html)
- [PIXEL FLOW](https://iskillquest.pages.dev/pixel-flow.html)
- [STOP THE BULLET](https://themindplaying.web.app/stop-the-bullet.html)
- [MAKE IT BOOM](https://studyplaying.github.io/make-it-boom.html)
- [CATEGORY SCHOOL](https://quizverses-9d2f2.web.app/category-school.html)
- [MAHJONG RIDDLES EGYPT](https://themindplaying.web.app/mahjong-riddles-egypt.html)
- [MANSION STORY MATCH](https://studyplayings.web.app/mansion-story-match.html)
- [DRIFTCLICKER](https://thelearnquester.web.app/driftclicker.html)
- [SLIPPERY DRIFT RACING](https://thequizzone.pages.dev/slippery-drift-racing.html)
- [CATEGORY PROXY](https://quizverses-9d2f2.web.app/category-proxy.html)
- [CINEMA EMPIRE IDLE TYCOON](https://studyplaying.github.io/cinema-empire-idle-tycoon.html)
- [TANK ATTACK 5](https://quizverses.github.io/tank-attack-5.html)
- [FOOD TOWER DEFENSE](https://thelearnquester.web.app/food-tower-defense.html)
- [CRAZY MOTORCYCLE](https://quizverses.github.io/crazy-motorcycle.html)
- [INDEX12](https://quizverses.pages.dev/index12.html)
- [CATEGORY ADVENTURE 2](https://studyplayings.web.app/category-adventure-2.html)
- [SKYHILL ESCAPE FROM THE SKYSCRAPER](https://thequizzone.pages.dev/skyhill-escape-from-the-skyscraper.html)
- [CATEGORY CASUAL 3](https://quizverses.github.io/category-casual-3.html)
- [CATEGORY QUIZ](https://thelearnquesters.pages.dev/category-quiz.html)
- [CATEGORY SECURLY](https://thequizzone.pages.dev/category-securly.html)
- [CATEGORY IDLE CLICKER GAME](https://themindplay.github.io/category-idle-clicker-game.html)
- [CATEGORY THIRD PERSON SHOOTER80](https://iskillquest.pages.dev/category-third-person-shooter80.html)
- [CARNAGE BATTLE ARENA](https://studyplayings.web.app/carnage-battle-arena.html)
- [KING OF THE HILL](https://quizverses.github.io/king-of-the-hill.html)
- [WORD GUESS GAME](https://thelearnquesters.pages.dev/word-guess-game.html)
- [POOL DUEL](https://learnquester.pages.dev/pool-duel.html)
- [CATEGORY CRAFTING45](https://quizverses.github.io/category-crafting45.html)
- [MAGIC FINGER](https://themindplay.pages.dev/magic-finger.html)
- [INDEX40](https://themindzone.pages.dev/index40.html)
- [CATEGORY CONTROLLER 2](https://thequizzone.pages.dev/category-controller-2.html)
- [PERFECT ASMR CLEANING](https://studyplaying.github.io/perfect-asmr-cleaning.html)
- [EASY OBBY JUMP AND RUN CHALLENGE ONLINE](https://quizverses.github.io/easy-obby-jump-and-run-challenge-online.html)
- [CUBICA](https://quizverses.github.io/cubica.html)
- [BLOCK DIGGER](https://thelearnquester.web.app/block-digger.html)
- [PIN PUZZLE LOVE STORY](https://theskillquest.pages.dev/pin-puzzle-love-story.html)
- [ASMR BEAUTY HOMELESS](https://thequizzone.pages.dev/asmr-beauty-homeless.html)
