"""MongoDB connection and authentication dependencies shared by controllers."""
import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

from auth import get_current_user_factory, require_admin_factory
from app.repositories import MongoRepositories

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]
repositories = MongoRepositories(db)
get_current_user = get_current_user_factory(db)
require_admin = require_admin_factory(get_current_user)
logger = logging.getLogger("elitec.api")
