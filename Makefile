run-backend:
	cd backend && go run ./cmd/api/main.go

run-frontend:
	cd frontend && npm run dev

run-compile-backend-prod:
	sudo systemctl stop nadi
	cd backend && go build -o main ./cmd/api/main.go
	sudo systemctl start nadi

run-build-frontend-prod:
	cd frontend && npm run build

run-migration:
	cd backend && go run ./cmd/migrate/migrate.go

run-seeder:
	cd backend && go run ./cmd/seeder/main.go

run-worker:
	cd backend && go run ./cmd/worker/main.go

generate:
	cd backend && go run ./cmd/generator/main.go -config $(config) -base .

docker-up:
	docker-compose up -d --build

docker-down:
	docker-compose down

docker-build:
	docker-compose build --no-cache

docker-logs:
	docker-compose logs -f

docker-logs-backend:
	docker-compose logs -f backend

docker-logs-frontend:
	docker-compose logs -f frontend

docker-migrate:
	docker-compose exec backend ./migrate

docker-seed:
	docker-compose exec backend ./seeder