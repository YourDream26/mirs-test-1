const MinifyPlugin = require('babel-minify-webpack-plugin');
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );

const env = process.env.NODE_ENV;

const config = {

  mode: env || 'development',
	entry: './src/app.js',
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'main.bundle.js'
	},

  module: {
    rules: [
      { 
      	test: /\.js$/,
      	exclude: /(node_modules)/,
      	use: { 
      		loader: 'babel-loader',
      		options: {
	      		presets: ['es2015']
      		} 
      	}
      },
      {
      	test: /\.css$/, 
      	use: [ 'style-loader', 'css-loader' ]
			}
    ]
  },


  plugins: [
  	new MinifyPlugin( ),
    new HtmlWebpackPlugin({
    	template: 'index.html' 
    })
  ]

}


module.exports = config;