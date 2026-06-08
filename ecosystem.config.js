module.exports = {
  apps: [
    {
      name: 'sahinaja-prod',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 'max', // Utilizes all 4 cores of Contabo VPS
      exec_mode: 'cluster', // Cluster mode for zero-downtime reloads and load balancing
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
