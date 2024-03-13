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
        AWS_ACCESS_KEY_ID: "AKIAZQ3DNYU7UCZRLWU4",
        AWS_SECRET_ACCESS_KEY: "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",
        AWS_REGION: "ap-south-1",
        AWS_BUCKET_NAME: "drodin-image-bucket",
      },
      env_production: {
        NODE_ENV: "production",
        DATABASE_URL:
          "mongodb+srv://abhayasaffron:KqRAMk5kpIsxOzxr@cluster0.trv0pxh.mongodb.net/",
        JWT_SECRET: "ABHAYAKUMARSAHOO",
        AWS_ACCESS_KEY_ID: "AKIAZQ3DNYU7UCZRLWU4",
        AWS_SECRET_ACCESS_KEY: "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",
        AWS_REGION: "ap-south-1",
        AWS_BUCKET_NAME: "drodin-image-bucket",
      },
    },
  ],
};
