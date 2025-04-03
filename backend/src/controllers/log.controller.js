import User from '../models/User.js';
import Item from '../models/Item.js';
import UsageLog from '../models/UsageLog.js';

export const borrowItem = async (req, res) => {
  try {
    // Expected fields from frontend
    const { userName, itemName, serialNumbers } = req.body;
    
    // Validate input fields
    if (!userName || !itemName || !serialNumbers || !Array.isArray(serialNumbers) || serialNumbers.length === 0) {
      return res.status(400).json({ message: "Required fields: userName, itemName, and non-empty serialNumbers array" });
    }
    
    // Lookup user by name
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Lookup item by name
    const item = await Item.findOne({ name: itemName });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    // Calculate expected return date based on user role
    const daysToAdd = user.role === "Student" ? 10 : 15;;
    const expectedReturnDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
    
    // Check and update each serial number for availability
    for (const sn of serialNumbers) {
      const instance = item.instances.find(inst => inst.serialNumber === sn);
      if (!instance) {
        return res.status(400).json({ message: `Serial number ${sn} does not exist for this item.` });
      }
      if (instance.status !== 'available') {
        return res.status(400).json({ message: `Serial number ${sn} is not available for borrowing.` });
      }
      // Mark instance as borrowed
      instance.status = 'borrowed';
    }
    
    // Update available quantity
    item.availableQuantity -= serialNumbers.length;
    if (item.availableQuantity < 0) {
      return res.status(400).json({ message: "Not enough available items to borrow." });
    }
    
    await item.save();
    
    // Create a usage log
    const newUsageLog = new UsageLog({
      user: user._id,
      item: item._id,
      serialNumbers,
      action: "borrowed",
      expectedReturnDate
    });
    
    await newUsageLog.save();
    
    // Respond with user email, item name, serial numbers, and expected return date
    return res.status(200).json({
      message: "Item borrowed successfully",
      data: {
        userEmail: user.email,
        itemName: item.name,
        serialNumbers,
        expectedReturnDate
      }
    });
    
  } catch (error) {
    console.error("Error in borrowItem:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const returnItem = async (req, res) => {
  try {
    const { usageLogId } = req.body;
    
    if (!usageLogId) {
      return res.status(400).json({ message: "Usage log id is required." });
    }
    
    // Find the original borrow usage log
    const borrowLog = await UsageLog.findById(usageLogId);
    if (!borrowLog) {
      return res.status(404).json({ message: "Usage log not found." });
    }

    // Ensure this log represents a borrow transaction
    if (borrowLog.action !== "borrowed") {
      return res.status(400).json({ message: "This usage log is not a borrow record." });
    }
    
    // Find the corresponding item
    const item = await Item.findById(borrowLog.item);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    
    // For each serial number in the borrow log, mark the instance as available
    for (const sn of borrowLog.serialNumbers) {
      const instance = item.instances.find((inst) => inst.serialNumber === sn);
      if (!instance) {
        return res.status(400).json({ message: `Serial number ${sn} not found in the item instances.` });
      }
      if (instance.status !== "borrowed") {
        return res.status(400).json({ message: `Serial number ${sn} is not currently marked as borrowed.` });
      }
      instance.status = "available";
    }
    
    // Increase the available quantity by the number of returned instances
    item.availableQuantity += borrowLog.serialNumbers.length;
    await item.save();
    
    // Store expected return date before deleting the borrow log
    const expectedReturnDate = borrowLog.expectedReturnDate;

    // Create a new usage log for the return action
    const returnLog = new UsageLog({
      user: borrowLog.user,
      item: borrowLog.item,
      serialNumbers: borrowLog.serialNumbers,
      action: "returned",
      expectedReturnDate: expectedReturnDate,
    });
    await returnLog.save();
    
    // Delete the original borrow log
    await UsageLog.findByIdAndDelete(usageLogId);
    
    return res.status(200).json({
      message: "Item returned successfully",
      data: {
        returnLog
      }
    });
    
  } catch (error) {
    console.error("Error in returnItem:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await UsageLog.find()
      .populate("user", "name email") // Fetch user name and email
      .populate("item", "name category") // Fetch item name and category
      .sort({ createdAt: -1 }); // Sort by latest transactions first

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await UsageLog.find({ user: userId })
      .populate("item", "name category") // Fetch item name and category
      .sort({ createdAt: -1 }); // Sort by latest transactions first

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found for this user" });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
