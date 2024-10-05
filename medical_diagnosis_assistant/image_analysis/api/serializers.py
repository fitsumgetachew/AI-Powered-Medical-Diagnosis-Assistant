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

class ImageAnalysisVisualizationSerializer(serializers.ModelSerializer):
    image_type = serializers.CharField(source='medical_image.image_type', read_only=True)
    body_part = serializers.CharField(source='medical_image.body_part', read_only=True)


    class Meta:
        model = ImageAnalysisResult
        fields = ['image_type', 'body_part', 'abnormality_detected', 'result']