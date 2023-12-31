module.exports = {
    plugins: [
        ["@babel/plugin-transform-typescript"],
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
    ],
};
