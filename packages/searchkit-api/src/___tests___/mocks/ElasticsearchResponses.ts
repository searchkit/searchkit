export const HitsResponseWithFacetFilter = {
  took: 2,
  responses: [
    {
      took: 2,
      timed_out: false,
      _shards: {
        total: 1,
        successful: 1,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 1,
          relation: "eq",
        },
        max_score: 7.637228,
        hits: [
          {
            _index: "imdb_movies",
            _id: "tt0111161",
            _score: 7.637228,
            _source: {
              actors: [
                "Tim Robbins",
                "Morgan Freeman",
                "Bob Gunton",
                "William Sadler",
              ],
              title: "The Shawshank Redemption",
            },
            highlight: {
              title: [
                "The <ais-highlight-0000000000>Shawshank</ais-highlight-0000000000> Redemption",
              ],
            },
          },
        ],
      },
      aggregations: {
        rated: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: "R",
              doc_count: 1,
            },
          ],
        },
        actors: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: "Bob Gunton",
              doc_count: 1,
            },
            {
              key: "Morgan Freeman",
              doc_count: 1,
            },
            {
              key: "Tim Robbins",
              doc_count: 1,
            },
            {
              key: "William Sadler",
              doc_count: 1,
            },
          ],
        },
        type: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: "movie",
              doc_count: 1,
            },
          ],
        },
      },
      status: 200,
    },
    {
      took: 2,
      timed_out: false,
      _shards: {
        total: 1,
        successful: 1,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 1,
          relation: "eq",
        },
        max_score: 7.637228,
        hits: [
          {
            _index: "imdb_movies",
            _id: "tt0111161",
            _score: 7.637228,
            _source: {
              actors: [
                "Tim Robbins",
                "Morgan Freeman",
                "Bob Gunton",
                "William Sadler",
              ],
              title: "The Shawshank Redemption",
            },
            highlight: {
              title: [
                "The <ais-highlight-0000000000>Shawshank</ais-highlight-0000000000> Redemption",
              ],
            },
          },
        ],
      },
      aggregations: {
        type: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: "movie",
              doc_count: 1,
            },
          ],
        },
      },
      status: 200,
    },
  ],
};

export const HitsWithNoQueryOrFiltersResponse = {
  took: 5,
  responses: [
    {
      took: 5,
      timed_out: false,
      _shards: {
        total: 1,
        successful: 1,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 4162,
          relation: "eq",
        },
        max_score: 1,
        hits: [
          {
            _index: "imdb_movies",
            _id: "tt0111161",
            _score: 1,
            _source: {
              actors: [
                "Tim Robbins",
                "Morgan Freeman",
                "Bob Gunton",
                "William Sadler",
              ],
              title: "The Shawshank Redemption",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0068646",
            _score: 1,
            _source: {
              actors: [
                "Marlon Brando",
                "Al Pacino",
                "James Caan",
                "Richard S. Castellano",
              ],
              title: "The Godfather",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0468569",
            _score: 1,
            _source: {
              actors: [
                "Christian Bale",
                "Heath Ledger",
                "Aaron Eckhart",
                "Michael Caine",
              ],
              title: "The Dark Knight",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0944947",
            _score: 1,
            _source: {
              actors: [
                "Peter Dinklage",
                "Lena Headey",
                "Maisie Williams",
                "Emilia Clarke",
              ],
              title: "Game of Thrones",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0110912",
            _score: 1,
            _source: {
              actors: [
                "Tim Roth",
                "Amanda Plummer",
                "Laura Lovelace",
                "John Travolta",
              ],
              title: "Pulp Fiction",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0137523",
            _score: 1,
            _source: {
              actors: [
                "Edward Norton",
                "Brad Pitt",
                "Helena Bonham Carter",
                "Meat Loaf",
              ],
              title: "Fight Club",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0167260",
            _score: 1,
            _source: {
              actors: [
                "Noel Appleby",
                "Alexandra Astin",
                "Sean Astin",
                "David Aston",
              ],
              title: "The Lord of the Rings: The Return of the King",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt1375666",
            _score: 1,
            _source: {
              actors: [
                "Leonardo DiCaprio",
                "Joseph Gordon-Levitt",
                "Ellen Page",
                "Tom Hardy",
              ],
              title: "Inception",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0120737",
            _score: 1,
            _source: {
              actors: [
                "Alan Howard",
                "Elijah Wood",
                "Noel Appleby",
                "Sean Astin",
              ],
              title: "The Lord of the Rings: The Fellowship of the Ring",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0133093",
            _score: 1,
            _source: {
              actors: [
                "Keanu Reeves",
                "Laurence Fishburne",
                "Carrie-Anne Moss",
                "Hugo Weaving",
              ],
              title: "The Matrix",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0071562",
            _score: 1,
            _source: {
              actors: [
                "Al Pacino",
                "Robert Duvall",
                "Diane Keaton",
                "Robert De Niro",
              ],
              title: "The Godfather: Part II",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0108052",
            _score: 1,
            _source: {
              actors: [
                "Liam Neeson",
                "Ben Kingsley",
                "Ralph Fiennes",
                "Caroline Goodall",
              ],
              title: "Schindler's List",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0109830",
            _score: 1,
            _source: {
              actors: [
                "Tom Hanks",
                "Rebecca Williams",
                "Sally Field",
                "Michael Conner Humphreys",
              ],
              title: "Forrest Gump",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0903747",
            _score: 1,
            _source: {
              actors: [
                "Bryan Cranston",
                "Anna Gunn",
                "Aaron Paul",
                "Dean Norris",
              ],
              title: "Breaking Bad",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0167261",
            _score: 1,
            _source: {
              actors: [
                "Bruce Allpress",
                "Sean Astin",
                "John Bach",
                "Sala Baker",
              ],
              title: "The Lord of the Rings: The Two Towers",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0076759",
            _score: 1,
            _source: {
              actors: [
                "Mark Hamill",
                "Harrison Ford",
                "Carrie Fisher",
                "Peter Cushing",
              ],
              title: "Star Wars: Episode IV - A New Hope",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0114369",
            _score: 1,
            _source: {
              actors: [
                "Morgan Freeman",
                "Andrew Kevin Walker",
                "Daniel Zacapa",
                "Brad Pitt",
              ],
              title: "Se7en",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0080684",
            _score: 1,
            _source: {
              actors: [
                "Mark Hamill",
                "Harrison Ford",
                "Carrie Fisher",
                "Billy Dee Williams",
              ],
              title: "Star Wars: Episode V - The Empire Strikes Back",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt1345836",
            _score: 1,
            _source: {
              actors: [
                "Christian Bale",
                "Gary Oldman",
                "Tom Hardy",
                "Joseph Gordon-Levitt",
              ],
              title: "The Dark Knight Rises",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0099685",
            _score: 1,
            _source: {
              actors: [
                "Robert De Niro",
                "Ray Liotta",
                "Joe Pesci",
                "Lorraine Bracco",
              ],
              title: "Goodfellas",
            },
          },
        ],
      },
      aggregations: {
        imdbrating$_stats: {
          count: 4162,
          min: 5.099999904632568,
          max: 9.899999618530273,
          avg: 7.61511294157788,
          sum: 31694.100062847137,
        },
        actors: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 15816,
          buckets: [
            {
              key: "Naveen Andrews",
              doc_count: 73,
            },
            {
              key: "Jennifer Carpenter",
              doc_count: 56,
            },
            {
              key: "Michael C. Hall",
              doc_count: 56,
            },
            {
              key: "Emilie de Ravin",
              doc_count: 53,
            },
            {
              key: "Jared Padalecki",
              doc_count: 49,
            },
            {
              key: "Jensen Ackles",
              doc_count: 49,
            },
            {
              key: "Hugh Laurie",
              doc_count: 41,
            },
            {
              key: "Julie Benz",
              doc_count: 40,
            },
            {
              key: "Henry Ian Cusick",
              doc_count: 39,
            },
            {
              key: "Omar Epps",
              doc_count: 36,
            },
          ],
        },
        imdbrating$_entries: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 2240,
          buckets: [
            {
              key: 7.800000190734863,
              doc_count: 227,
            },
            {
              key: 7.599999904632568,
              doc_count: 210,
            },
            {
              key: 7.400000095367432,
              doc_count: 209,
            },
            {
              key: 8.100000381469727,
              doc_count: 199,
            },
            {
              key: 7.699999809265137,
              doc_count: 197,
            },
            {
              key: 8,
              doc_count: 185,
            },
            {
              key: 7.300000190734863,
              doc_count: 182,
            },
            {
              key: 7.900000095367432,
              doc_count: 173,
            },
            {
              key: 7.5,
              doc_count: 171,
            },
            {
              key: 7.199999809265137,
              doc_count: 169,
            },
          ],
        },
        type: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: "movie",
              doc_count: 3120,
            },
            {
              key: "episode",
              doc_count: 521,
            },
            {
              key: "series",
              doc_count: 473,
            },
            {
              key: "game",
              doc_count: 48,
            },
          ],
        },
      },
      status: 200,
    },
  ],
};

export const HitsResponseWithFacetFilterAndNumericFacet = {
  took: 2,
  responses: [
    {
      took: 2,
      timed_out: false,
      _shards: {
        total: 1,
        successful: 1,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 1,
          relation: "eq",
        },
        max_score: 7.637228,
        hits: [
          {
            _index: "imdb_movies",
            _id: "tt0111161",
            _score: 7.637228,
            _source: {
              actors: [
                "Tim Robbins",
                "Morgan Freeman",
                "Bob Gunton",
                "William Sadler",
              ],
              title: "The Shawshank Redemption",
            },
            highlight: {
              title: [
                "The <ais-highlight-0000000000>Shawshank</ais-highlight-0000000000> Redemption",
              ],
            },
          },
        ],
      },
      aggregations: {
        imdbrating$_stats: {
          count: 1,
          min: 9.300000190734863,
          max: 9.300000190734863,
          avg: 9.300000190734863,
          sum: 9.300000190734863,
        },
        imdbrating$_entries: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: 9.300000190734863,
              doc_count: 1,
            },
          ],
        },
      },
      status: 200,
    },
    {
      took: 2,
      timed_out: false,
      _shards: {
        total: 1,
        successful: 1,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 1,
          relation: "eq",
        },
        max_score: 7.637228,
        hits: [
          {
            _index: "imdb_movies",
            _id: "tt0111161",
            _score: 7.637228,
            _source: {
              actors: [
                "Tim Robbins",
                "Morgan Freeman",
                "Bob Gunton",
                "William Sadler",
              ],
              title: "The Shawshank Redemption",
            },
            highlight: {
              title: [
                "The <ais-highlight-0000000000>Shawshank</ais-highlight-0000000000> Redemption",
              ],
            },
          },
        ],
      },
      aggregations: {
        type: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: "movie",
              doc_count: 1,
            },
          ],
        },
      },
      status: 200,
    },
  ],
};

export const HitsResponseWithFacetFilterAndNumericFacetAndNumericFilter = {
  took: 2,
  responses: [
    {
      took: 0,
      timed_out: false,
      _shards: {
        total: 1,
        successful: 1,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 0,
          relation: "eq",
        },
        max_score: null,
        hits: [],
      },
      aggregations: {
        imdbrating$_stats: {
          count: 0,
          min: null,
          max: null,
          avg: null,
          sum: 0,
        },
        actors: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [],
        },
        imdbrating$_entries: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [],
        },
        type: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [],
        },
      },
      status: 200,
    },
    {
      took: 2,
      timed_out: false,
      _shards: {
        total: 1,
        successful: 1,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 4162,
          relation: "eq",
        },
        max_score: 1,
        hits: [
          {
            _index: "imdb_movies",
            _id: "tt0111161",
            _score: 1,
            _source: {
              actors: [
                "Tim Robbins",
                "Morgan Freeman",
                "Bob Gunton",
                "William Sadler",
              ],
              title: "The Shawshank Redemption",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0068646",
            _score: 1,
            _source: {
              actors: [
                "Marlon Brando",
                "Al Pacino",
                "James Caan",
                "Richard S. Castellano",
              ],
              title: "The Godfather",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0468569",
            _score: 1,
            _source: {
              actors: [
                "Christian Bale",
                "Heath Ledger",
                "Aaron Eckhart",
                "Michael Caine",
              ],
              title: "The Dark Knight",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0944947",
            _score: 1,
            _source: {
              actors: [
                "Peter Dinklage",
                "Lena Headey",
                "Maisie Williams",
                "Emilia Clarke",
              ],
              title: "Game of Thrones",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0110912",
            _score: 1,
            _source: {
              actors: [
                "Tim Roth",
                "Amanda Plummer",
                "Laura Lovelace",
                "John Travolta",
              ],
              title: "Pulp Fiction",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0137523",
            _score: 1,
            _source: {
              actors: [
                "Edward Norton",
                "Brad Pitt",
                "Helena Bonham Carter",
                "Meat Loaf",
              ],
              title: "Fight Club",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0167260",
            _score: 1,
            _source: {
              actors: [
                "Noel Appleby",
                "Alexandra Astin",
                "Sean Astin",
                "David Aston",
              ],
              title: "The Lord of the Rings: The Return of the King",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt1375666",
            _score: 1,
            _source: {
              actors: [
                "Leonardo DiCaprio",
                "Joseph Gordon-Levitt",
                "Ellen Page",
                "Tom Hardy",
              ],
              title: "Inception",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0120737",
            _score: 1,
            _source: {
              actors: [
                "Alan Howard",
                "Elijah Wood",
                "Noel Appleby",
                "Sean Astin",
              ],
              title: "The Lord of the Rings: The Fellowship of the Ring",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0133093",
            _score: 1,
            _source: {
              actors: [
                "Keanu Reeves",
                "Laurence Fishburne",
                "Carrie-Anne Moss",
                "Hugo Weaving",
              ],
              title: "The Matrix",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0071562",
            _score: 1,
            _source: {
              actors: [
                "Al Pacino",
                "Robert Duvall",
                "Diane Keaton",
                "Robert De Niro",
              ],
              title: "The Godfather: Part II",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0108052",
            _score: 1,
            _source: {
              actors: [
                "Liam Neeson",
                "Ben Kingsley",
                "Ralph Fiennes",
                "Caroline Goodall",
              ],
              title: "Schindler's List",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0109830",
            _score: 1,
            _source: {
              actors: [
                "Tom Hanks",
                "Rebecca Williams",
                "Sally Field",
                "Michael Conner Humphreys",
              ],
              title: "Forrest Gump",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0903747",
            _score: 1,
            _source: {
              actors: [
                "Bryan Cranston",
                "Anna Gunn",
                "Aaron Paul",
                "Dean Norris",
              ],
              title: "Breaking Bad",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0167261",
            _score: 1,
            _source: {
              actors: [
                "Bruce Allpress",
                "Sean Astin",
                "John Bach",
                "Sala Baker",
              ],
              title: "The Lord of the Rings: The Two Towers",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0076759",
            _score: 1,
            _source: {
              actors: [
                "Mark Hamill",
                "Harrison Ford",
                "Carrie Fisher",
                "Peter Cushing",
              ],
              title: "Star Wars: Episode IV - A New Hope",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0114369",
            _score: 1,
            _source: {
              actors: [
                "Morgan Freeman",
                "Andrew Kevin Walker",
                "Daniel Zacapa",
                "Brad Pitt",
              ],
              title: "Se7en",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0080684",
            _score: 1,
            _source: {
              actors: [
                "Mark Hamill",
                "Harrison Ford",
                "Carrie Fisher",
                "Billy Dee Williams",
              ],
              title: "Star Wars: Episode V - The Empire Strikes Back",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt1345836",
            _score: 1,
            _source: {
              actors: [
                "Christian Bale",
                "Gary Oldman",
                "Tom Hardy",
                "Joseph Gordon-Levitt",
              ],
              title: "The Dark Knight Rises",
            },
          },
          {
            _index: "imdb_movies",
            _id: "tt0099685",
            _score: 1,
            _source: {
              actors: [
                "Robert De Niro",
                "Ray Liotta",
                "Joe Pesci",
                "Lorraine Bracco",
              ],
              title: "Goodfellas",
            },
          },
        ],
      },
      aggregations: {
        imdbrating$_stats: {
          count: 4162,
          min: 5.099999904632568,
          max: 9.899999618530273,
          avg: 7.61511294157788,
          sum: 31694.100062847137,
        },
        imdbrating$_entries: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 2240,
          buckets: [
            {
              key: 7.800000190734863,
              doc_count: 227,
            },
            {
              key: 7.599999904632568,
              doc_count: 210,
            },
            {
              key: 7.400000095367432,
              doc_count: 209,
            },
            {
              key: 8.100000381469727,
              doc_count: 199,
            },
            {
              key: 7.699999809265137,
              doc_count: 197,
            },
            {
              key: 8,
              doc_count: 185,
            },
            {
              key: 7.300000190734863,
              doc_count: 182,
            },
            {
              key: 7.900000095367432,
              doc_count: 173,
            },
            {
              key: 7.5,
              doc_count: 171,
            },
            {
              key: 7.199999809265137,
              doc_count: 169,
            },
          ],
        },
      },
      status: 200,
    },
  ],
};
