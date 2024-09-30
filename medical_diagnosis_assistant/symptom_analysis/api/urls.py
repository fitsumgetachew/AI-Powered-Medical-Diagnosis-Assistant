from django.urls import path
from . import views

urlpatterns = [
    path('chat/' , views.ChatResponseView.as_view()),
    path('list_conversations/' , views.ConversationListView.as_view()),
    path('conversation/<int:conversation_id>/' , views.ConversationDetailView.as_view()),
    path('analysis/' , views.AnalyzeSymptomView.as_view()),
    path('save-to-history/', views.SaveToHistoryView.as_view(), name='save-to-history'),

]