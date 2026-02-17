'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StatusBadge from '@/components/common/StatusBadge';
import { MoneyDisplay } from '@/components/common/MoneyDisplay';
import Link from 'next/link';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const riskIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ProjectMapProps {
  projects: any[];
}

export default function ProjectMapFull({ projects }: ProjectMapProps) {
  const validProjects = projects.filter(
    (p) => p.location?.coordinates?.latitude && p.location?.coordinates?.longitude
  );

  const center: [number, number] = validProjects.length > 0
    ? [validProjects[0].location.coordinates.latitude, validProjects[0].location.coordinates.longitude]
    : [20.5937, 78.9629]; // India center

  return (
    <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validProjects.map((p) => (
        <Marker
          key={p._id}
          position={[p.location.coordinates.latitude, p.location.coordinates.longitude]}
          icon={p.riskFlag ? riskIcon : defaultIcon}
        >
          <Popup>
            <div className="min-w-[200px] text-xs">
              <h3 className="font-bold text-sm mb-1">{p.title}</h3>
              <p className="text-gray-600">{p.department}</p>
              <p className="text-gray-600">{p.location?.city}</p>
              <p className="mt-1">Budget: ₹{((p.totalBudget || 0) / 10000000).toFixed(2)} Cr</p>
              <p>Progress: {p.completionPercentage || 0}%</p>
              <p>Status: {p.status}</p>
              {p.riskFlag && <p className="text-red-600 font-bold mt-1">⚠️ Risk Flagged</p>}
              <a href={`/citizen/projects/${p._id}`} className="text-blue-600 hover:underline mt-1 block">View Details →</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
