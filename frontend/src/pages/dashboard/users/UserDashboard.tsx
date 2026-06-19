import { useAuth } from "../../../context/AuthContext";
import { useGetOrderByEmailQuery } from "../../../redux/features/orders/ordersApi";

const UserDashboard = () => {
  const { currentUser } = useAuth();

  interface Order {
    createdAt: string;
    _id: string;
    name: string;
    email: string;
    phone: string;
    totalPrice: number;
    totalQuantity: number;
    address: {
      city: string;
      state: string;
      country: string;
      zipcode: string;
    };
  }

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useGetOrderByEmailQuery(currentUser?.email);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error getting orders data</div>;

  const totalOrders = orders.length;

  const totalBooks = orders.reduce(
    (sum: number, order: Order) => sum + order.totalQuantity,
    0
  );

  const totalSpent = orders.reduce(
    (sum: number, order: Order) => sum + order.totalPrice,
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* USER PROFILE */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center gap-4">
          <img
            src={
              currentUser?.photoURL ||
              "https://randomuser.me/api/portraits/lego/1.jpg"
            }
            alt="User"
            className="w-20 h-20 rounded-full object-cover"
          />

          <div>
            <h1 className="text-2xl font-bold">
              {currentUser?.displayName ||
                currentUser?.email ||
                "User"}
            </h1>

            <p className="text-gray-600">
              {currentUser?.email}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-5 rounded-lg shadow">
            <p className="text-gray-600">Total Orders</p>
            <h2 className="text-3xl font-bold">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-green-100 p-5 rounded-lg shadow">
            <p className="text-gray-600">Books Purchased</p>
            <h2 className="text-3xl font-bold">
              {totalBooks}
            </h2>
          </div>

          <div className="bg-yellow-100 p-5 rounded-lg shadow">
            <p className="text-gray-600">Total Spent</p>
            <h2 className="text-3xl font-bold">
              ${totalSpent.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* ORDERS */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Recent Orders
          </h2>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: Order) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <p className="font-semibold">
                        Order ID:
                      </p>
                      <p className="text-gray-600">
                        {order._id}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">
                        Order Date:
                      </p>
                      <p className="text-gray-600">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="font-semibold">
                        Quantity
                      </p>
                      <p>{order.totalQuantity}</p>
                    </div>

                    <div>
                      <p className="font-semibold">
                        Total Price
                      </p>
                      <p>${order.totalPrice}</p>
                    </div>

                    <div>
                      <p className="font-semibold">
                        Status
                      </p>
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              You have no recent orders.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;