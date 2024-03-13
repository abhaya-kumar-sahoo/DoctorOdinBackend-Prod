module.exports = {
  apps: [
    {
      name: "doctorodinbackend",
      script: "./dist/server.js", // Path to your compiled JavaScript file
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        DATABASE_URL:
          "mongodb+srv://abhayasaffron:KqRAMk5kpIsxOzxr@cluster0.trv0pxh.mongodb.net/",
        JWT_SECRET: "ABHAYAKUMARSAHOO",
        AWS_ACCESS_KEY_ID: "AKIAZQ3DNYU7STIP5TOE",
        AWS_SECRET_ACCESS_KEY: "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",
        AWS_REGION: "ap-south-1",
        AWS_BUCKET_NAME: "drodin-image-bucket",
      },
      env_production: {
        NODE_ENV: "production",
        DATABASE_URL:
          "mongodb+srv://abhayasaffron:KqRAMk5kpIsxOzxr@cluster0.trv0pxh.mongodb.net/",
        JWT_SECRET: "ABHAYAKUMARSAHOO",
        AWS_ACCESS_KEY_ID: "AKIAZQ3DNYU7STIP5TOE",
        AWS_SECRET_ACCESS_KEY: "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",
        AWS_REGION: "ap-south-1",
        AWS_BUCKET_NAME: "drodin-image-bucket",
      },
    },
  ],
};
