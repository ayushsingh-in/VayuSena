import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

DATABASE_URL = "sqlite+aiosqlite:///./vayusena.db"

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

class Hotspot(Base):
    __tablename__ = "hotspots"
    id = Column(String, primary_key=True, index=True) # e.g. "HS-lat-lng-date"
    lat = Column(Float, index=True)
    lng = Column(Float, index=True)
    frp = Column(Float)
    intensity = Column(String)
    state = Column(String, index=True)
    district = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class DailyAQI(Base):
    __tablename__ = "daily_aqi"
    id = Column(Integer, primary_key=True, autoincrement=True)
    city = Column(String, index=True)
    date = Column(String, index=True) # e.g. '2026-09-03'
    aqi = Column(Integer)
    pm25 = Column(Float)
    
class Alert(Base):
    __tablename__ = "alerts"
    id = Column(String, primary_key=True, index=True)
    date = Column(String)
    district = Column(String)
    predictedAqi = Column(Integer)
    severity = Column(String)
    status = Column(String)
    recommendation = Column(String)

class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
