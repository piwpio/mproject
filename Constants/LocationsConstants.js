var raw = {
    1: {
        enemies: {
            wolf: {
                level: 1
            }
        },
        moves: {
            left: 2,
        }
    },

    2: {
        enemies: {
            wolf: {
                level: 2
            }
        },
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
    getAll: function() { return raw; }
};