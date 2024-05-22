from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from testing import views

urlpatterns = [
    path('tests/', views.TestViewSet.as_view({'get': 'list'})),
    path('tests/<int:pk>/', views.TestViewSet.as_view({'get': 'retrieve'})),
    path('tests/<int:pk>/complete/', views.CompleteTestView.as_view()),
    path('user/', views.UserView.as_view()),
    path('tests/export/', views.CompletedTestsDOCXView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
