module.exports = {
	mode: 'development', // or 'production'
	entry: './js/index.js',
	output: {
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
};
