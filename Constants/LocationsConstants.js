var raw = {
    1: {
        id: 1,
        terrain: 'forest', // terrain type
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
        id: 2,
        terrain: 'forest',
        enemies: {
            wolf: {
                level: 2
            }
        },
        moves: {
            left: 1,
            right:3
        }
    },
    3: {
        id: 3,
        terrain: 'forest',
        moves: {
            right: 2,
        }
    }
};

module.exports = {
    getAll: function() { return raw; }
};