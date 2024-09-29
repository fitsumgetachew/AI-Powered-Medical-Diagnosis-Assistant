from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(name = 'gpt-4o-mini', openai_api_key = '')
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
