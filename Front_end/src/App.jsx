// Language: JavaScript + JSX (React)
import { useEffect, useState } from 'react';


function App() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [stores, setStores] = useState([]); // to store nearby places
  const [error, setError] = useState(null); // To store errors 
  const [users, setUsers] = useState([]); // holds MongoDB data



  // Function to get user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon });

        // After getting location, fetch nearby stores
        fetchNearbyStores(lat, lon);
      }, (err) => {
        console.error("Error getting location:", err);
        setError("Failed to get your location");
      });
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  // Function to fetch nearby stores using Google Places API
  const fetchNearbyStores = async (lat, lon) => {
    try {
      const response = await fetch('http://localhost:8787', { // change this to worker url when deploy
        method: 'POST',                                       //currently just gets users location and sends to cloudflare worker backend
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon }) // MUST MATCH WORKER HERE
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (data.results) {
        setStores(data.results);
      } else {
        setError("No stores found");
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError("Failed to fetch stores");
    }
  };
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/items'); // FastAPI route
      const data = await response.json();
      console.log("FastAPI Response:", data);
      if (data.items) {
        setUsers(data.items);
      }
    } catch (err) {
      console.error("Error fetching users from FastAPI:", err);
    }
  };

  fetchUsers();
  }, []); // Empty dependency array = runs once
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Store Price App</h1>

      <button onClick={getLocation}>Get My Location and Find Stores</button>

      {location.lat && location.lon && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Latitude:</strong> {location.lat}</p>
          <p><strong>Longitude:</strong> {location.lon}</p>
        </div>
      )}

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {stores.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Nearby Stores:</h2>
          <ul>
            {stores.map((store) => (
              <li key={store.place_id}>{store.name}</li>
            ))}
          </ul>
        </div>
      )}
      {users.length > 0 && (
  <div style={{ marginTop: "20px" }}>
    <h2>Users from MongoDB:</h2>
    <ul>
      {users.map((user, index) => (
        <li key={index}>
          <strong>Name:</strong> {user.name}<br />
          <strong>Email:</strong> {user.email}
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
}

export default App;
