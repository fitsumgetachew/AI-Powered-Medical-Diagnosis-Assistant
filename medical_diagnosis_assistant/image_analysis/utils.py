from .api.serializers import MedicalImageSerializer
from .models import ImageAnalysisResult


def save_analysis_results(medical_image:MedicalImageSerializer, result:str, abnormality_detected:bool, confidence_score:float):
    """
    Saves the analysis result to the database.

    Parameters:
    - medical_image: The MedicalImageSerializer instance representing the medical image.
    - result: The result of the analysis (e.g., 'Normal', 'Tuberculosis').
    - abnormality_detected: A boolean indicating whether an abnormality was detected.
    - confidence_score: The confidence score of the prediction.
    """
    analysis_result = ImageAnalysisResult.objects.create(
        medical_image=medical_image,
        result=result,
        abnormality_detected=abnormality_detected,
        confidence_score=confidence_score
    )
    analysis_result.save()