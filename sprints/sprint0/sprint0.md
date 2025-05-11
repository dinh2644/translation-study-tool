# **Project Overview**

## **Application Vision/Goal:**
[Describe the overall purpose and vision of the application. What problem does it solve? Who is the target audience?]
The overall purpose and vision of the application is to allow people to get reliable translations for online videos that don't have reliable subtitles. The target audience is for language learners who want to learn a new language. 

## **Scope:**
[List the major features and functionalities that define the scope of the project. Keep this high-level to avoid feature creep.]
The Core feature would be to have embedded youtube videos with a dialogue translation view of the current transcript. Another major feature would allow users to save vocabulary words from the live english translation to a list and turn the list into a flashcard deck.

## **Deliverables:**
[List what will be delivered by the end of the project, such as a working MVP (Minimum Viable Product), specific features, documentation, etc.]
At the end of the project we will deliver a product that will give the core feature which allows users to extend their language learning using embedded non-english videos translation tool. A sub feature would allow users to create personlized flashcards of the specific video to learn how to speak in context. A detailed documentation of our tech stack will be provided.

## **Success Criteria:**
[Define what will make this project successful. Examples include meeting deadlines, delivering core functionality, or achieving performance benchmarks.]
Collaborate with each team member and provide constructive criticism along the way. We want to meet every deadline with a shippable feature especially our core functionality using the agile method. We also want to prevent malicious users from uploading extremely large video files that will affect the servers and apis.

## **Assumptions:**
[List any assumptions about the technology, users, or resources that could impact development.]
Our API(s) might not have the most accurate translation meaning we might not feel satisfied with our feature. There might be limitations on API requests which could significantly affect our extensive high level testing to ensure perfection of the app website we are developing. 

## **Risks:**
[Identify potential risks and challenges, such as technical limitations, resource constraints, or dependency issues.]
Finding solid APIs that provides accurate english translation. APIs limits may impact our product's usability due to a possibility of a lack of extensive testing.


## **Design / Architectural Review:**
[Outline the initial thoughts on application architecture. Will it be monolithic or microservices? Will it use a database? What major components will be included?]
The application architecture we will be using is monolithic. We will have a frontend, backend, and database. It will use a SQL back end database to store all users' saved vocabulary words which can be utilized to form flashcards decks. Our models will consist of a list of vocabulary words that are saved and the flashcard deck that was generated.   

## **Test Environment:**
[Define how the application will be tested. Will you use automated tests? What environment will the tests run in?]
We will do end-to-end testing for our API endpoints to test user flows and use testing frameworks like Jest to assert expected outcomes like if a component should do what it's supposed to. Testing will be done mostly in a development environment.


---

# **Team Setup**

## **Team Members:**
[List all team members involved in the project.]
Eric Chen, Varun Dileepan, Tu Dinh
## **Team Roles:**
[Define roles for each team member, such as developer, designer, project manager, QA tester, etc.]
Eric Chen: Designer, and Developer
Varun Dileepan: Developer, QA Tester, and Project Manager
Tu Dinh: Developer, and QA Tester
## **Team Norms:**
[Establish how the team will communicate, how often meetings will happen, and any other ground rules for collaboration.]
We will have two meetings a week after class in person and the team will communicate via a discord group chat. In order to ensure maximum efficency it is of great importance to listen to one another and each of our ideas and find ways to include all three of our ideas to get the best outcome possible.

## **Application Stack:**
[List all the technologies being used in the project, including programming languages, frameworks, and tools.]
All the technologies that will be used in the project include the following frameworks/APIs:
1. Youtube Transcript Extraction: https://pypi.org/project/youtube-transcript-api/
2. Speechflow
3. Scribebuddy
4. Transcript Index: https://cloud.google.com/video-intelligence/docs/transcription#video_speech_transcription_gcs-python
5. Google Cloud: https://cloud.google.com/video-intelligence/docs/transcription#video_speech_transcription_gcs-python

We will use HTML/CSS, JavaScript for frontend, Node and Python (FastAPI) for backend (depending on our API and database usage), and a noSQL or SQL database depending on team members' choice, Postman for endpoint testing, Playwright for end to end testing, Jest for codebase testing. 

### **Libraries/Frameworks:**
[List any specific libraries or frameworks your application will use, such as React, Flask, Django, etc.]
The best library or framework your application will use is Next.js.

React/Next.js/TailwindCSS, Node and FastAPI (if needed), MongoDB and/or Supabase (or other SQL databases depending on team members), Auth0 for authentication, video speech to text and text translation APIs listed above. 
