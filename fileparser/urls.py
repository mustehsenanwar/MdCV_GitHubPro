from django.urls import path
from . import views



app_name = 'dashboard'


urlpatterns = [
    # Dashboard urls
    path('pdfparser/',views.pdfparser, name='pdfparser'),
    path('texteditor/',views.texteditor, name='texteditor'),


]