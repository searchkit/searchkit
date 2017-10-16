let beautify = require('js-beautify')

module.exports = {
    test:function(wrapper) {
        return wrapper && wrapper.html
    },

    print(wrapper) {
        return beautify.html(wrapper.html(), { "indent_size": 2 })         
    }
}