from rest_framework import serializers
from patient_records.models import PatientHistory,SharedMedicalInfo
from accounts.models import Doctor
from symptom_analysis.api.serializers import SymptomAnalysisSerializer
from django.utils import timezone

class PatientHistorySerializer(serializers.ModelSerializer):
    symptom_analysis = SymptomAnalysisSerializer(read_only=True)

    class Meta:
        model = PatientHistory
        fields = ['id', 'patient', 'symptom_analysis', 'created_at']


class DoctorListSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    class Meta:
        model = Doctor
        fields = ['user_id', 'specialization', 'license_number', 'years_of_experience']


class ShareMedicalInfoSerializer(serializers.ModelSerializer):
    doctor_user_id = serializers.IntegerField(write_only=True)
    patient_history_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SharedMedicalInfo
        fields = ['doctor_user_id', 'patient_history_id']

    def validate(self, data):
        # Validate that the patient history exists
        try:
            patient_history = PatientHistory.objects.get(id=data['patient_history_id'])
        except PatientHistory.DoesNotExist:
            raise serializers.ValidationError("Patient history not found.")

        # Validate that the doctor exists by user ID
        try:
            doctor = Doctor.objects.get(user_id=data['doctor_user_id'])
        except Doctor.DoesNotExist:
            raise serializers.ValidationError("Doctor not found.")

        # Check if the history is already shared with this doctor
        if SharedMedicalInfo.objects.filter(patient=self.context['request'].user, doctor=doctor,
                                            patient_history=patient_history).exists():
            raise serializers.ValidationError("This history has already been shared with the selected doctor.")

        return data

    def create(self, validated_data):
        patient = self.context['request'].user
        doctor = Doctor.objects.get(user_id=validated_data['doctor_user_id'])
        patient_history = PatientHistory.objects.get(id=validated_data['patient_history_id'])
        return SharedMedicalInfo.objects.create(patient=patient, doctor=doctor, patient_history=patient_history)


class RevokeMedicalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedMedicalInfo
        fields = ['id']  # We only need the id to revoke the shared info

    def validate(self, data):
        # Validate that the shared medical info exists
        try:
            shared_info = SharedMedicalInfo.objects.get(id=data['id'])
        except SharedMedicalInfo.DoesNotExist:
            raise serializers.ValidationError("Shared medical info not found.")

        # Ensure the current user is the patient who shared the info
        if shared_info.patient != self.context['request'].user:
            raise serializers.ValidationError("You do not have permission to revoke this shared information.")

        return data

    def update(self, instance, validated_data):
        instance.revoked_at = timezone.now()  # Set the revoked time
        instance.save()
        return instance



class SharedMedicalInfoSerializer(serializers.ModelSerializer):
    patient = serializers.StringRelatedField()
    patient_history = serializers.SerializerMethodField()

    class Meta:
        model = SharedMedicalInfo
        fields = ['patient', 'patient_history', 'shared_at', 'revoked_at']

    def get_patient_history(self, obj):
        return PatientHistorySerializer(obj.patient_history).data
