from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Drug
from .serializers import DrugSerializer
from ..models import Prescription
from .serializers import PrescriptionSerializer


class DrugAPIView(APIView):
    """
    API view to handle GET, POST, and PATCH requests for the Drug model.
    """

    def get(self, request, pk=None):
        """
        Handle GET requests to retrieve a list of all drugs or a specific drug by its primary key (pk).

        Args:
            request: The HTTP request object.
            pk: The primary key of the drug to retrieve (optional).

        Returns:
            Response: A Response object containing the serialized drug data and HTTP status code 200.
        """
        if pk:
            drug = get_object_or_404(Drug, pk=pk)
            serializer = DrugSerializer(drug)
        else:
            drugs = Drug.objects.all()
            serializer = DrugSerializer(drugs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Handle POST requests to create a new drug.

        Args:
            request: The HTTP request object containing the drug data.

        Returns:
            Response: A Response object containing the serialized drug data and HTTP status code 201 if created successfully,
                      or the validation errors and HTTP status code 400 if the data is invalid.
        """
        serializer = DrugSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        """
        Handle PATCH requests to partially update an existing drug by its primary key (pk).

        Args:
            request: The HTTP request object containing the partial drug data.
            pk: The primary key of the drug to update.

        Returns:
            Response: A Response object containing the serialized drug data and HTTP status code 200 if updated successfully,
                      or the validation errors and HTTP status code 400 if the data is invalid.
        """
        drug = get_object_or_404(Drug, pk=pk)
        serializer = DrugSerializer(drug, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PrescriptionListCreateAPIView(APIView):
    """
    API view to handle GET and POST requests for the Prescription model.
    """

    def get(self, request):
        """
        Handle GET requests to retrieve a list of all prescriptions.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A Response object containing the serialized prescription data and HTTP status code 200.
        """
        prescriptions = Prescription.objects.all()
        serializer = PrescriptionSerializer(prescriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Handle POST requests to create a new prescription.

        Args:
            request: The HTTP request object containing the prescription data.

        Returns:
            Response: A Response object containing the serialized prescription data and HTTP status code 201 if created successfully,
                      or the validation errors and HTTP status code 400 if the data is invalid.
        """
        serializer = PrescriptionSerializer(data=request.data)
        if serializer.is_valid():
            try:
                prescription = serializer.save()

                # Handle the many-to-many relationship for drugs
                drug_ids = request.data.get('drugs', [])
                drugs = Drug.objects.filter(id__in=drug_ids)
                prescription.drugs.set(drugs)

                # Check for drug interactions
                drug_names = [drug.name for drug in drugs]
                interaction_api = DrugInteractionAPIView()
                request_data = {'prescription_drugs': drug_names}
                response = interaction_api.post(request, request_data)

                # Handle the interaction response
                if response.status_code == status.HTTP_200_OK:
                    interactions = response.data
                    # You can handle the interactions as needed, e.g., log them, notify the doctor, etc.
                    print("Drug interactions:", interactions)
                else:
                    # Handle the error case
                    print("Error checking drug interactions:", response.data)

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PrescriptionRetrieveUpdateDestroyAPIView(APIView):
    """
    API view to handle retrieving, updating, and deleting a prescription by its primary key (pk).
    """

    def get(self, request, pk):
        """
        Handle GET requests to retrieve a specific prescription by its primary key (pk).

        Args:
            request: The HTTP request object.
            pk: The primary key of the prescription to retrieve.

        Returns:
            Response: A Response object containing the serialized prescription data and HTTP status code 200.
        """
        prescription = get_object_or_404(Prescription, pk=pk)
        serializer = PrescriptionSerializer(prescription)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """
        Handle PUT requests to update an existing prescription by its primary key (pk).

        Args:
            request: The HTTP request object containing the updated prescription data.
            pk: The primary key of the prescription to update.

        Returns:
            Response: A Response object containing the serialized prescription data and HTTP status code 200 if updated successfully,
                      or the validation errors and HTTP status code 400 if the data is invalid.
        """
        prescription = get_object_or_404(Prescription, pk=pk)
        serializer = PrescriptionSerializer(prescription, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Handle DELETE requests to delete an existing prescription by its primary key (pk).

        Args:
            request: The HTTP request object.
            pk: The primary key of the prescription to delete.

        Returns:
            Response: A Response object with HTTP status code 204 indicating successful deletion.
        """
        prescription = get_object_or_404(Prescription, pk=pk)
        prescription.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DrugInteractionAPIView(APIView):
    """
    API view to check for drug interactions using a medical LLM.
    """

    def post(self, request, request_data):
        """
        Handle POST requests to check for drug interactions.

        Args:
            request: The HTTP request object containing the prescription data.

        Returns:
            Response: A Response object containing the interaction results and HTTP status code 200.
        """
        prescription_drugs = request_data['prescription_drugs']
        interactions = self.check_interactions(prescription_drugs)
        return Response({'interactions':interactions}, status=status.HTTP_200_OK)

    def check_interactions(self, prescription_drugs):
        """
        Check for interactions between the prescribed drugs using a medical LLM.

        Args:
            prescription_drugs: A list of prescribed drugs.

        Returns:
            dict: A dictionary containing interaction results.
        """
        from langchain_openai import ChatOpenAI
        from langchain.chains import LLMChain
        from langchain.prompts import PromptTemplate

        # Initialize the LLM
        llm = ChatOpenAI(name='gpt-4o-mini',
                         openai_api_key='')
        template = """
        Check for interactions between the following drugs: {prescription_drugs}
        """

        # Prepare the prompt
        prompt = PromptTemplate(template=template, input_variables=["prescription_drugs"])
        chain = LLMChain(llm=llm, prompt=prompt)

        # Get the response from the LLM
        response = chain.run(prescription_drugs=prescription_drugs)

        # Parse the response (assuming the response is a JSON string)
        # interactions = json.loads(response)
        response = response.strip()
        return response