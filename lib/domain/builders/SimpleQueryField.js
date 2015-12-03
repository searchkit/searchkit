var SimpleQueryField = (function () {
    function SimpleQueryField() {
        this.query = {};
    }
    SimpleQueryField.prototype.set = function (query) {
        this.query = {
            bool: { must: [{
                        "simple_query_string": {
                            "query": query,
                            "default_operator": "and"
                        }
                    }] }
        };
    };
    return SimpleQueryField;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimpleQueryField;
//# sourceMappingURL=SimpleQueryField.js.map