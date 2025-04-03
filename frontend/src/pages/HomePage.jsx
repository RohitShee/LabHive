import React, { useEffect } from "react";
import useItemStore from "../stores/useItemStore";
import ItemCard from "../components/ItemCard";

const HomePage = () => {
  const { items, getAllItems, loading, error } = useItemStore();

  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">All Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items && items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
