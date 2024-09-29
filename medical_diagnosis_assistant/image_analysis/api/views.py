import json

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import password_changed
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect, reverse
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
# from ..models import
# from .serializers import

from django.conf import settings
from django.core.mail import send_mail

import tensorflow as tf
import numpy as np
from PIL import Image
from ..models import MedicalImage, ImageAnalysisResult

from .serializers import MedicalImageSerializer, ImageAnalysisResultSerializer
from ..utils import save_analysis_results

"""
============================================================================
                        VIEWS FOR MODELS INFERENCE
============================================================================
"""


class TuberculosisTestView(APIView):
    """
    This class represents a view for performing tuberculosis test on medical XRAY images.
    It inherits from the APIView class provided by Django REST framework.
    """

    def get(self, request):
        """
        Handles GET requests.

        Returns a response with a message indicating that the user needs to fill in the details.

        Parameters:
        - request: The incoming HTTP request.

        Returns:
        - A Response object with a JSON payload containing a message.
        """
        return Response({'message':'PLease fill in the details to continue'})

    def post(self, request):
        """
        Handles POST requests.

        Performs the following tasks:
        1. Validates the incoming data using the MedicalImageSerializer.
        2. Saves the medical image.
        3. Loads a pre-trained model for tuberculosis detection.
        4. Resizes and preprocesses the uploaded image.
        5. Predicts the presence of tuberculosis using the loaded model.
        6. Generates an analysis result based on the prediction.
        7. Saves the analysis result.

        Parameters:
        - request: The incoming HTTP request containing the medical image data.

        Returns:
        - A Response object with a JSON payload containing the analysis result.
        - If the incoming data is invalid, returns a Response object with a JSON payload containing the validation errors.
        """
        data = request.data
        serializer = MedicalImageSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            # Save the medical image
            medical_image = serializer.save()

            # Load the pre-trained model
            model = tf.keras.models.load_model('/home/belvisk/Documents/models/tuberculosis.h5')

            # Retrieve the uploaded file
            file = request.FILES['image']
            img = Image.open(file).convert('L')

            # Resize the image to match the model input
            img = img.resize((320, 320))
            x = np.array(img)
            x = np.stack((x,) * 3, axis=-1)
            x = tf.image.resize(x, [320, 320])
            x = np.array(x) / 255.0
            x = np.expand_dims(x, axis=0)

            # Predict with the model
            pred = model.predict(x)
            threshold = 0.5
            label = np.where(pred >= threshold, 1, 0)
            result = int(label)

            # Generate the analysis result
            output = 'Normal' if result == 0 else 'Tuberculosis'
            abnormality_detected = result == 1
            confidence_score = float(pred[0][0])

            # Save the analysis result
            save_analysis_results(
                medical_image, output, abnormality_detected, confidence_score
            )

            return Response({
                'message': 'Analysis completed',
                'result': output,
                'confidence_score': confidence_score,
                'abnormality_detected': abnormality_detected
            }, status=201)

        return Response(serializer.errors, status=400)

class PneumoniaTestView(APIView):
    """
    This class represents a view for performing pneumonia tests on medical images.
    It inherits from the APIView class provided by Django REST framework.
    """

    def get(self, request):
        """
        Handles GET requests.

        Returns a response with a message indicating that the user needs to fill in the details.

        Parameters:
        - request: The incoming HTTP request.

        Returns:
        - A Response object with a JSON payload containing a message.
        """
        return Response({'message': 'Please fill in the details to continue'})

    def post(self, request):
        """
        Handles POST requests.

        Performs the following tasks:
        1. Validates the incoming data using the MedicalImageSerializer.
        2. Saves the medical image.
        3. Loads a pre-trained model for pneumonia detection.
        4. Resizes and preprocesses the uploaded image.
        5. Predicts the presence of pneumonia using the loaded model.
        6. Generates an analysis result based on the prediction.
        7. Saves the analysis result.

        Parameters:
        - request: The incoming HTTP request containing the medical image data.

        Returns:
        - A Response object with a JSON payload containing the analysis result.
        - If the incoming data is invalid, returns a Response object with a JSON payload containing the validation errors.
        """
        data = request.data
        serializer = MedicalImageSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            # Save the medical image
            medical_image = serializer.save()

            # Load the pre-trained model
            model = tf.keras.models.load_model('/home/belvisk/Documents/models/pneumonia.h5')

            # Retrieve the uploaded file
            file = request.FILES['image']
            img = Image.open(file).convert('L')

            # Resize the image to match the model input
            img = img.resize((224, 224))
            x = np.array(img)
            x = np.stack((x,) * 3, axis=-1)
            x = np.expand_dims(x, axis=0)
            x = x / 255.0

            # Predict with the model
            pred = model.predict(x)
            result = int(np.where(pred >= 0.5, 1, 0))

            # Generate the analysis result
            output = 'Normal' if result == 0 else 'Pneumonia'
            abnormality_detected = result == 1
            confidence_score = float(pred[0][0])

            # Save the analysis result
            save_analysis_results(
                medical_image, output, abnormality_detected, confidence_score
            )

            return Response({
                'message': 'Analysis completed',
                'result': output,
                'confidence_score': confidence_score,
                'abnormality_detected': abnormality_detected
            }, status=201)

        return Response(serializer.errors, status=400)

class BonesFractureTestView(APIView):
    """
    This class represents a view for performing bone fracture detection on medical images.
    It inherits from the APIView class provided by Django REST framework.
    """

    def get(self, request):
        """
        Handles GET requests.

        Returns a response with a message indicating that the user needs to fill in the details.
        """
        return Response({'message': 'Please fill in the details to continue'})

    def post(self, request):
        """
        Handles POST requests.

        Processes and analyzes an uploaded image for bone fractures and saves the results.
        """
        data = request.data
        serializer = MedicalImageSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            # Save the medical image
            medical_image = serializer.save()

            # Load the pre-trained model
            model = tf.keras.models.load_model('/home/belvisk/Documents/models/bones.h5')

            # Retrieve the uploaded file
            file = request.FILES['image']
            img = Image.open(file).convert('L')

            # Resize the image
            img = img.resize((224, 224))
            x = np.array(img)
            x = np.stack((x,) * 3, axis=-1)
            x = np.expand_dims(x, axis=0)
            x = x / 255.0

            # Make the prediction
            pred = model.predict(x)
            result = int(np.where(pred >= 0.5, 1, 0))

            # Generate the analysis result
            output = 'Fracture' if result == 0 else 'No Fracture'
            abnormality_detected = result == 0
            confidence_score = float(pred[0][0])

            # Save the analysis result
            save_analysis_results(
                medical_image, output, abnormality_detected, confidence_score
            )

            return Response({
                'message': 'Analysis completed',
                'result': output,
                'confidence_score': confidence_score,
                'abnormality_detected': abnormality_detected
            }, status=201)

        return Response(serializer.errors, status=400)

class BreastCancerTestView(APIView):
    """
    This class represents a view for performing breast cancer detection on medical images.
    It inherits from the APIView class provided by Django REST framework.
    """

    def get(self, request):
        """
        Handles GET requests.

        Returns a response with a message indicating that the user needs to fill in the details.
        """
        return Response({'message': 'Please fill in the details to continue'})

    def post(self, request):
        """
        Handles POST requests.

        Processes and analyzes an uploaded image for breast cancer and saves the results.
        """
        data = request.data
        serializer = MedicalImageSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            # Save the medical image
            medical_image = serializer.save()

            # Load the pre-trained model
            model = tf.keras.models.load_model('/home/belvisk/Documents/models/breast_cancer_classifier.h5')

            # Retrieve the uploaded file
            file = request.FILES['image']
            img = Image.open(file).convert('RGB')

            # Resize the image
            img = img.resize((256, 256))
            x = np.array(img) / 255.0
            x = np.expand_dims(x, axis=0)

            # Make the prediction
            pred = model.predict(x)
            result = int(np.argmax(pred))

            # Generate the analysis result
            output = 'BENIGN' if result == 0 else 'BREAST MALIGNANT'
            abnormality_detected = result == 1
            confidence_score = float(pred[0][result])

            # Save the analysis result
            save_analysis_results(
                medical_image, output, abnormality_detected, confidence_score
            )

            return Response({
                'message': 'Analysis completed',
                'result': output,
                'confidence_score': confidence_score,
                'abnormality_detected': abnormality_detected
            }, status=201)

        return Response(serializer.errors, status=400)

class OralCancerTestView(APIView):
    """
    This class represents a view for performing oral cancer detection on medical images.
    It inherits from the APIView class provided by Django REST framework.
    """

    def get(self, request):
        """
        Handles GET requests.

        Returns a response with a message indicating that the user needs to fill in the details.
        """
        return Response({'message': 'Please fill in the details to continue'})

    def post(self, request):
        """
        Handles POST requests.

        Processes and analyzes an uploaded image for oral cancer and saves the results.
        """
        data = request.data
        serializer = MedicalImageSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            # Save the medical image
            medical_image = serializer.save()

            # Load the pre-trained model
            model = tf.keras.models.load_model('/home/belvisk/Documents/models/oral_cancer_model.h5')

            # Retrieve the uploaded file
            file = request.FILES['image']
            img = Image.open(file).convert('RGB')

            # Resize the image
            img = img.resize((224, 224))
            x = np.array(img) / 255.0
            x = np.expand_dims(x, axis=0)

            # Make the prediction
            pred = model.predict(x)
            result = int(np.argmax(pred))

            # Generate the analysis result
            output = 'normal' if result == 0 else 'Oral Cancer'
            abnormality_detected = result == 1
            confidence_score = float(pred[0][result])

            # Save the analysis result
            save_analysis_results(
                medical_image, output, abnormality_detected, confidence_score
            )

            return Response({
                'message': 'Analysis completed',
                'result': output,
                'confidence_score': confidence_score,
                'abnormality_detected': abnormality_detected
            }, status=201)

        return Response(serializer.errors, status=400)


"""
============================================================================
                        VIEWS FOR USER DASHBOARD
============================================================================
"""


class AnalysisResultsView(APIView):
    """
    This class represents a view for retrieving analysis results for a specific user.
    It inherits from the APIView class provided by Django REST framework.
    """

    def get(self, request):
        """
        Handles GET requests.

        Retrieves and returns the analysis results along with the medical image details for the authenticated user.

        Parameters:
        - request: The incoming HTTP request.

        Returns:
        - A Response object with a JSON payload containing the user's analysis results and related medical image data.
        """
        user = 1
        try:
            # Retrieve medical images for the authenticated user
            medical_images = MedicalImage.objects.filter(user=user)

            if not medical_images.exists():
                return Response({'message': 'No medical images found for this user.'}, status=404)

            # Retrieve corresponding analysis results for those medical images
            results = ImageAnalysisResult.objects.filter(medical_image__in=medical_images)

            if not results.exists():
                return Response({'message': 'No analysis results found for the user\'s medical images.'}, status=404)

            # Serialize the results
            serializer = ImageAnalysisResultSerializer(results, many=True)

            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)
