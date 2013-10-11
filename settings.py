import os


ROOT = os.path.dirname(__file__)
MOBILE_ROOT = os.path.join(ROOT, 'mobile')

# Root folder for build artifacts
BUILD_ROOT = os.path.join(ROOT, 'build/')

# Static folders. All of these will be copied into the output dir, and
# symlinked from the locale directories.
STATIC_FOLDERS = ['css', 'fonts', 'img', 'js', 'json']
MOBILE_STATIC_FOLDERS = ['css', 'fonts', 'img', 'js']

STATIC_SYMLINK_PATH = '../static'
MOBILE_STATIC_SYMLINK_PATH = '../../static/mobile'

# L10n dir
LOCALE_DIR = os.path.join(ROOT, 'locale')
if not os.path.exists(LOCALE_DIR):
    LOCALE_DIR = os.path.join(ROOT, 'locale_test')

# .lang file, filename
LANG_FILENAME = 'fhr.lang'

# List of languages.
LANGS = (
    'ach', 'af', 'ak', 'an', 'ar', 'as', 'ast', 'az', 'be', 'bg',
    'bn-BD', 'bn-IN', 'br', 'bs', 'ca', 'cs', 'csb', 'cy', 'da',
    'de', 'el', 'en-GB', 'en-US', 'en-ZA', 'eo', 'es-AR', 'es-CL',
    'es-ES', 'es-MX', 'et', 'eu', 'fa', 'ff', 'fi', 'fr', 'fy-NL',
    'ga-IE', 'gd', 'gl', 'gu-IN', 'he', 'hi-IN', 'hr', 'hu', 'hy-AM',
    'id', 'is', 'it', 'ja', 'ja-JP-mac', 'ka', 'kk', 'km', 'kn',
    'ko', 'ku', 'lg', 'lij', 'lt', 'lv', 'mai', 'mk', 'ml', 'mn',
    'mr', 'my', 'nb-NO', 'nl', 'nn-NO', 'nso', 'oc', 'or', 'pa-IN',
    'pl', 'pt-BR', 'pt-PT', 'rm', 'ro', 'ru', 'sah', 'si', 'sk', 'sl',
    'son', 'sq', 'sr', 'sv-SE', 'sw', 'ta', 'ta-LK', 'te', 'th', 'tr',
    'uk', 'ur', 'vi', 'wo', 'zh-CN', 'zh-TW', 'zu',
)

# RTL languages.
RTL_LANGS = ('ar', 'fa', 'he', 'ur')

# Language fallbacks. Langs listed here will be symlinked to their respective
# fallbacks rather than generated on their owns. Both sides must exist in
# LANGS.
LANG_FALLBACK = {
    'be'        : 'ru',
    'en-ZA'     : 'en-US',
    'he'        : 'en-US',
    'ja-JP-mac' : 'ja',
    'mn'        : 'ru',
    'nn-NO'     : 'nb-NO',
    'oc'        : 'fr',
    'sw'        : 'en-US',
    'wo'        : 'fr',
}

# Mobile Language fallbacks. Langs listed here will be symlinked to
# their respective fallbacks rather than generated on their owns.
# This is for locales that do have fhr for Destop but haven't translated
# it for mobile.
LANG_MOBILE_FALLBACK = {
    'ja'    : 'en-US',
    'hu'    : 'en-US',
    'pl'    : 'en-US',
    'pt-BR' : 'en-US',
    'tr'    : 'en-US',
}

# View to build - specify either 'passive' or 'urgent'
BUILD_VERSION = 'passive'
