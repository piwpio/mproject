var raw = {
    99999: {},
    1: {
        enemies: [1],
        moves: {
            left: 2,
        }
    },

    2: {
        enemies: [2],
        moves: {
            left: 3,
            right:1
        }
    },

    3: {
        moves: {
            right: 2,
        }
    }
};

module.exports = {
    getAll: function() { return raw; },
    getDeadId: function() { return 99999; }
};