from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^send_msg/', include('send_msg.urls')),
    url(r'^admin/', admin.site.urls),
]