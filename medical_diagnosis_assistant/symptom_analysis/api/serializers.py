from rest_framework import serializers
from symptom_analysis.models import Conversation, SymptomAnalysis, Symptom

class ConversationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Conversation model, handling serialization and deserialization
    of Conversation instances including user messages and AI responses.

    Attributes:
        user_message (ListField): List of messages sent by the user.
        ai_response (ListField): List of responses generated by the AI.
    """
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
    """
    Serializer for detailed representation of Conversation model, including user messages and AI responses.

    Attributes:
        user_message (ListField): List of messages sent by the user.
        ai_response (ListField): List of responses generated by the AI.
    """
    user_message = serializers.ListField()
    ai_response = serializers.ListField()

    class Meta:
        model = Conversation
        fields = [
            'user_message',
            'ai_response'
        ]

class ConversationListSerializer(serializers.ModelSerializer):
    """
    Serializer for a list representation of the Conversation model, including the primary key and name of the conversation.
    """
    class Meta:
        model = Conversation
        fields = [
            'pk',
            'name'
        ]

class SymptomSerializer(serializers.ModelSerializer):
    """
    Serializer for the Symptom model, handling serialization and deserialization of Symptom instances.

    Attributes:
        id (IntegerField): Unique identifier for the symptom.
        name (CharField): Name of the symptom.
    """
    class Meta:
        model = Symptom
        fields = ['id', 'name']

class SymptomAnalysisSerializer(serializers.ModelSerializer):
    """
    Serializer for the SymptomAnalysis model, handling serialization and deserialization
    of SymptomAnalysis instances including related symptoms and conversation.

    Attributes:
        symptoms (SymptomSerializer): Nested serializer for related symptoms.
        conversation (PrimaryKeyRelatedField): Primary key reference to the related Conversation instance.
    """
    symptoms = SymptomSerializer(many=True, read_only=True)
    conversation = serializers.PrimaryKeyRelatedField(queryset=Conversation.objects.all())

    class Meta:
        model = SymptomAnalysis
        fields = ['id', 'user', 'conversation', 'symptoms', 'analysis_result', 'created_at']

class SymptomAnalysisHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for historical data of SymptomAnalysis, including analysis result and related symptoms.

    Attributes:
        symptoms (SymptomSerializer): Nested serializer for related symptoms.
    """
    symptoms = SymptomSerializer(many=True, read_only=True)

    class Meta:
        model = SymptomAnalysis
        fields = ['id', 'analysis_result', 'symptoms', 'created_at']
