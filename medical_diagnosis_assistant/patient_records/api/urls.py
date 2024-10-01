from django.urls import path
from . import views


urlpatterns = [
    path('symptom-analysis/', views.SymptomAnalysisHistoryView.as_view(), name='symptom-analysis-history'),
    path('list-doctors/', views.ListDoctorsView.as_view(), name='list-doctors'),
    path('share/', views.ShareHistoryView.as_view(), name='share-history'),
    path('revoke/', views.RevokeMedicalInfoView.as_view(), name='revoke-history'),
    path('received/', views.DoctorSharedHistoryView.as_view(), name='received-history'),
]