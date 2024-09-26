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
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    diagnosis = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    valid_until = models.DateTimeField()

    def __str__(self):
        return f"Prescription for {self.patient.email} by Dr. {self.doctor.user.last_name}"

class PrescriptionDrug(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    drug = models.ForeignKey(Drug, on_delete=models.CASCADE)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    instructions = models.TextField()

    def __str__(self):
        return f"{self.drug.name} for {self.prescription}"