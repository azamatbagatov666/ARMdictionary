export $(grep -v '^#' .env | xargs)

pm2 start vapish