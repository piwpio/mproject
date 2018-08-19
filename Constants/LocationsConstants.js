var raw = {
    99999: {},
    1: {
        enemies: [1],
        moves: {
            east: 2,
        }
    },

    2: {
        enemies: [2],
        moves: {
            east: 3,
            west:1
        }
    },

    3: {
        moves: {
            west: 2,
        }
    }
};

module.exports = {
    getAll: function() { return raw; },
    getDeadId: function() { return 99999; }
};