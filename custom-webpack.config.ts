import { EnvironmentPlugin } from 'webpack';
import { config } from 'dotenv';

config();

console.log(process);

module.exports = {
  plugins: [
    new EnvironmentPlugin({
      '$API_KEY':null
    })
  ]
}
