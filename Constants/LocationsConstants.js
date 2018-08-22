var raw = {
    99999: {},
    1: {
        enemies: [1],
        moves: {
            west: 2,
        }
    },

    2: {
        enemies: [2],
        moves: {
            west: 3,
            east: 1
        }
    },

    3: {
        moves: {
            east: 2,
        }
    }
};

module.exports = {
    getAll: function() { return raw; },
    getDeadId: function() { return 99999; }
};