import os


ROOT = os.path.dirname(__file__)
MOBILE_ROOT = os.path.join(ROOT, 'mobile')
V4_ROOT = os.path.join(ROOT, 'v4')

# Root folder for build artifacts
BUILD_ROOT = os.path.join(ROOT, 'build/')

# Static folders. All of these will be copied into the output dir, and
# symlinked from the locale directories.
STATIC_FOLDERS = ['css', 'fonts', 'img', 'js', 'json']
MOBILE_STATIC_FOLDERS = ['css', 'fonts', 'img', 'js']
V4_STATIC_FOLDERS = ['css', 'fonts', 'img', 'js']

STATIC_SYMLINK_PATH = '../static'
MOBILE_STATIC_SYMLINK_PATH = '../../static/mobile'
V4_STATIC_SYMLINK_PATH = '../../static/v4'

# L10n dir
LOCALE_DIR = os.path.join(ROOT, 'locale')
if not os.path.exists(LOCALE_DIR):
    LOCALE_DIR = os.path.join(ROOT, 'locale_test')

# .lang file, filename
LANG_FILENAME = 'fhr.lang'

# List of languages.
LANGS = (
    'ach', 'af', 'an', 'ar', 'as', 'ast', 'az', 'bg', 'bn-BD', 'bn-IN', 'br',
    'bs', 'ca', 'cak', 'cs', 'cy', 'da', 'de', 'dsb', 'el', 'en-GB', 'en-US',
    'en-ZA', 'eo', 'es-AR', 'es-CL', 'es-ES', 'es-MX', 'et', 'eu', 'fa', 'ff',
    'fi', 'fr', 'fy-NL', 'ga-IE', 'gd', 'gl', 'gn', 'gu-IN', 'he', 'hi-IN',
    'hr', 'hsb', 'hu', 'hy-AM', 'id', 'is', 'it', 'ja', 'ja-JP-mac', 'ka',
    'kab', 'kk', 'km', 'kn', 'ko', 'lij', 'lo', 'lt', 'ltg', 'lv', 'mai', 'mk',
    'ml', 'mr', 'ms', 'my', 'nb-NO', 'ne-NP', 'nl', 'nn-NO', 'or', 'pa-IN',
    'pl', 'pt-BR', 'pt-PT', 'rm', 'ro', 'ru', 'si', 'sk', 'sl', 'son', 'sq',
    'sr', 'sv-SE', 'ta', 'te', 'th', 'tl', 'tr', 'uk', 'ur', 'uz', 'vi', 'xh',
    'zh-CN', 'zh-TW', 'zu',
)

# RTL languages.
RTL_LANGS = ('ar', 'fa', 'he', 'ur')

# Language fallbacks. Langs listed here will be symlinked to their respective
# fallbacks rather than generated on their owns. Both sides must exist in
# LANGS.
LANG_FALLBACK = {
    'en-ZA'     : 'en-US',
    'he'        : 'en-US',
    'ja-JP-mac' : 'ja',
}

# Mobile Language fallbacks. Langs listed here will be symlinked to
# their respective fallbacks rather than generated on their owns.
# This is for locales that do have fhr for Destop but haven't translated
# it for mobile.
# e.g. 'ja' : 'en-US',
LANG_MOBILE_FALLBACK = {}

# View to build - specify either 'passive' or 'urgent'
BUILD_VERSION = 'passive'
