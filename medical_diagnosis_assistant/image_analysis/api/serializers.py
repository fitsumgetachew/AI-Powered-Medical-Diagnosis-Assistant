from rest_framework import serializers
from ..models import *

class MedicalImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = MedicalImage

        fields = '__all__'
        read_only_fields = ['uploaded_at']

class ImageAnalysisResultSerializer(serializers.ModelSerializer):
    """
    Serializer for the ImageAnalysisResult model with related MedicalImage fields.
    """
    medical_image = MedicalImageSerializer()  # Nested serializer to include medical image details

    class Meta:
        model = ImageAnalysisResult
        fields = ['medical_image', 'result', 'abnormality_detected', 'confidence_score', 'analyzed_at']
