'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Location {
  lat: number;
  lng: number;
  address?: string;
  type?: 'warehouse' | 'delivery' | 'waypoint';
  label?: string;
  status?: string;
}

interface RouteMapProps {
  warehouses?: Location[];
  deliveries?: Location[];
  route?: Location[];
  polyline?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  onLocationClick?: (location: Location) => void;
}

const RouteMap: React.FC<RouteMapProps> = ({
  warehouses = [],
  deliveries = [],
  route = [],
  polyline,
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 12,
  className = 'w-full h-[600px]',
  onLocationClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [routePath, setRoutePath] = useState<google.maps.Polyline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();

        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          setMap(mapInstance);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please check your API key.');
        setLoading(false);
      }
    };

    initMap();
  }, [center.lat, center.lng, zoom]);

  // Clear existing markers and route
  const clearMapElements = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
    
    if (routePath) {
      routePath.setMap(null);
      setRoutePath(null);
    }
  };

  // Add markers and route when data changes
  useEffect(() => {
    if (!map) return;

    clearMapElements();

    const newMarkers: google.maps.Marker[] = [];
    const bounds = new google.maps.LatLngBounds();

    // Add warehouse markers
    warehouses.forEach((location, index) => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.label || `Warehouse ${index + 1}`,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(40, 40)
        },
        animation: google.maps.Animation.DROP
      });

      // Info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${location.label || 'Warehouse'}</h3>
            <p style="margin: 0; font-size: 12px;">${location.address || 'Address not available'}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        if (onLocationClick) onLocationClick(location);
      });

      newMarkers.push(marker);
      bounds.extend({ lat: location.lat, lng: location.lng });
    });

    // Add delivery markers
    deliveries.forEach((location, index) => {
      const iconColor = 
        location.status === 'completed' ? 'green' :
        location.status === 'in_progress' ? 'yellow' :
        'red';

      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.label || `Delivery ${index + 1}`,
        icon: {
          url: `http://maps.google.com/mapfiles/ms/icons/${iconColor}-dot.png`,
          scaledSize: new google.maps.Size(32, 32)
        },
        label: {
          text: `${index + 1}`,
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${location.label || `Delivery #${index + 1}`}</h3>
            <p style="margin: 0; font-size: 12px; margin-bottom: 3px;">${location.address || 'Address not available'}</p>
            ${location.status ? `<span style="padding: 2px 8px; background: ${iconColor}; color: white; border-radius: 4px; font-size: 11px;">${location.status}</span>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        if (onLocationClick) onLocationClick(location);
      });

      newMarkers.push(marker);
      bounds.extend({ lat: location.lat, lng: location.lng });
    });

    // Add route markers (waypoints)
    route.forEach((location, index) => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.label || `Stop ${index + 1}`,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        },
        label: {
          text: `${index + 1}`,
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });

      newMarkers.push(marker);
      bounds.extend({ lat: location.lat, lng: location.lng });
    });

    // Draw route polyline
    if (polyline) {
      const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
      const routePolyline = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: '#4F46E5',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map
      });
      setRoutePath(routePolyline);
      
      decodedPath.forEach(point => bounds.extend(point));
    } else if (route.length > 1) {
      // Draw simple route line if no polyline provided
      const routePolyline = new google.maps.Polyline({
        path: route.map(loc => ({ lat: loc.lat, lng: loc.lng })),
        geodesic: true,
        strokeColor: '#4F46E5',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map
      });
      setRoutePath(routePolyline);
    }

    setMarkers(newMarkers);

    // Fit bounds if there are locations
    if (warehouses.length + deliveries.length + route.length > 0) {
      map.fitBounds(bounds);
    }

    // Cleanup function
    return () => {
      clearMapElements();
    };
  }, [map, warehouses, deliveries, route, polyline]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="text-center text-red-600">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-semibold mb-2">Error Loading Map</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className={className} />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
        <h4 className="font-semibold mb-3 text-sm">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Warehouse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Pending Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span>Waypoint</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-indigo-600"></div>
            <span>Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
