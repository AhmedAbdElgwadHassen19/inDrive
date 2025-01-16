import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import '../style/home.css';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showTripInputs, setShowTripInputs] = useState(false);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [routeControl, setRouteControl] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من وجود مستخدم مسجل الدخول
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setLoggedInUser(user);
    }

    // تهيئة الخريطة
    mapRef.current = L.map('map').setView([30.0444, 31.2357], 12);

    // إضافة طبقة الخريطة
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    // استعادة المسار من localStorage إذا كان موجودًا
    const savedRoute = JSON.parse(localStorage.getItem('savedRoute'));
    if (savedRoute) {
      const { startCoords, endCoords } = savedRoute;
      const newRouteControl = L.Routing.control({
        waypoints: [L.latLng(startCoords), L.latLng(endCoords)],
        routeWhileDragging: true,
        lineOptions: {
          styles: [{ color: 'blue', weight: 5 }],
        },
        show: false, // إخفاء لوحة التحكم
      }).addTo(mapRef.current);
      setRouteControl(newRouteControl);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const handleTripRequest = () => {
    if (!loggedInUser) {
      alert('Please sign up or log in to request a trip.');
      navigate('/signup');
      return;
    }
    setShowTripInputs(!showTripInputs);
  };

  const handleStartTrip = () => {
    if (!loggedInUser) {
      alert('Please sign up or log in to start a trip.');
      navigate('/signup');
      return;
    }

    if (startLocation && endLocation) {
      getCoordinatesFromLocation(startLocation, (startCoords) => {
        getCoordinatesFromLocation(endLocation, (endCoords) => {
          console.log('إحداثيات نقطة البداية:', startCoords);
          console.log('إحداثيات نقطة النهاية:', endCoords);

          if (routeControl) {
            routeControl.setWaypoints([L.latLng(startCoords), L.latLng(endCoords)]);
          } else {
            const newRouteControl = L.Routing.control({
              waypoints: [L.latLng(startCoords), L.latLng(endCoords)],
              routeWhileDragging: true,
              lineOptions: {
                styles: [{ color: 'blue', weight: 5 }],
              },
              show: false, // إخفاء لوحة التحكم
            }).addTo(mapRef.current);
            setRouteControl(newRouteControl);
          }

          // حفظ المسار في localStorage
          localStorage.setItem('savedRoute', JSON.stringify({ startCoords, endCoords }));

          // زيادة عداد الرحلات للمستخدم الحالي
          const userEmail = loggedInUser.email;
          const tripCounts = JSON.parse(localStorage.getItem('tripCounts')) || {};
          tripCounts[userEmail] = (tripCounts[userEmail] || 0) + 1;
          localStorage.setItem('tripCounts', JSON.stringify(tripCounts));

          setStartLocation('');
          setEndLocation('');
          setShowTripInputs(false);
        });
      });
    } else {
      alert('Please enter both start and end locations.');
    }
  };

  const handleCancelTrip = () => {
    if (routeControl) {
      routeControl.getPlan().setWaypoints([]); // إزالة المسار
      localStorage.removeItem('savedRoute'); // إزالة المسار من localStorage
    }
    setStartLocation('');
    setEndLocation('');
    setShowTripInputs(false);
  };

  const getCoordinatesFromLocation = (location, callback) => {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const coords = [data[0].lat, data[0].lon];
          callback(coords);
        } else {
          alert('Location not found. Please try again.');
        }
      });
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        {/* النص الترحيبي في الأعلى */}
        <h1 className="text-center mb-4">Welcome to the Home Page!</h1>

        <div className="row">
          {/* الأزرار على اليسار */}
          <div className="col-lg-12 col-md-12 ">
            <div className="d-flex flex-column">
              <button id="tripBtn" className="btn btn-secondary mb-2" onClick={handleTripRequest}>
                {showTripInputs ? 'Cancel Trip Request' : 'Request Trip'}
              </button>
              {loggedInUser && (
                <>
                  <button id="startTripBtn" className="btn btn-success mb-2" onClick={handleStartTrip}>
                    Start Trip
                  </button>
                  <button id="cancelTripBtn" className="btn btn-danger mb-2" onClick={handleCancelTrip}>
                    Cancel Trip
                  </button>
                </>
              )}
            </div>
            {showTripInputs && (
              <div id="tripInputs" className="mt-4 mb-5">
                <input
                  type="text"
                  id="startLocation"
                  className="form-control"
                  placeholder="Enter start location"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                />
                <input
                  type="text"
                  id="endLocation"
                  className="form-control mt-2"
                  placeholder="Enter end location"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* الخريطة على اليمين */}
          <div className="col-lg-12 col-md-12">
            <div id="map" style={{ height: '500px', borderRadius: '10px', overflow: 'hidden' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;