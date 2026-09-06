import asyncio
from backend.database import engine, Base, Admin, AsyncSessionLocal
from sqlalchemy.future import select

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSessionLocal() as session:
        stmt = select(Admin).where(Admin.email == "admin@vayusena.in")
        result = await session.execute(stmt)
        if not result.scalars().first():
            session.add(Admin(email="admin@vayusena.in", password="admin123"))
            await session.commit()

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Admin))
        for admin in result.scalars():
            print(f"ID: {admin.id} | Email: {admin.email} | Password: {admin.password}")

asyncio.run(main())
