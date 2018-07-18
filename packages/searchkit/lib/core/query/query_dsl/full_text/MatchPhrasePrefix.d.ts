export declare function MatchPhrasePrefix(query: any, str: any): {
    "match_phrase_prefix": {
        [x: number]: {
            query: any;
            boost: number;
        };
    };
};
