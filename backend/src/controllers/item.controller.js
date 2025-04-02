import Item from "../models/item.model.js";
import { v4 as uuidv4 } from 'uuid';

export const addNewItem = async (req, res) => {
  try {
    const { name, description, category, totalQuantity, lowStockThreshold } = req.body;

    // Validate required fields
    if (!name || !description || !category || !totalQuantity || !lowStockThreshold) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Generate instances array with unique serial numbers for each item instance
    const instances = [];
    for (let i = 0; i < totalQuantity; i++) {
      // Create a unique serial number using a prefix (first 3 letters of the name) and a UUID
      const serialNumber = `${name.substring(0, 3).toUpperCase()}-${uuidv4()}`;
      instances.push({ serialNumber, status: 'available' });
    }

    // Create the new item with availableQuantity set equal to totalQuantity
    const newItem = new Item({
      name,
      description,
      category,
      totalQuantity,
      availableQuantity: totalQuantity,
      lowStockThreshold,
      instances
    });

    await newItem.save();

    return res.status(201).json({ message: "Item created successfully", newItem });
  } catch (error) {
    console.error("Error in addNewItem controller:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    return res.status(200).json(items);
  } catch (error) {
    console.error("Error in getAllItems controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getItem = async(req,res) =>{
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        return res.status(200).json(item);
    } catch (error) {
        console.error("Error in getItem controller:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const incrementInstances = async (req, res) => {
    try {
      const { itemId, additionalQuantity } = req.body;
      
      // Validate required fields
      if (!itemId || !additionalQuantity) {
        return res.status(400).json({ message: 'Item ID and additional quantity are required.' });
      }
      
      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: 'Item not found.' });
      }
      
      // Generate new instances for the additional quantity
      const newInstances = [];
      for (let i = 0; i < additionalQuantity; i++) {
        // Create a unique serial number: a prefix based on the item name and a UUID
        const serialNumber = `${item.name.substring(0, 3).toUpperCase()}-${uuidv4()}`;
        newInstances.push({ serialNumber, status: 'available' });
      }
      
      // Add new instances to the existing instances array
      item.instances.push(...newInstances);
      
      // Update the total and available quantities accordingly
      item.totalQuantity += additionalQuantity;
      item.availableQuantity += additionalQuantity;
      
      // Save the updated item document
      await item.save();
      
      return res.status(200).json({ message: 'Instances added successfully', item });
    } catch (error) {
      console.error('Error incrementing instances:', error);
      return res.status(500).json({ message: error.message });
    }
  };