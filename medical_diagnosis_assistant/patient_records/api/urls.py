from django.urls import path
from . import views


urlpatterns =[
    path('symptom-analysis-history/', views.SymptomAnalysisHistoryView.as_view(), name='symptom-analysis-history'),
    path('list-doctors/' , views.ListDoctorsView.as_view()),
    path('share-history/' , views.ShareHistoryView.as_view()),
    path('revoke-history/', views.RevokeMedicalInfoView.as_view()),
    path('received-history/' , views.DoctorSharedHistoryView.as_view())
]