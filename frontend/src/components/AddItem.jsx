import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import useItemStore from '../store/useItemStore';

const AddItem = () => {
  const { addNewItem, loading } = useItemStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    totalQuantity: '',
    lowStockThreshold: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.description || !formData.category || !formData.totalQuantity || !formData.lowStockThreshold) {
      toast.error("All fields are required");
      return;
    }
    await addNewItem({ 
      ...formData, 
      totalQuantity: Number(formData.totalQuantity),
      lowStockThreshold: Number(formData.lowStockThreshold)
    });
    setFormData({
      name: '',
      description: '',
      category: '',
      totalQuantity: '',
      lowStockThreshold: ''
    });
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Add New Item</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded-md"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded-md"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded-md"
        />
        <input
          type="number"
          name="totalQuantity"
          placeholder="Total Quantity"
          value={formData.totalQuantity}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded-md"
        />
        <input
          type="number"
          name="lowStockThreshold"
          placeholder="Low Stock Threshold"
          value={formData.lowStockThreshold}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded-md"
        />
        <button type="submit" disabled={loading} className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700">
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
