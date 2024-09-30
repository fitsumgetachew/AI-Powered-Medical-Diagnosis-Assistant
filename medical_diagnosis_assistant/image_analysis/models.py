from django.db import models
from accounts.models import User

class MedicalImage(models.Model):
    IMAGE_TYPES = [
        ('XRAY', 'X-Ray'),
        ('CT', 'CT Scan'),
        ('MRI', 'MRI'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to='medical_images/')
    image_type = models.CharField(max_length=4, choices=IMAGE_TYPES)
    body_part = models.CharField(max_length=50)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    analyzed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.image_type} of {self.body_part} for {self.user.email}"

class ImageAnalysisResult(models.Model):
    medical_image = models.OneToOneField(MedicalImage, on_delete=models.CASCADE)
    result = models.TextField()
    abnormality_detected = models.BooleanField()
    confidence_score = models.FloatField()
    analyzed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis for {self.medical_image}"
