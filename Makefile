# Use bash for command execution for its advanced features like arrays and functions.
SHELL := /bin/bash

# Список папок (через пробел) для очистки командой "clean"
FOLDERS := storage/cache storage/logs www/image/cache

# параметры базы данных
DB_HOST = 127.0.0.1
DB_NAME = opencart
DB_USER = root
DB_PASS = root
TABLES_TO_TRUNCATE = oc_customer_online oc_session
DUMP_FILE = .docker/db-import/dump.sql

# --- Color Codes ---
# Using the 8-bit (256-color) palette for maximum compatibility.
COLOR_GREEN := \e[1;32m
COLOR_PURPLE := \e[0;95m
COLOR_RED := \e[0;31m
COLOR_RESET := \e[0m

# Default target to run when 'make' is called without arguments.
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "============================================================"
	@echo "Docker Environment"
	@echo "------------------------------------------------------------"
#	@echo ""
	@echo "Core Commands:"
	@echo -e "        $(COLOR_GREEN)make up$(COLOR_RESET) - Start all services"
	@echo -e "      $(COLOR_GREEN)make stop$(COLOR_RESET) - Stop all containers"
	@echo -e "      $(COLOR_GREEN)make down$(COLOR_RESET) - Stop and remove all containers"
	@echo -e "     $(COLOR_GREEN)make build$(COLOR_RESET) - Build or rebuild Docker images"
	@echo -e "   $(COLOR_GREEN)make db-dump$(COLOR_RESET) - Dump database"
	@echo -e "$(COLOR_GREEN)make db-restore$(COLOR_RESET) - Restore database"
	@echo ""
	@echo "Links:"
	@echo -e "      $(COLOR_PURPLE)Frontend$(COLOR_RESET) - https://localhost"
	@echo -e "       $(COLOR_PURPLE)Backend$(COLOR_RESET) - https://localhost/admin-127486"
	@echo -e "       $(COLOR_PURPLE)Mailhog$(COLOR_RESET) - http://localhost:8025"
	@echo ""

build:
	docker compose build

up:
	@echo "Starting services..."
	docker compose up -d

stop:
	@echo "Stopping services..."
	docker compose stop

down:
	@echo "Stopping services..."
	docker compose down

db-dump:
	@echo "════════════════════════════════════════════════════════════"
	@echo "Truncating tables in $(DB_NAME)..."
	@for t in $(TABLES_TO_TRUNCATE); do \
    	echo "TRUNCATE TABLE $$t;" | mariadb -h $(DB_HOST) -u $(DB_USER) -p$(DB_PASS) $(DB_NAME); \
    done
	@echo "Dumping database $(DB_NAME) from $(DB_HOST)..."
	@mariadb-dump --add-drop-table -h $(DB_HOST) -u $(DB_USER) -p$(DB_PASS) $(DB_NAME) > $(DUMP_FILE)
	@echo "Dump saved to $(DUMP_FILE)"
	@echo "————————————————————————————————————————————————————————————"

db-restore:
	@echo "════════════════════════════════════════════════════════════"
	@echo -e "   ACTION: $(COLOR_GREEN)restoring database$(COLOR_RESET)"
	@echo -e " DATABASE: $(COLOR_PURPLE)$(DB_NAME)$(COLOR_RESET)"
	@echo -e "     HOST: $(COLOR_PURPLE)$(DB_HOST)$(COLOR_RESET)"
	@echo -n "—————————  Are you sure you want to restore? [y/N] "
	@read -t 10 ans; \
	if [ $$? -ne 0 ]; then \
		echo -e "\n   STATUS: $(COLOR_RED)aborted$(COLOR_RESET) (timeout reached)"; \
	elif [ "$$ans" = "y" ] || [ "$$ans" = "Y" ]; then \
		mariadb -h $(DB_HOST) -u $(DB_USER) -p$(DB_PASS) $(DB_NAME) < $(DUMP_FILE) && \
		echo -e "   STATUS: $(COLOR_GREEN)complete$(COLOR_RESET)"; \
	else \
		echo -e "   STATUS: $(COLOR_RED)aborted$(COLOR_RESET)"; \
	fi
	@echo "————————————————————————————————————————————————————————————"

.PHONY: clean

clean:
	@for dir in $(FOLDERS); do \
		echo "Cleaning $$dir"; \
		find $$dir -mindepth 1 ! -path "$$dir/index.html" -exec rm -rf {} +; \
	done
