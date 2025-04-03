import React from "react";

const ItemCard = ({ item, onClick }) => {
  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 shadow-md hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
      <p className="text-gray-300 mb-2">{item.description}</p>
      <p className="mb-1">
        <strong>Category:</strong> {item.category}
      </p>
      <p className="mb-1">
        <strong>Available:</strong> {item.availableQuantity} / {item.totalQuantity}
      </p>
      {item.availableQuantity < item.lowStockThreshold && (
        <p className="text-red-500 font-semibold">Low Stock!</p>
      )}
      {onClick && (
        <button
          onClick={() => onClick(item)}
          className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          View Details
        </button>
      )}
    </div>
  );
};

export default ItemCard;
