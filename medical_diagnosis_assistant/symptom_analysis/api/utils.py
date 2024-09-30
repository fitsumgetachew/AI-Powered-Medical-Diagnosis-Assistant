from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(name = 'gpt-4o-mini', openai_api_key = 'REMOVED_API_KEY')
def symptom_analyzer(user_message, history):
    template = """
    You are a medical chatbot specialized in symptom analysis. Your role is to provide informative and helpful responses to users describing their symptoms. 
    Consider the conversation history and the current user message to give an appropriate response.

    Conversation history:
    {history}

    User: {user_message}
    AI:
    """

    prompt = PromptTemplate(template=template, input_variables=["history", "user_message"])

    chain = LLMChain(llm=llm, prompt=prompt)

    response = chain.run(history=str(history), user_message=user_message)
    return response.strip()


def analysis_result_chain(history):
    template = """
    Analyze the following conversation between a user and a medical chatbot. 
    Provide a summary of the symptoms discussed, potential diagnoses mentioned, and any recommendations given.

    Conversation:
    {history}

    Summary:
    """

    prompt = PromptTemplate(template=template, input_variables=["history"])

    chain = LLMChain(llm=llm, prompt=prompt)

    response = chain.run(history=str(history))
    return response.strip()

def generate_conversation_name(user_message):
    template = """
        You are and AI expert which creates name for the conversation based on user first question, 
        mainly the question is about symptom and health related topic so consider theat to generate the name properly
        User Message:
        {user_message}

        conversation name:
        """
    print(user_message)
    prompt = PromptTemplate(template=template, input_variables=["user_message"])

    chain = LLMChain(llm=llm, prompt=prompt)

    response = chain.run(user_message=str(user_message))
    return response.strip()


def extract_symptoms_from_text(conversation_history):
    template = """
    Extract and list all symptoms mentioned in the following conversation between a user and a medical chatbot.
    Only include the symptoms without any additional text.

    Conversation:
    {conversation_history}

    Symptoms:
    """

    prompt = PromptTemplate(template=template, input_variables=["conversation_history"])

    chain = LLMChain(llm=llm, prompt=prompt)

    response = chain.run(conversation_history=str(conversation_history))

    # Assuming the LLM returns symptoms as a newline-separated string
    symptoms = [symptom.strip() for symptom in response.split('\n') if symptom.strip()]

    return symptoms