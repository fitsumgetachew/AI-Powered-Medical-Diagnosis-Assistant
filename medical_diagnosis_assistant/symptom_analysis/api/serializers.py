from rest_framework import serializers
from symptom_analysis.models import Conversation , SymptomAnalysis


class ConversationSerializer(serializers.ModelSerializer):

    user_message = serializers.ListField()
    ai_response = serializers.ListField()

    class Meta:
        model = Conversation
        fields = [
            'pk',
            'user_message',
            'ai_response',
            'is_from_user'
        ]

class ConversationDetailSerializer(serializers.ModelSerializer):
    user_message = serializers.ListField()
    ai_response = serializers.ListField()

    class Meta:
        model = Conversation
        fields = [
            'user_message',
            'ai_response'
        ]

class ConversationListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Conversation
        fields = [
            'pk',
            'name'
        ]

class SymptomAnalysisSerializer(serializers.ModelSerializer):

    class Meta:
        model = SymptomAnalysis
        fields = [
            'analysis_result'
        ]


