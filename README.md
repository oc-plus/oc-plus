# OpenCart

[![GitHub License](https://img.shields.io/github/license/oc-plus-plus/opencart?color=green)](https://github.com/oc-plus-plus/opencart/blob/main/LICENSE)
[![coding standards](https://github.com/oc-plus-plus/opencart/actions/workflows/coding-standards.yml/badge.svg)](https://github.com/oc-plus-plus/opencart/actions/workflows/coding-standards.yml)
[![static analysis](https://github.com/oc-plus-plus/opencart/actions/workflows/static-analysis.yml/badge.svg)](https://github.com/oc-plus-plus/opencart/actions/workflows/static-analysis.yml)


## Contents
- [About](#about)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Upgrade](#upgrade) 
- [Local Development with Docker](#local-development-with-docker)
  - [Using Make](#using-make)
  - [Using Docker CLI](#or-using-docker-cli)
  - [Docker Environment](#docker-environment)
  - [SSL Configuration](#ssl-configuration)
  - [Disabling SSL](#disabling-ssl)
  - [Profiling with XDebug](#profiling-with-xdebug)
- [Code Quality](#code-quality)
- [Credits & Sources](#credits--sources)
- [License](#license)


## About
**OpenCart** is a free open source ecommerce platform for online merchants. OpenCart provides a professional and reliable foundation to build a successful online store.


## System Requirements
- **Web Server**: Apache 2.x.x.  
  While operation on Nginx + PHP-FPM is theoretically possible, it has not been tested yet.
- **Database Server**: Current versions of MariaDB or MySQL.  
  We have not yet tested with other database systems, and compatibility is not guaranteed.
- **PHP**: 8.1 – 8.5 _(PHP 8.4 is recommended)_.
- **PHP Settings**:
  - `max_execution_time` = 150 
  - `max_input_time` = 180 
  - `memory_limit` = 256M (at least 384M recommended for developers)
- **Required PHP Extensions**: the following extensions are required. Most of these are likely already enabled on your server:
  `fileinfo`, `mysqli`, `openssl`, `simplexml`, `zip`, `json`, `ctype`, `curl`, `dom`, `gd`, `iconv`, `intl`, `mbstring`, `session`, `tokenizer`, `xml`, `xmlwriter`. 


## Installation
1. **Check Requirements**: Ensure your server environment meets all the system requirements listed above.
2. **Prepare the Database** (MariaDB or MySQL):
   - Create a new empty database.
   - Assign (or create) a database user with full privileges (CREATE, DROP, etc.) for this database.
   - Note down your database credentials: Hostname (or IP), Username, Password, and Database Name.
3. **Upload Files**: Extract the downloaded `link_to_full_installation_archive` archive into the root directory of your virtual web host (the folder accessible via the Internet at your domain address).
4. **Run Installer**: Open your web browser and navigate to https://your-domain.com.
5. **Follow Instructions**: The web installer will launch automatically; follow the on-screen steps to complete the setup.
6. **Post-Installation**: Once the installation is finished, manually **delete the /install folder** for security reasons.


## Upgrade

> [!CAUTION]
>
> ### ATTENTION! Please read carefully before proceeding with the upgrade!

1. **Version Compatibility**: upgrade package is designed **strictly for OpenCart 4.1.0.3**.
2. **Unsupported Versions**: upgrade package is incompatible with any other versions of OpenCart, including the official `master` branch or any other `4.x.x.x` releases.
3. **Pre-requisite**: If you are running an older version of OpenCart, you must first upgrade to version 4.1.0.3 before applying this upgrade package.
4. **BETA Software Warning**: This is a BETA release. While it has been tested on live stores, bugs may still exist.
   Do not use this on a production site unless you have the technical expertise to troubleshoot and resolve issues quickly.
5. **Extension Compatibility**: this upgrade package has been tested with various extensions, including major frameworks like
   Journal and MazaEngine, and no issues were found. If it worked on clean OpenCart 4.1.0.3, it should work on this.
   However, since several libraries (including jQuery) have been updated, some legacy extensions might require updates or replacements.

> [!CAUTION]
>
> ### VERY IMPORTANT!
> Before starting the upgrade procedure, **you MUST create a full backup** of your database and all website files.
> You must ensure that you have the means to quickly restore your website to its original state (pre-upgrade)
> should any issues arise.

### Quick Upgrade Guide

1. **Extract Core Files**: Unpack the `link_to_upgrade_archive` archive directly into your
   web host's root directory, overwriting all existing OpenCart 4.1.0.3 files.
2. **Handle Storage/Vendor Files**: Since OpenCart 4 requires moving the `/system/storage` folder after the
   initial installation, the updated vendor libraries are provided as a separate part of the package.
3. **Update Vendor Directory**: Locate your current `/storage` folder (wherever you moved it during setup).
   Extract the contents of the `link_to_upgrade_vendor_archive` update package into this folder,
   ensuring all files within the existing `/vendor` directory are overwritten.
4. **Clear Caches**: Log in to your Admin Panel. Go to Dashboard -> Developer Settings
   (the gear icon in the top right corner) and refresh/clear: System Cache, Image Cache, and SASS.
5. **Verification**: Check both the storefront and the Admin Panel.
   If the steps were followed correctly, everything should be fully functional.

**Note on Database**: The database structure remains unchanged and is fully compatible with OpenCart 4.1.0.3. No update scripts are required—simply replace the files, and you are ready to go.

**Troubleshooting**: If critical issues occur (e.g., the site becomes inaccessible) and you cannot identify the cause, restore your site using the backup you created before starting the upgrade.


## Local Development with Docker

> [!IMPORTANT]
>
> **For Windows Users:**
> It is **strongly recommended** to use the WSL 2 (Windows Subsystem for Linux) backend for Docker Desktop.
> **You should clone this project _inside_ your WSL distribution (e.g., Ubuntu 24.04) for best performance.**
> Access your project via `\\wsl$\Ubuntu-24.04\home\youruser\opencart` from Windows Explorer if needed.
> Without WSL 2, file system performance will be extremely slow, making the application nearly unusable.
> Docker Desktop will typically prompt you to enable WSL 2 during installation.

> [!NOTE]
>
> - The `make` commands are only available on Linux / macOS / Windows WSL 2.
> - To use `make db-dump` or `make db-restore`, you must have `mariadb-client` or `mysql-client` installed.

### Using Make
- Start all services
    ```bash
    make up
    ```
- Stop all services
    ```bash
    make down
    ```
- Dump database: the dump will be saved to `.docker/db-import/dump.sql`
    ```bash
    make db-dump
    ```
- Restore a saved database dump
    ```bash
    make db-restore
    ```

### Or using Docker CLI
- Start all services
    ```bash
    docker-compose up -d
    ```

### Docker Environment

The project environment will be available at the following addresses:
- **Storefront**: https://localhost
  - Login: `user@example.com`
  - Password: `testuser`
- **Administration**: https://localhost/admin
  - Login: `admin`
  - Password: `admin`
  - Email: `test@example.com`
- **Mailpit** (Email Testing): http://localhost:8025
- **Database** (MariaDB):
   - Host: `mysql`
   - Username: `root`
   - Password: `root`
   - Database Name: `opencart`
- **Logs**: all service logs (Web server, PHP, etc.) are accessible in the `.docker/log` directory for easy debugging.

> [!NOTE]
>
> **No Installation Required**  
> Once the Docker services are up and running, you get a fully functional OpenCart instance immediately.

> [!IMPORTANT]
>
> **Environment Compatibility**  
> The main Docker container is based on Alpine Linux.
> Please note that GLOB_BRACE is not supported in the Alpine/musl environment.
> Avoid using this flag in your extensions. As a built-in workaround, you can use the oc_glob() emulator provided in this repository.

### SSL Configuration
The project is configured to use **SSL (HTTPS)** by default. To prevent browser connection errors, please choose one of the following options:
- **Install CA Certificate** _(recommended)_: Import the CA certificate located at `.docker/web/ssl/ca.crt` into your operating system's trusted store.
- **Or use Custom Certificates**: Replace the existing `.docker/web/ssl/localhost.crt` and `.docker/web/ssl/localhost.key` with your own generated certificates for `localhost`.

### Disabling SSL
If you prefer to use standard HTTP, you can disable SSL by modifying the following configuration files:
- `www/config.php`: change `https` to `http` on line 6.
- `www/admin/config.php`: change `https` to `http` on lines 6 and 7.

After these changes, the store will be accessible via http://localhost and http://localhost/admin.

### Profiling with XDebug

You can perform detailed profiling using XDebug to analyze the performance of all subsystems and identify bottlenecks.

> [!NOTE]
>
> **Analysis Tools**  
> To analyze the generated logs, use specialized software such as:  
> [PhpStorm](https://www.jetbrains.com/phpstorm/), [PHP Profiler for VS Code](https://marketplace.visualstudio.com/items?itemName=DEVSENSE.profiler-php-vscode), [KCachegrind](https://kcachegrind.github.io/html/Home.html), [WinCacheGrind](https://sourceforge.net/projects/wincachegrind/),  
> or similar tools.

> [!IMPORTANT]
>
> **Don't leave XDebug running in profiling mode** all the time!  
> it negatively affects performance and generates a lot of LOG files, cluttering up your disk.

1. **Enable XDebug**
	- **uncomment all lines** in the configuration file `.docker/web/config/xdebug.ini`
	- **rebuild container**: run the following command:
	  ```bash
	  make down && make build && make up
	  ```
2. Sequentially open in your browser all the necessary pages on which you want to analyze performance  
   (e.g., Homepage: https://localhost).
3. **Disable XDebug**
	- **comment all lines** (by `;`) in the configuration file `.docker/web/config/xdebug.ini`
	- **rebuild container**: run the following command:
	  ```bash
	  make down && make build && make up
	  ```
4. **Done**: the detailed profiling log will be available at:  
   `.docker/log/xdebug/cachegrind.out.XX.gz`  
   You can now open this file in your preferred analysis tool to inspect the performance data.


## Code Quality
To maintain high code quality and prevent hidden regressions, we use **PHPStan** for static analysis
and **PHP-CS-Fixer** for coding standards enforcement.
It is highly recommended to run these **Full Check** before submitting any changes.

### Prerequisites:
- PHP 8.1 – 8.5
- Composer

### Run the analysis
You can run the full suite or individual checks using the following commands:
- **Full Check** (Runs both CS and Static Analysis):
    ```bash
    composer check
    ```
- **Coding Standards Check**:
    ```bash
    composer cs-check
    ```
- **Coding Standards Fix** (Automatically fixes formatting issues):
    ```bash
    composer cs-fix
    ```
- **Static Analysis** (Runs PHPStan):
    ```bash
    composer static-analysis
    ```

## Credits & Sources
To ensure transparency and acknowledge the work of the community, direct links to original sources or discussions
are provided in the [CHANGELOG] for any borrowed or ported code.

Modifications without a specific link were developed within this repository.


## License
[GNU General Public License v.3]


[OpenCart 4.1.0.3]: https://github.com/opencart/opencart/releases/tag/4.1.0.3
[CHANGELOG]: https://github.com/oc-plus-plus/oc-plus-plus/blob/main/CHANGELOG.md
[GNU General Public License v.3]: https://github.com/opencart-lts/oc4/blob/main/LICENSE
