import React, { useEffect, useRef, useState } from "react";

const MapView = ({ googleMapsLink }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const apikey = process.env.REACT_APP_GOOGLE_API_KEY;

  // Helper function to extract latitude and longitude from Google Maps link
  const getCoordinatesFromLink = (link) => {
    if (!link) {
      console.error("Google Maps link is not provided.");
      return null;
    }

    const regex = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = link.match(regex);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    console.error("Invalid Google Maps link format.");
    return null;
  };

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apikey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    const coordinates = getCoordinatesFromLink(googleMapsLink);

    if (coordinates) {
      loadGoogleMapsScript();

      window.initMap = () => {
        const googleMap = new window.google.maps.Map(mapRef.current, {
          center: coordinates, // Center map on parsed coordinates
          zoom: 12,
        });

        setMap(googleMap);

        // Add a pin at the parsed location
        new window.google.maps.Marker({
          position: coordinates,
          map: googleMap,
        });
      };
    }
  }, [googleMapsLink, apikey]);

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%", borderRadius: "25px" }}
    />
  );
};

export default MapView;
