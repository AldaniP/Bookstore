const Order = require("./order.model");

const createAOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// const getOrderByEmail = async (req, res) => {
//   try {
//     const {email} = req.params;
//     const orders = await Order.find({email}).sort({createdAt: -1});
//     if(!orders || orders.length === 0) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching orders", error);
//     res.status(500).json({ message: "Failed to fetch order" });
//   }
// }

const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    console.log("Searching orders for:", email);

    const orders = await Order.find({ email }).sort({ createdAt: -1 });

    console.log("Orders found:", orders);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  createAOrder,
  getOrderByEmail
};
