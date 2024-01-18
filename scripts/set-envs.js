const { writeFileSync, mkdirSync} = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';

const envFileContent = `
  export const environment = {
    api_url: "${process.env.API_URL}",
    mapbox_api_key: "${process.env.MAPBOX_API_KEY}"
  }
`;

mkdirSync('./src/environments', { recursive: true });

writeFileSync(targetPath, envFileContent);
