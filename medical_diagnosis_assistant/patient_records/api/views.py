from .serializers import (PatientHistorySerializer, DoctorListSerializer,
                          ShareMedicalInfoSerializer, SharedMedicalInfoSerializer,
                          RevokeMedicalInfoSerializer)
from patient_records.models import PatientHistory, SharedMedicalInfo
from accounts.models import Doctor
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone

class SymptomAnalysisHistoryView(APIView):
    """
    API view to handle fetching the symptom analysis history for the authenticated user.
    """
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handle GET request to retrieve symptom analysis history.

        Args:
            request (Request): The request object.

        Returns:
            Response: The response containing serialized symptom analysis history data.
        """
        user = request.user
        patient_history = PatientHistory.objects.all()
        serializer = PatientHistorySerializer(patient_history, many=True)
        return Response(serializer.data, status=200)

class ListDoctorsView(APIView):
    """
    API view to list all doctors.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handle GET request to retrieve a list of doctors.

        Args:
            request (Request): The request object.

        Returns:
            Response: The response containing serialized doctor data.
        """
        doctors = Doctor.objects.all()
        serializer = DoctorListSerializer(doctors, many=True)
        return Response(serializer.data, status=200)

class ShareHistoryView(APIView):
    """
    API view to share a patient's medical history with a doctor.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request to share patient history.

        Args:
            request (Request): The request object.

        Returns:
            Response: The response indicating success or failure of the sharing operation.
        """
        serializer = ShareMedicalInfoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Patient history shared successfully.'}, status=200)
        return Response(serializer.errors, status=400)

class RevokeMedicalInfoView(APIView):
    """
    API view to revoke shared medical information.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request to revoke shared medical information.

        Args:
            request (Request): The request object.

        Returns:
            Response: The response indicating success or failure of the revocation.
        """
        serializer = RevokeMedicalInfoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            shared_info = SharedMedicalInfo.objects.get(id=serializer.validated_data['id'])
            shared_info.revoked_at = timezone.now()
            shared_info.save()
            return Response({'message': 'Shared medical information revoked successfully.'}, status=200)
        return Response(serializer.errors, status=400)

class DoctorSharedHistoryView(APIView):
    """
    API view to handle fetching the shared medical histories for the authenticated doctor.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handle GET request to retrieve shared medical histories for a doctor.

        Args:
            request (Request): The request object.

        Returns:
            Response: The response containing serialized shared medical histories data.
        """
        user = request.user
        try:
            doctor = Doctor.objects.get(user=user)
        except Doctor.DoesNotExist:
            return Response({"message": "Doctor not found."}, status=404)

        # Filter out revoked shared histories
        shared_histories = SharedMedicalInfo.objects.filter(doctor=doctor, revoked_at__isnull=True)
        serializer = SharedMedicalInfoSerializer(shared_histories, many=True)
        return Response(serializer.data, status=200)
