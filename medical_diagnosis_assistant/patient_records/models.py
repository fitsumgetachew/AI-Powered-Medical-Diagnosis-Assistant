from django.db import models
from accounts.models import User, Doctor
from image_analysis.models import ImageAnalysisResult
from symptom_analysis.models import SymptomAnalysis
from prescriptions.models import Prescription

class PatientHistory(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    image_analysis = models.ForeignKey(ImageAnalysisResult, on_delete=models.SET_NULL, null=True, blank=True)
    symptom_analysis = models.ForeignKey(SymptomAnalysis, on_delete=models.SET_NULL, null=True, blank=True)
    prescription = models.ForeignKey(Prescription, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History for {self.patient.email} at {self.created_at}"

class SharedMedicalInfo(models.Model):
    patient = models.ForeignKey(User, related_name='shared_info', on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient_history = models.ForeignKey(PatientHistory, on_delete=models.CASCADE)
    shared_at = models.DateTimeField(auto_now_add=True)
    revoked_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Info shared by {self.patient.email} with Dr. {self.doctor.user.last_name}"