const config = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000
  },
  db: {
    uri: process.env.MONGODB_URI
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10)
  }
};

export default config;