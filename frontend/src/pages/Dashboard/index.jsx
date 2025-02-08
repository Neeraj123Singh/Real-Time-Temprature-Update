import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001", {
  autoConnect: false,  // Ensure socket doesn't automatically connect
});

const Dashboard = () => {
  const [temperature, setTemperature] = useState(null);
  const [online, setOnline] = useState("Connecting...");
  const [status, setStatus] = useState("NORMAL");
  const [readings, setReadings] = useState([]);

  // Function to determine the color based on the status
  const getTemperatureStatusColor = (status) => {
    switch (status) {
      case "CRITICAL":
        return "bg-red-500 text-white"; // Red for critical
      case "HIGH":
        return "bg-orange-500 text-white"; // Orange for high
      case "LOW":
        return "bg-yellow-500 text-white"; // Yellow for low
      case "NORMAL":
        return "bg-green-500 text-white"; // Green for normal
      default:
        return "bg-gray-100 text-gray-600"; // Default for undefined states
    }
  };

  // Function to calculate time difference in human-readable format
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now"; // Fallback for missing timestamp
  
    const secondsAgo = Math.floor((Date.now() - timestamp) / 1000);
  
    if (secondsAgo < 0) return "Just now"; // Prevent future timestamps issue
    if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
  
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
  
    return "More than an hour ago"; // Optional fallback for old readings
  };
  

  useEffect(() => {
    // Explicitly connect the socket
    socket.connect();

    // Set status when connected
    socket.on("connect", () => {
      setOnline("Connected");
    });

    // Set status when there is a connection error
    socket.on("connect_error", () => {
      setOnline("Failed");
    });

    // Handle temperature updates
    socket.on("temperatureUpdate", (data) => {
      setTemperature(data.temperature);

      // Process the status based on temperature
      let processedStatus = "NORMAL";
      if (data.temperature >= 28) processedStatus = "CRITICAL";
      else if (data.temperature > 24) processedStatus = "HIGH";
      else if (data.temperature < 12) processedStatus = "LOW";

      setStatus(processedStatus);

      // Store reading along with received timestamp
      setReadings((prev) => [{ ...data, status: processedStatus, timestamp: Date.now() }, ...prev.slice(0, 7)]);
    });

    // Set status when disconnected
    socket.on("disconnect", () => {
      setOnline("Connecting...");
    });

    // Cleanup socket listeners when component unmounts
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("temperatureUpdate");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700">Temperature Monitor</h1>
          <span className={`px-4 py-1 text-sm font-semibold rounded-full ${online === "Connected" ? "bg-green-100 text-green-600" : online === "Failed" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}>
            {online}
          </span>
        </div>

        {/* Current Temperature Card */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-4 text-center">
          <h2 className="text-gray-500 text-lg">Current Temperature</h2>
          <p className="text-5xl font-bold mt-2">{temperature}°C</p>
          <p className={`mt-2 text-lg font-semibold ${getTemperatureStatusColor(status)}`}>
            {status}
          </p>
          <p className="text-sm text-gray-400">Last updated: Just now</p>
        </div>

        {/* Recent Readings */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-4">
          <h3 className="text-gray-700 text-lg font-semibold">Recent Readings</h3>
          <div className="mt-4 space-y-3">
            {readings.map((reading, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-lg font-semibold text-gray-700">{reading.temperature}°C</span>
                <span className={`px-4 py-1 text-sm font-semibold rounded-full ${getTemperatureStatusColor(reading.status)}`}>
                  {reading.status}
                </span>
                <span className="text-sm text-gray-500">{getTimeAgo(reading.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
