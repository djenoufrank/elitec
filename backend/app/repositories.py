"""Persistence adapters. HTTP controllers use these instead of Motor directly."""


class MongoCollectionRepository:
    """Small adapter around one Motor collection, preserving its async API."""

    def __init__(self, collection):
        self._collection = collection

    def find(self, *args, **kwargs):
        return self._collection.find(*args, **kwargs)

    async def find_one(self, *args, **kwargs):
        return await self._collection.find_one(*args, **kwargs)

    async def insert_one(self, *args, **kwargs):
        return await self._collection.insert_one(*args, **kwargs)

    async def update_one(self, *args, **kwargs):
        return await self._collection.update_one(*args, **kwargs)

    async def delete_one(self, *args, **kwargs):
        return await self._collection.delete_one(*args, **kwargs)

    async def count_documents(self, *args, **kwargs):
        return await self._collection.count_documents(*args, **kwargs)

    async def create_index(self, *args, **kwargs):
        return await self._collection.create_index(*args, **kwargs)


class MongoRepositories:
    """Named persistence gateways, grouped by the domain that owns the data."""

    def __init__(self, database):
        for collection_name in (
            "contacts", "quotes", "users", "tickets",
            "blog_posts", "kb_articles",
        ):
            setattr(
                self,
                collection_name,
                MongoCollectionRepository(database[collection_name]),
            )
