
# AI-Powered-Medical-Diagnosis-Assistant
two user type doctors and normal users/patients/
we will have follwing features
- Medical Image Analysis : where both users upload images of ( X-rays, CT scans, and MRIs to detect) and we pass it through
  our trained CNN model to detect if there is abonormality
- based on detection provide perlimanry dignoses kind of report using LLMs
- and will have a feature to download the last result in pdf fromat as prescription

## Symptom Analysis 
- this feature is for both patient and doctors also we provide it in the form of chatbot using LLMs so they can interact with the system to get more information about users condition or patients their own condition on for doctors for their patients
  - beside the convesation if user want's to analyze overall conversation they are able to analyze it
  - then if it's for patient we ask confirmation to save the conversation as their history and we save and share this information in the future to for patient data analysis and share for other doctors
  ## Drug Prescriptions and managment
  - here is specially for doctors where doctors will upload patient result information report or write the condition directly then we give detail information about the drug description and way of taking the drug like dossage and some detail what we suppose to take or not with the mediciene
  - and will have a feature to download the last result in pdf fromat as prescription

  ## Patient Data analysis
  - here we save information which are user checked before and gives analysis report on the dashbord of the user
  - and in the future also the user/patient should be able to send/share these information for any of the doctors in the system or
  - here we will have a fetures like visualization or any appropriate analysis of user previouse information

git clone https://github.com/fitsumgetachew/AI-Powered-Medical-Diagnosis-Assistant.git
APIs configuration
create vertual environment 
linux (ubuntu)
python -m venv venv
activate vertual environment
source venv/bin/activate
install dependecies
cd medical_diagnosis_assistant
pip install -r requirements.txt

create .env file to save personal infromations 
add the follwoing information on the .env file
MAIL_SERVER = 'smtp.gmail.com'
MAIL_USE_TLS = True
MAIL_USERNAME = 'your mail adderess'
MAIL_PASSWORD = 'mail password'
MAIL_DEFAULT_SENDER = 'another mail address '
API_KEY=add your open AI api key

python manage.py runserver 8000

run frontend 
cd frontend/medical-assistant-frontend

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
rm -rf node_modules package-lock.json
npm install
npm run dev

now you can access the page using the url of frontend



npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}



