from django.db import models
from accounts.models import User, Doctor
from image_analysis.models import ImageAnalysisResult
from symptom_analysis.models import SymptomAnalysis
from prescriptions.models import Prescription

class PatientHistory(models.Model):
    """
    Model to store the medical history of a patient, including image analysis results,
    symptom analysis, and prescriptions.
    """
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    image_analysis = models.ForeignKey(ImageAnalysisResult, on_delete=models.SET_NULL, null=True, blank=True)
    symptom_analysis = models.ForeignKey(SymptomAnalysis, on_delete=models.SET_NULL, null=True, blank=True)
    prescription = models.ForeignKey(Prescription, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Return the string representation of the patient's history.

        Returns:
            str: The patient's email and the creation timestamp of the history entry.
        """
        return f"History for {self.patient.email} at {self.created_at}"

class SharedMedicalInfo(models.Model):
    """
    Model to store information about shared medical records between patients and doctors.
    """
    patient = models.ForeignKey(User, related_name='shared_info', on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient_history = models.ForeignKey(PatientHistory, on_delete=models.CASCADE)
    shared_at = models.DateTimeField(auto_now_add=True)
    revoked_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        """
        Return the string representation of the shared medical information.

        Returns:
            str: Information about who shared the data and with which doctor.
        """
        return f"Info shared by {self.patient.email} with Dr. {self.doctor.user.last_name}"
