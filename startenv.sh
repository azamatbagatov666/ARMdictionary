export $(grep -v '^#' .env | xargs)

nohup npm run start &