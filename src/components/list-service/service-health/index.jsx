import React, { useState } from "react";

const TransportManagement = () => {
  const [orders, setOrders] = useState([
    { id: 1, name: "Order 1", weight: 10, type: "air", status: "pending" },
    { id: 2, name: "Order 2", weight: 20, type: "sea", status: "pending" },
    { id: 3, name: "Order 3", weight: 15, type: "air", status: "pending" },
  ]);

  const [trips, setTrips] = useState([
    { id: 1, name: "Air Trip 1", type: "air", maxWeight: 50, currentWeight: 0 },
    {
      id: 2,
      name: "Sea Trip 1",
      type: "sea",
      maxWeight: 100,
      currentWeight: 0,
    },
  ]);

  // Function to assign an order to a trip
  const assignOrderToTrip = (orderId, tripId) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: "assigned", tripId } : order
    );

    const trip = trips.find((trip) => trip.id === tripId);
    const order = orders.find((order) => order.id === orderId);

    if (trip.currentWeight + order.weight <= trip.maxWeight) {
      const updatedTrips = trips.map((trip) =>
        trip.id === tripId
          ? { ...trip, currentWeight: trip.currentWeight + order.weight }
          : trip
      );
      setTrips(updatedTrips);
      setOrders(updatedOrders);
    } else {
      alert("Trip cannot handle this order's weight!");
    }
  };

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.name} - {order.weight} kg - Status: {order.status}
            {order.status === "pending" && (
              <div>
                <button onClick={() => assignOrderToTrip(order.id, 1)}>
                  Assign to Air Trip
                </button>
                <button onClick={() => assignOrderToTrip(order.id, 2)}>
                  Assign to Sea Trip
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <h2>Trips</h2>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            {trip.name} - Current weight: {trip.currentWeight}/{trip.maxWeight}{" "}
            kg
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransportManagement;
