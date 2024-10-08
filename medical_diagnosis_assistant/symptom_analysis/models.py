from django.db import models
from accounts.models import User


class Conversation(models.Model):
    """
    Represents a conversation between a user and an AI system.

    Attributes:
        user (ForeignKey): The user involved in the conversation.
        name (CharField): The name of the conversation.
        user_message (JSONField): Messages sent by the user.
        ai_response (JSONField): Responses generated by the AI.
        created_at (DateTimeField): The timestamp when the conversation was created.
        is_from_user (BooleanField): Flag indicating if the message is from the user.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, default='')
    user_message = models.JSONField(default=list)
    ai_response = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    is_from_user = models.BooleanField(default=False)

    def __str__(self):
        return f"Conversation with {self.user.email} at {self.created_at}"


class Symptom(models.Model):
    """
    Represents a symptom that can be analyzed.

    Attributes:
        name (CharField): The name of the symptom.
        description (TextField): A description of the symptom.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class SymptomAnalysis(models.Model):
    """
    Represents an analysis of symptoms for a user.

    Attributes:
        user (ForeignKey): The user whose symptoms are being analyzed.
        conversation (ForeignKey): The related conversation containing the analysis.
        symptoms (ManyToManyField): The symptoms involved in the analysis.
        analysis_result (TextField): The result of the symptom analysis.
        created_at (DateTimeField): The timestamp when the analysis was created.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=0)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='symptom_analyses')
    symptoms = models.ManyToManyField(Symptom)
    analysis_result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis for {self.user.email} at {self.created_at}"
