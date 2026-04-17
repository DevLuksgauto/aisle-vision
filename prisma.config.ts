import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const environment = process.env.NODE_ENV || 'development';

const envFiles = {
  development: '.env.dev',
  staging: '.env.hml',
  production: '.env.prod',
};

const envFile = envFiles[environment as keyof typeof envFiles] || '.env.dev';
require('dotenv').config({ path: envFile });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
