docker build -t dockerquark/journal-web-prod:latest -t dockerquark/journal-web-prod:$SHA -f ./web/Dockerfile ./web
docker build -t dockerquark/journal-api-prod:latest -t dockerquark/journal-api-prod:$SHA -f ./api/Dockerfile ./api

# echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_ID" --password-stdin

docker push dockerquark/journal-web-prod:latest
docker push dockerquark/journal-api-prod:latest

docker push dockerquark/journal-web-prod:$SHA
docker push dockerquark/journal-api-prod:$SHA

kubectl apply -f k8-config

kubectl set image deployment/web-deployment client=dockerquark/journal-web-prod:$SHA
kubectl set image deployment/web-deployment client=dockerquark/journal-api-prod:$SHA