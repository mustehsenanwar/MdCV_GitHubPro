"""
Django settings for core project.

Generated by 'django-admin startproject' using Django 4.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-blehs+vjho@s4qug%9ferf0-tucvbr9#_1k2!#ebs4u68@)ss+'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
EXTERNAL_APP = [
    'profiles',
    'dashboard',
    'orders',
    'payments',
    'fileparser',
    'resume_templates',

]

INSTALLED_APPS += EXTERNAL_APP
LOGIN_URL = '/profiles/login/'


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'libraries': {
                'theme': 'core.templatetags.theme',
            },
            'builtins': [
                'django.templatetags.static',
                'core.templatetags.theme',
            ]
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-US'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locale'),
]


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'static/'

STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')



X_FRAME_OPTIONS = 'SAMEORIGIN'


# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


AUTH_USER_MODEL = 'profiles.CustomUser'
######################
# Keenthemes Settings
######################

KT_THEME = 'metronic'


# Theme layout templates directory

KT_THEME_LAYOUT_DIR = 'layout'


# Theme Mode
# Value: light | dark | system

KT_THEME_MODE_DEFAULT = 'light'
KT_THEME_MODE_SWITCH_ENABLED = True


# Theme Direction
# Value: ltr | rtl

KT_THEME_DIRECTION = 'ltr'


# Keenicons
# Value: duotone | outline | bold

KT_THEME_ICONS = 'duotone'


# Theme Assets

KT_THEME_ASSETS = {
    "favicon": "media/logos/favicon.ico",
    "fonts": [
        'https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700',
    ],
    "css": [
        "plugins/global/plugins.bundle.css",
        "css/style.bundle.css"
    ],
    "js": [
        "plugins/global/plugins.bundle.js",
        "js/scripts.bundle.js",
    ]
}


# Theme Vendors

KT_THEME_VENDORS = {
    "datatables": {
        "css": [
            "plugins/custom/datatables/datatables.bundle.css"
        ],
        "js": [
            "plugins/custom/datatables/datatables.bundle.js"
        ]
    },
    "formrepeater": {
        "js": [
            "plugins/custom/formrepeater/formrepeater.bundle.js"
        ]
    },
    "fullcalendar": {
        "css": [
            "plugins/custom/fullcalendar/fullcalendar.bundle.css"
        ],
        "js": [
            "plugins/custom/fullcalendar/fullcalendar.bundle.js"
        ]
    },
    "flotcharts": {
        "js": [
            "plugins/custom/flotcharts/flotcharts.bundle.js"
        ]
    },
    "google-jsapi": {
        "js": [
            "//www.google.com/jsapi"
        ]
    },
    "tinymce": {
        "js": [
            "plugins/custom/tinymce/tinymce.bundle.js"
        ]
    },
    "ckeditor-classic": {
        "js": [
            "plugins/custom/ckeditor/ckeditor-classic.bundle.js"
        ]
    },
    "ckeditor-inline": {
        "js": [
            "plugins/custom/ckeditor/ckeditor-inline.bundle.js"
        ]
    },
    "ckeditor-balloon": {
        "js": [
            "plugins/custom/ckeditor/ckeditor-balloon.bundle.js"
        ]
    },
    "ckeditor-balloon-block": {
        "js": [
            "plugins/custom/ckeditor/ckeditor-balloon-block.bundle.js"
        ]
    },
    "ckeditor-document": {
        "js": [
            "plugins/custom/ckeditor/ckeditor-document.bundle.js"
        ]
    },
    "draggable": {
        "js": [
            "plugins/custom/draggable/draggable.bundle.js"
        ]
    },
    "fslightbox": {
        "js": [
            "plugins/custom/fslightbox/fslightbox.bundle.js"
        ]
    },
    "jkanban": {
        "css": [
            "plugins/custom/jkanban/jkanban.bundle.css"
        ],
        "js": [
            "plugins/custom/jkanban/jkanban.bundle.js"
        ]
    },
    "typedjs": {
        "js": [
            "plugins/custom/typedjs/typedjs.bundle.js"
        ]
    },
    "cookiealert": {
        "css": [
            "plugins/custom/cookiealert/cookiealert.bundle.css"
        ],
        "js": [
            "plugins/custom/cookiealert/cookiealert.bundle.js"
        ]
    },
    "cropper": {
        "css": [
            "plugins/custom/cropper/cropper.bundle.css"
        ],
        "js": [
            "plugins/custom/cropper/cropper.bundle.js"
        ]
    },
    "vis-timeline": {
        "css": [
            "plugins/custom/vis-timeline/vis-timeline.bundle.css"
        ],
        "js": [
            "plugins/custom/vis-timeline/vis-timeline.bundle.js"
        ]
    },
    "jstree": {
        "css": [
            "plugins/custom/jstree/jstree.bundle.css"
        ],
        "js": [
            "plugins/custom/jstree/jstree.bundle.js"
        ]
    },
    "prismjs": {
        "css": [
            "plugins/custom/prismjs/prismjs.bundle.css"
        ],
        "js": [
            "plugins/custom/prismjs/prismjs.bundle.js"
        ]
    },
    "leaflet": {
        "css": [
            "plugins/custom/leaflet/leaflet.bundle.css"
        ],
        "js": [
            "plugins/custom/leaflet/leaflet.bundle.js"
        ]
    },
    "amcharts": {
        "js": [
            "https://cdn.amcharts.com/lib/5/index.js",
            "https://cdn.amcharts.com/lib/5/xy.js",
            "https://cdn.amcharts.com/lib/5/percent.js",
            "https://cdn.amcharts.com/lib/5/radar.js",
            "https://cdn.amcharts.com/lib/5/themes/Animated.js"
        ]
    },
    "amcharts-maps": {
        "js": [
            "https://cdn.amcharts.com/lib/5/index.js",
            "https://cdn.amcharts.com/lib/5/map.js",
            "https://cdn.amcharts.com/lib/5/geodata/worldLow.js",
            "https://cdn.amcharts.com/lib/5/geodata/continentsLow.js",
            "https://cdn.amcharts.com/lib/5/geodata/usaLow.js",
            "https://cdn.amcharts.com/lib/5/geodata/worldTimeZonesLow.js",
            "https://cdn.amcharts.com/lib/5/geodata/worldTimeZoneAreasLow.js",
            "https://cdn.amcharts.com/lib/5/themes/Animated.js"
        ]
    },
    "amcharts-stock": {
        "js": [
            "https://cdn.amcharts.com/lib/5/index.js",
            "https://cdn.amcharts.com/lib/5/xy.js",
            "https://cdn.amcharts.com/lib/5/themes/Animated.js"
        ]
    },
    "bootstrap-select": {
        "css": [
            "plugins/custom/bootstrap-select/bootstrap-select.bundle.css"
        ],
        "js": [
            "plugins/custom/bootstrap-select/bootstrap-select.bundle.js"
        ]
    }
}



