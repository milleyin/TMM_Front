var list = {};

bridge = {

    add: function(id, fn) {

        list[id] = fn;

    },

    fire: function(id) {

        if (list[id]) {
            var result = list[id]();
            delete list[id];
            return result;
        }

    }

}

module.exports = bridge;
