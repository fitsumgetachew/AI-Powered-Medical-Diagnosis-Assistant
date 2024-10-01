from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.ChatResponseView.as_view(), name='chat-response'),
    path('list_conversations/', views.ConversationListView.as_view(), name='list-conversations'),
    path('conversation/<int:conversation_id>/', views.ConversationDetailView.as_view(), name='conversation-detail'),
    path('analysis/', views.AnalyzeSymptomView.as_view(), name='analyze-symptom'),
    path('save-to-history/', views.SaveToHistoryView.as_view(), name='save-to-history'),
]