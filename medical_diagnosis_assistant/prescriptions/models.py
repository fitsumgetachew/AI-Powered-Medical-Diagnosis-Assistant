from django.db import models
from accounts.models import User, Doctor

class Drug(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    side_effects = models.TextField(blank=True)
    contraindications = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Prescription(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, null=True)
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    diagnosis = models.TextField()
    drugs = models.ManyToManyField(Drug)
    dosage = models.CharField(max_length=100, null=True)
    frequency = models.CharField(max_length=100, null=True)
    duration = models.CharField(max_length=100, null=True)
    instructions = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    valid_until = models.DateTimeField(null=True)

    def __str__(self):
        return f"Prescription for {self.patient.email} by Dr. {self.doctor.user.last_name}"