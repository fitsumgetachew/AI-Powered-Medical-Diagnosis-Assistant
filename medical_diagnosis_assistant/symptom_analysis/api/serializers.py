from rest_framework import serializers
from symptom_analysis.models import Conversation , SymptomAnalysis,Symptom


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

class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = ['id', 'name']

class SymptomAnalysisSerializer(serializers.ModelSerializer):
    symptoms = SymptomSerializer(many=True, read_only=True)
    conversation = serializers.PrimaryKeyRelatedField(queryset=Conversation.objects.all())

    class Meta:
        model = SymptomAnalysis
        fields = ['id', 'user', 'conversation', 'symptoms', 'analysis_result', 'created_at']
class SymptomAnalysisHistorySerializer(serializers.ModelSerializer):
    symptoms = SymptomSerializer(many=True, read_only=True)

    class Meta:
        model = SymptomAnalysis
        fields = ['id', 'analysis_result', 'symptoms', 'created_at']


