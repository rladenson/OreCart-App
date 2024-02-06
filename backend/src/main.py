from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth.schemas import UserCreate, UserRead
from .auth.user_manager import auth_backend, fastapi_users
from .db import Base, DBWrapper
from .handlers import alert, auth_check, ridership, routes, stops, vans
from .hardware import HardwareExceptionMiddleware
from .vantracking.factory import van_tracker
from .vantracking.tracker import VanTracker

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # How can we avoid hardcoding these?
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5173/vans",
        "http://localhost:5173/ridership",
        "http://localhost:5173/routes",
        "http://localhost:5173/accomodations",
        "http://localhost:5173/alerts",
        "http://localhost:5173/login",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(HardwareExceptionMiddleware)
app.include_router(routes.router)
app.include_router(stops.router)
app.include_router(alert.router)
app.include_router(ridership.router)
app.include_router(vans.router)
app.include_router(auth_check.router)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth",
    tags=["auth"],
)
# Something will have to be done to tighten the security of this endpoint. It should
# probably be removed altogether; registration can be left to manual database editing.
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)


@app.on_event("startup")
async def startup_event():
    app.state.db = DBWrapper()
    app.state.van_tracker: VanTracker = van_tracker()

    async with app.state.db.engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
