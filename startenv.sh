while IFS='=' read -r name value; do
  # Skip empty lines and comments
  [ -z "$name" ] && continue
  [[ "$name" =~ ^# ]] && continue
  
  export "$name"="$value"
done < .env

nohup npm run start &