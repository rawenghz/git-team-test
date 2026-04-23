from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, users, classes, enfants, evenements, notifications, journal, dashboard
from routes import participations

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartKids API",
    description="Backend de la crèche intelligente SmartKids",
    version="1.0.0"
)

# Configuration CORS (pour le frontend Angular) 
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost(:[0-9]+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    #max_age=600,
)


app.include_router(auth.router,          prefix="/auth",          tags=["Authentification"])
app.include_router(users.router,         prefix="/users",         tags=["Utilisateurs"])
app.include_router(classes.router,       prefix="/classes",       tags=["Classes"])
app.include_router(enfants.router,       prefix="/enfants",       tags=["Enfants"])

app.include_router(evenements.router,    prefix="/evenements",    tags=["Événements"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(journal.router,       prefix="/journal",       tags=["Journal"])
app.include_router(dashboard.router,     prefix="/directrice/dashboard", tags=["Dashboard"])
app.include_router(participations.router, prefix="/evenements", tags=["Participations"])


