# PROJECT DESCRIPTION
# Project Name- Ship Ready

# Brief Idea about the Project 
Ship Ready is an AI-powered platform which helps the hackathon teams to analyse thier project by themselves before
presenting in front of the Judges. It will analyse such as Github Repo for documentation, setup clarity, security issues and overall demo readiness.
After the analysis is done it will then generate improving suggestions such as scorecards and AI generated startup style pitch.

# Tech Stack
1. Frontend - Next.js 14 / React.js
2. Styling - Tailwind CSS
3. Backend - FastAPI (Python)
4. AI Layer - OpenAI API (GPT-4o)
5. Automation- Gumloop (SilverSponsor)
6. Development Vercel (frontend) + Render (backend)
7. Mocking- Beeceptor (Community Sponsor)

# Team Roles
Person 1 - Frontend
1. Have a landing page
2. Project Input form (URL,description, file tree, screenshots)
3. Warnings Panel with priority level (critical/ warning/suggestion)
4. Fix board showing prioritized action items
5. Pitch display panel (text effect for AI output)
6. Ready for Judges final indicator (pass/fail visual)
7. Mobile Responsiveness (Judges may view on Phone)
8. Use Beeceptor mocks (Never wait on the backend)

Person 2 - Backend
1. Having CORS configured for Backend and FrontEnd communication
2. We deploy backend early
3. Analysis engine: Readme Check, setup instructions, exposed API Key scans
4. Scoring System: Weigheted Score per category then we get the aggregate
5. Checklist Engine returning structured JSON
6. POST/ analyze and POST/ pitch endpoints
7. Gumloop pipeline integration
8. Basic Demo

Person 3 - AI Layer
1. Build the Bad Repo
2. Build the Good Repo
3. These are the live demo inputs
4. Prompt Engineer the pitch generator: System Prompt, Tone, Output format
5. Prompt Engineer the recommendation wording
6. Wire the Gumloop workflow with Person 2
7. Test pitch output quality across both sample repos- iterate until it sounds like a startup pitch

Person 4 - Demo/QA/Presentation
1. Write Readme for ShipReady
2. Prepare the 3-minute demo script
3. Check MLH side prizes on arrival and map which ones are applicable
4. Prepare all the sponsor pitch angles.
