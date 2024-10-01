from django.db import models
from accounts.models import User

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, default='')
    user_message = models.JSONField(default=list)
    ai_response = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    is_from_user = models.BooleanField(default=False)

    def __str__(self):
        return f"Conversation with {self.user.email} at {self.created_at}"


class Symptom(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class SymptomAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE , default = 0)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='symptom_analyses')
    symptoms = models.ManyToManyField(Symptom)
    analysis_result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis for {self.user.email} at {self.created_at}"