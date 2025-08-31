export $(grep -v '^#' .env | xargs)

pm2 start npm --name "vapish" -- run start