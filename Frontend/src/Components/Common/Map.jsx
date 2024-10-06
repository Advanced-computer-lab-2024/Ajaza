import React, { useEffect, useRef, useState } from 'react';

const MapComponent = ({ onLocationSelect }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const apikey = process.env.REACT_APP_GOOGLE_API_KEY;
    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apikey}&callback=initMap`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        };
        
        loadGoogleMapsScript();

        window.initMap = () => {
            const googleMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: -34.397, lng: 150.644 }, // Default center
                zoom: 8,
            });

            setMap(googleMap);

            // Add click event listener to the map
            googleMap.addListener('click', (event) => {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();
                googleMap.setCenter({ lat, lng });
                googleMap.setZoom(12);
                onLocationSelect({ lat, lng }); // Pass selected location back to parent
            });
        };
    }, [onLocationSelect]);

    return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

export default MapComponent;
