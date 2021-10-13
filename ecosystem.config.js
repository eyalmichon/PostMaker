module.exports = {
  apps: [{
    name: "postMaker",
    script: "./index.js",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log: "./logs/out_err.log",
    // restart service every day once at 2:30
    cron_restart: "30 2 * * *",
    max_memory_restart: "2G"
  }]
}
