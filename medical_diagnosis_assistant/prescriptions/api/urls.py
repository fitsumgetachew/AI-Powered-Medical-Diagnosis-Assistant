from django.urls import path
from .views import *

urlpatterns = [
    path('drugs/', DrugAPIView.as_view(), name='drug-list'),
    path('drugs/<int:pk>/', DrugAPIView.as_view(), name='drug-detail'),
    path('prescriptions/', PrescriptionListCreateAPIView.as_view(), name='prescription_list_create'),
    path('prescriptions/<int:pk>/', PrescriptionRetrieveUpdateDestroyAPIView.as_view(), name='prescription_detail'),
    path('drug-interactions/', DrugInteractionAPIView.as_view(), name='drug_interactions'),
]