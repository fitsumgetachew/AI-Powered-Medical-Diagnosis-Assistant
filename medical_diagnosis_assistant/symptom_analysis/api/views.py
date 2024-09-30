from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from symptom_analysis.models import Conversation, SymptomAnalysis, Symptom
from .serializers import (
    ConversationSerializer,
    ConversationListSerializer,
    SymptomAnalysisSerializer,
    ConversationDetailSerializer
)
from .utils import symptom_analyzer , analysis_result_chain, generate_conversation_name, extract_symptoms_from_text
from patient_records.models import PatientHistory


class ChatResponseView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        conversation_id = request.data.get('conversation_id')
        user_message = request.data.get('user_message')

        if conversation_id:
            conversation = get_object_or_404(Conversation, pk=conversation_id)# user=request.user)
            history = {
                'user_message': conversation.user_message,
                'ai_response': conversation.ai_response
            }
        else:
            print("new")
            conversation_name = generate_conversation_name(user_message)
            conversation = Conversation.objects.create(user=request.user , name = conversation_name)
            print("created")
            history = {'user_message': [], 'ai_response': []}

        new_ai_response = symptom_analyzer(user_message=user_message, history=history)

        conversation.user_message.append(user_message)
        conversation.ai_response.append(new_ai_response)
        conversation.save()

        serializer = ConversationSerializer(conversation)
        return Response({'ai_response': new_ai_response, 'conversation': serializer.data})


class ConversationListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversations = Conversation.objects.all()#filter(user=request.user)
        serializer = ConversationListSerializer(conversations, many=True)
        return Response(serializer.data)


class ConversationDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, pk=conversation_id)
        serializer = ConversationDetailSerializer(conversation)
        return Response(serializer.data)


class AnalyzeSymptomView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        conversation_id = request.data.get('conversation_id')
        conversation = get_object_or_404(Conversation, pk=conversation_id)

        conversation_history = {
            'user_message': conversation.user_message,
            'ai_response': conversation.ai_response
        }

        analysis_result = analysis_result_chain(conversation_history)
        symptoms = extract_symptoms_from_text(conversation_history['user_message'])

        symptom_objects = []
        for symptom_name in symptoms:
            symptom, created = Symptom.objects.get_or_create(name=symptom_name)
            symptom_objects.append(symptom)

        symptom_analysis, created = SymptomAnalysis.objects.get_or_create(
            user=request.user,
            conversation=conversation,
            defaults={'analysis_result': analysis_result}
        )
        if not created:
            symptom_analysis.analysis_result = analysis_result
            symptom_analysis.save()

        symptom_analysis.symptoms.set(symptom_objects)

        serializer = SymptomAnalysisSerializer(symptom_analysis)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SaveToHistoryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        symptom_analysis_id = request.data.get('symptom_analysis_id')


        symptom_analysis = get_object_or_404(SymptomAnalysis, id=symptom_analysis_id)

        patient_history = PatientHistory.objects.create(
            patient=user,
            symptom_analysis=symptom_analysis,

        )

        return Response({'status': 'History saved successfully'}, status=status.HTTP_201_CREATED)
