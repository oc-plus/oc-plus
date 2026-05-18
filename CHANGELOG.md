# Changelog 

All notable changes to this project will be documented in this file.    
Detailed changes can see in the [repository log](https://github.com/oc-plus-plus/oc-plus-plus/commits/opencart/).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0).

## Note regarding sources
- Entries accompanied by a reference link indicate code borrowed or adapted from external sources.  
- Entries without a reference link were developed exclusively within [this repository](https://github.com/oc-plus-plus/oc-plus-plus).

## Unreleased

### Added
- [#14857](https://github.com/opencart/opencart/pull/14857) - Add manufacturer filter
- Remember the last directory in the file manager.
- Emulation of `GLOB_BRACE` for Alpine/musl environments:  
  introduced a custom `oc_glob()` helper function to emulate native glob functionality.
- The `date_added` field has been added to the product form.
- CSS minification, minified versions of CSS are used.
- Modern `Chart.js` library for Dashboard sales and analytics visualization.
- Lightweight library `Jsvectormap` for Dashboard map visualization.
- Button to change an order on the checkout page

### Changed
- [#14753](https://github.com/opencart/opencart/pull/14753) - Retrieve more in depth files from extension directory for permission.
- [#14790](https://github.com/opencart/opencart/pull/14790) - Updated `catalog/language/en-gb/default.php`, added `text_all`.
- [#14818](https://github.com/opencart/opencart/pull/14818) - Safest one just in case the product options are empty.
- [#14820](https://github.com/opencart/opencart/pull/14820) - Event list: always allow for viewing event details.
- [#14891](https://github.com/opencart/opencart/pull/14891) - To collect cache files, do it only if the random has fallen to the cleanup.
- [#14915](https://github.com/opencart/opencart/pull/14915) - Add `OPTIMIZE TABLE` to `db.php`.
- [#15326](https://github.com/opencart/opencart/pull/15326) - Use the composer-generated autoload for the 3rd-party packages
- [0a8b25a](https://github.com/opencart/opencart/commit/0a8b25aaedae97e1b21784263527941448724693) - Added some additional form text.
- [8996eb3](https://github.com/opencart/opencart/commit/8996eb371620c3c7a453872d39a3a815562690f3) - `partially used` - Improved `admin/controller/marketplace/installer.php`.
- [062ba0e](https://github.com/opencart/opencart/commit/062ba0ee243cc707b51b95e56b69b7f07cda5f7f), [85e8ddb](https://github.com/opencart/opencart/commit/85e8ddb82916cc48a4dcb30fcfcd4a1a9ea9add0) - `partially used` - Updated language methods.
- Refactored the codebase to replace all `glob()` calls using the `GLOB_BRACE` flag with `oc_glob()` emulator to ensure compatibility with Alpine Linux and other musl-based environments where `GLOB_BRACE` is unavailable.
- Reduced the size of the "Delete" buttons on the 'Links' tab of the product form.
- Improved session handler.
- Improved cache cleanup.
- Improved .css refresh.
- Admin: SEO tab merged with General tab.
- `admin/view/javascript/common.js` fixed and improved _(revision using Claude LLM)_.
- `catalog/view/javascript/common.js` fixed and improved _(revision using Claude LLM)_.
- Bootstrap CSS and JS libraries updated to version `5.3.8`
- jQuery updated to version `4.0.0`
- `scssphp/scssphp` package updated to version `2.1`
- `twig/twig` package updated to version `3.24`
- Monolithic `stylesheet.css` has been converted to a modular SCSS structure
- `Opencart\System\Library::addScript()` - The list of scripts can be passed as an array
- Reworked Autocomplete for the Admin panel:
	- The code has been reworked.
	- JS is separated into an include file that can be reused.
	- Removed a large amount of duplicate and outdated code.
- Reworked Filters for the Admin panel:
	- The code has been reworked.
	- JS is separated into an include file that can be reused.
	- Clean URLs are generated, without empty selectors.
	- Removed a large amount of duplicate and outdated code.
- Refactoring

### Removed
- Removed a large amount of legacy and duplicate code
- Legacy `cron.php`.
- Deprecated libraries (replaced with current versions):
	- `Flot` (replaced with `Chart.js`).
	- `jQuery Vector Map` (replaced with `Jsvectormap`)
- Deprecated PHP functions:
	- `imagedestroy`
	- `curl_close`
- As unused:
	- Legacy vendor-related functionality
	- `upload/system/helper/filter.php`
	- `aws/aws-sdk-php` package
	- `bootstrap-icons`
	- `nunjucks-slim.js` library
	- `jquery-ui`

### Fixed
- [#14438](https://github.com/opencart/opencart/issues/14438) - WYSIWYG misconfiguration in ADMIN page for product edit.
- [#14498](https://github.com/opencart/opencart/issues/14498) - Sales order Store - wrong in the order list.
- [#14731](https://github.com/opencart/opencart/issues/14731) - In additional Stores Cookie Policy is not selectable.
- [#14736](https://github.com/opencart/opencart/pull/14736) - Fix disabled products design same as other table lists.
- [#14739](https://github.com/opencart/opencart/issues/14739) - After creating multiple folders, the root directory images are not displayed.
- [#14740](https://github.com/opencart/opencart/pull/14740) - Renamed total function as they had an incorrect name.
- [#14744](https://github.com/opencart/opencart/issues/14744) - BUG in product settlement.
- [#14746](https://github.com/opencart/opencart/issues/14746) - Various bugs with `sku`, `upc`, `ean`, `jan`, `isbn`, `mpn`.
- [#14755](https://github.com/opencart/opencart/issues/14755) - Wrong total on cart page
- [#14756](https://github.com/opencart/opencart/pull/14756) - Order files are not displaying in the admin order details page.
- [#14758](https://github.com/opencart/opencart/issues/14758) - Unnecessary parameter
- [#14759](https://github.com/opencart/opencart/pull/14759) - Checkout cart page lists wrong item totals.
- [#14764](https://github.com/opencart/opencart/issues/14764) - Admin login as customer not working.
- [#14791](https://github.com/opencart/opencart/pull/14791) - Fix wrong search result pagination.
- [#14803](https://github.com/opencart/opencart/issues/14803) - Admin order notes are visible to the customer
- [#14822](https://github.com/opencart/opencart/pull/14822) - In Admin, while creating new order, Product is not being added.
- [#14843](https://github.com/opencart/opencart/pull/14843) - Fix autoloader in storeInstance to ensure proper class loading.
- [#14845](https://github.com/opencart/opencart/issues/14845) - Missing language definition in `account/forgotten.php`.
- [#14867](https://github.com/opencart/opencart/pull/14867) - Fix autoloader: one namespace can contain classes from different folders.
- [#14878](https://github.com/opencart/opencart/issues/14878) - Wrong column used in topic layout methods (`article_id` instead of `topic_id`)
- [#14882](https://github.com/opencart/opencart/issues/14882) - Undefined array key "payment_zones".
- [#14887](https://github.com/opencart/opencart/issues/14887) - `Product::addReport()`: Argument #1 must be of type `int`, `string` given.
- [#14895](https://github.com/opencart/opencart/issues/14895) - Should use array_merge.
- [#14903](https://github.com/opencart/opencart/pull/14903) - Fixed `getTotals()`.
- [#14988](https://github.com/opencart/opencart/pull/14988) - Correct method names for bulk delete operations
- [#15046](https://github.com/opencart/opencart/pull/15046), [6999e3e](https://github.com/opencart/opencart/commit/6999e3e6c091aafa958eefa2af1a2deff10524a3#diff-6ec7893dd58bb90a8bb72684d687095fb309087e63063d59d90b64e53f6ed3ec), [6dd838b](https://github.com/opencart/opencart/commit/6dd838bf7b469e7da80df22dd0439d25037a412f) - Various bugs in `system/library/curl.php`.
- [#15185](https://github.com/opencart/opencart/pull/15185) - Fix viewing embedded Youtube video.
- [#15363](https://github.com/opencart/opencart/pull/15363) - Fixed Category Filter
- [#forum](https://forum.opencart.com/viewtopic.php?t=235946#p880856) - Error when deleting a product from Wishlist.
- [#15333](https://github.com/opencart/opencart/pull/15333), [#15397](https://github.com/opencart/opencart/pull/15397) - A set of fixes from @plemondev (partially used)
- [#15354](https://github.com/opencart/opencart/pull/15354) - Fixed the OCMOD functionality.
- [#15367](https://github.com/opencart/opencart/pull/15367) - Added fixes for integrating various caching engines.
- [#15381](https://github.com/opencart/opencart/pull/15381) - Fix category filter model.
- [#15396](https://github.com/opencart/opencart/pull/15396) - Voiding the order here should only happen if it has already been confirmed.
- [#15404](https://github.com/opencart/opencart/pull/15404) - Catalog and Extensions Fixed.
- [#15409](https://github.com/opencart/opencart/pull/15409) - A set of improvements and fixes from @plemondev (partially used).
- [#15412](https://github.com/opencart/opencart/pull/15412) - Missing user's name in activity on checkout register.
- [#15415](https://github.com/opencart/opencart/pull/15415) - Add variant to cart adding master instead.
- [#15418](https://github.com/opencart/opencart/pull/15418) - Keep variant's code override on master update.
- [#15420](https://github.com/opencart/opencart/pull/15420) - Fix admin product list wrong discount value
- [#15428](https://github.com/opencart/opencart/pull/15428) - Multiple issues in checkout's register component
- [#15436](https://github.com/opencart/opencart/pull/15436) - Keep order's status on admin update
- [#15447](https://github.com/opencart/opencart/pull/15447) - Fix install open_basedir validation
- When unloading extensions, archives with errors were not deleted, but remained in the `/marketplace` folder.
- The zone name was not displayed in the list
- The password recovery link in the email was visible as plain text
- Undefined array key "author" in catalog/controller/product/review.php on line 161
- getProduct(): Argument #1 ($product_id) must be of type int
- PHP Warning:  Undefined array key "en-gb'nvOpzp;..." in catalog/controller/common/language.php
- Error: Opencart\Admin\Model\Catalog\Product::getDiscounts(): Argument #1 ($product_id) must be of type int
- Error: Invalid session ID
- Undefined variable `$price_status` in `catalog/controller/api/cart.php`.
- Undefined variable `$thid` in `catalog/controller/api/order.php`.
- getReviewsByProductId(): Argument 2 ($start) must be of type int (mentioned on [#15319](https://github.com/opencart/opencart/issues/15319))
- Variable `$file` in `isset()` always exists and is not nullable in `system/engine/autoloader.php` (90)
- PHP Warning: unlink(): No such file or directory in /system/library/cache/file.php on line 37
- Administrator password recovery
- Display of sales statistics on the Dashboard Map
- SQL error on `admin/sale/subscription` filter
- SQL error on `admin/sale/returns` filter
- Various minor fixes...
- **Green Build** - Fixed various static analysis errors and comments

### Security
- [#15445](https://github.com/opencart/opencart/pull/15445) - Prevent XSS in error log view


## Soure Code
Based on [OpenCart 4.1.0.3](https://github.com/opencart/opencart/releases/tag/4.1.0.3) as the foundation for all subsequent development within this branch.
