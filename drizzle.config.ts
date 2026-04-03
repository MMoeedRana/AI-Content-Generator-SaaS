import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.tsx',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_EGQ0a3mZPqBx@ep-empty-morning-a1d7dp08-pooler.ap-southeast-1.aws.neon.tech/AI-Content-Generator?sslmode=require&channel_binding=require',
  },
});
