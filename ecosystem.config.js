module.exports = {
  apps: [
    {
      name: 'startpage',
      script: './server.js',
      cwd: '/opt/1panel/www/sites/startepages1/startpage',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '128M',
      env: {
        NODE_ENV: 'production',
        PORT: 7776
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
}
