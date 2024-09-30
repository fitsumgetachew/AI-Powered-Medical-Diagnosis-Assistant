from .serializers import (PatientHistorySerializer, DoctorListSerializer,
                          ShareMedicalInfoSerializer ,SharedMedicalInfoSerializer,
                          RevokeMedicalInfoSerializer)
from patient_records.models import PatientHistory,SharedMedicalInfo
from accounts.models import Doctor
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone


class SymptomAnalysisHistoryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        patient_history = PatientHistory.objects.filter(patient=user)
        serializer = PatientHistorySerializer(patient_history, many=True)
        return Response(serializer.data, status=200)


class ListDoctorsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        doctors = Doctor.objects.all()
        serializer = DoctorListSerializer(doctors, many=True)
        return Response(serializer.data, status=200)

class ShareHistoryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self , request, *args , **kwargs):
        serializer = ShareMedicalInfoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Patient history shared successfully.'}, status=200)
        return Response(serializer.errors, status=400 )


class RevokeMedicalInfoView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = RevokeMedicalInfoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            shared_info = SharedMedicalInfo.objects.get(id=serializer.validated_data['id'])
            shared_info.revoked_at = timezone.now()
            shared_info.save()
            return Response({'message': 'Shared medical information revoked successfully.'}, status=200)
        return Response(serializer.errors, status=400)


class DoctorSharedHistoryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            doctor = Doctor.objects.get(user=user)
        except Doctor.DoesNotExist:
            return Response({"message": "Doctor not found."}, status=404)

        # Filter out revoked shared histories
        shared_histories = SharedMedicalInfo.objects.filter(doctor=doctor, revoked_at__isnull=True)
        serializer = SharedMedicalInfoSerializer(shared_histories, many=True)
        return Response(serializer.data, status=200)

#npm run dev