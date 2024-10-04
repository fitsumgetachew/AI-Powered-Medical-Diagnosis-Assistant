from django.urls import path
from . import views

urlpatterns = [
    path('tuberculosis/', views.TuberculosisTestView.as_view(), name='tuberculosis'),
    path('pneumonia/', views.PneumoniaTestView.as_view(), name='pneumonia'),
    path('bones-fracture/', views.BonesFractureTestView.as_view(), name='bones_fracture'),
    path('breast-cancer/', views.BreastCancerTestView.as_view(), name='breast_cancer'),
    path('oral-cancer/', views.OralCancerTestView.as_view(), name='oral_cancer'),
    path('results/', views.AnalysisResultsView.as_view(), name='results'),
    path('results/<int:pk>/', views.AnalysisResultDetailView.as_view(), name='result_detail'),
    path('visual_data/' , views.ImageAnalysisVisualizationView.as_view())
]