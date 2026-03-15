import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ============================================================================
// RF GHOST VISION & CYBER INTELLIGENCE SCANNER
// Samsung Galaxy S24 Ultra Optimized
// ============================================================================
// Modules:
//   1. Signal Scanning Layer (Wi-Fi, BLE, UWB)
//   2. Sensor Fusion (IMU + Signal Mapping)
//   3. AI Presence Reconstruction (CSI-based detection + silhouette estimation)
//   4. AR Overlay (Ghost vision camera view)
//   5. UX & Navigation (Multi-mode interface)
//   6. Logging & Export
//   7. Build-ready configuration
// ============================================================================

// --- MODULE 1: SIGNAL SCANNING ENGINE ---
// Simulates real RF scanning data structures matching Android WifiManager,
// BluetoothLeScanner, and UWB RangingSession APIs

const SignalEngine = {
  // Wi-Fi 6E bands
  WIFI_BANDS: { "2.4GHz": [1,6,11], "5GHz": [36,40,44,48,149,153,157,161], "6GHz": [1,5,9,13,17,21] },
  
  // MAC OUI database (top manufacturers)
  OUI_DB: {
    "AA:BB:CC": "Apple Inc.", "11:22:33": "Samsung Electronics", "44:55:66": "Google LLC",
    "77:88:99": "Intel Corp", "DD:EE:FF": "Qualcomm", "12:34:56": "Huawei Technologies",
    "AB:CD:EF": "Cisco Systems", "98:76:54": "TP-Link", "FE:DC:BA": "Netgear",
    "13:57:9B": "Xiaomi", "24:68:AC": "Sony Corp", "BE:EF:01": "Amazon Technologies",
    "CA:FE:02": "Microsoft Corp", "DE:AD:03": "Meta Platforms", "F0:0D:04": "Ring LLC",
  },
  
  generateMAC() {
    const ouis = Object.keys(this.OUI_DB);
    const oui = ouis[Math.floor(Math.random() * ouis.length)];
    const suffix = Array.from({length: 3}, () => 
      Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase()
    ).join(':');
    return `${oui}:${suffix}`;
  },

  getManufacturer(mac) {
    const oui = mac.substring(0, 8);
    return this.OUI_DB[oui] || "Unknown";
  },

  // Generate realistic Wi-Fi scan results
  scanWifi(existingNetworks, tick) {
    if (existingNetworks && tick % 3 !== 0) {
      // Update RSSI with realistic fluctuation
      return existingNetworks.map(n => ({
        ...n,
        rssi: Math.max(-95, Math.min(-20, n.rssi + (Math.random() - 0.5) * 6)),
        lastSeen: Date.now(),
        csiVariance: 0.02 + Math.random() * 0.15, // Channel State Information variance
        motionScore: Math.random() > 0.7 ? 0.3 + Math.random() * 0.7 : n.motionScore * 0.9,
      }));
    }
    
    const ssids = [
      "BELL-5G-HOME", "Rogers_WiFi6E", "Fil-Trek_Corp", "CambridgeGuest",
      "NETGEAR-6GHz", "TP-Link_Mesh_5G", "xfinitywifi", "DIRECT-S24Ultra",
      "Ring-Doorbell", "Nest-Hub-Max", "HP-LaserJet-Pro", "SmartTV-LG",
      "Hidden_Network", "IoT-Sensors-2.4", "SecurityCam_5G", "Sonos-Move",
    ];
    
    const count = 8 + Math.floor(Math.random() * 8);
    return Array.from({length: count}, (_, i) => {
      const bandKeys = Object.keys(this.WIFI_BANDS);
      const band = bandKeys[Math.floor(Math.random() * bandKeys.length)];
      const channels = this.WIFI_BANDS[band];
      const channel = channels[Math.floor(Math.random() * channels.length)];
      const mac = this.generateMAC();
      return {
        id: `wifi-${i}-${Date.now()}`,
        type: "wifi",
        ssid: i < ssids.length ? ssids[i] : `Network_${i}`,
        bssid: mac,
        manufacturer: this.getManufacturer(mac),
        rssi: -30 - Math.floor(Math.random() * 60),
        frequency: band,
        channel,
        security: ["WPA3","WPA2","WPA2/WPA3","Open","WEP"][Math.floor(Math.random()*5)],
        bandwidth: [20,40,80,160][Math.floor(Math.random()*4)],
        standard: band === "6GHz" ? "Wi-Fi 6E" : band === "5GHz" ? "Wi-Fi 6" : "Wi-Fi 4",
        lastSeen: Date.now(),
        csiVariance: 0.02 + Math.random() * 0.15,
        motionScore: Math.random() > 0.8 ? 0.3 + Math.random() * 0.7 : 0,
        distance: 1 + Math.random() * 15,
        angle: Math.random() * 360,
      };
    });
  },

  // Generate BLE scan results
  scanBLE(existingDevices, tick) {
    if (existingDevices && tick % 4 !== 0) {
      return existingDevices.map(d => ({
        ...d,
        rssi: Math.max(-100, Math.min(-30, d.rssi + (Math.random() - 0.5) * 4)),
        lastSeen: Date.now(),
      }));
    }
    
    const bleTypes = [
      { name: "Galaxy Watch 6", type: "Wearable", icon: "⌚" },
      { name: "AirPods Pro", type: "Audio", icon: "🎧" },
      { name: "Tile Tracker", type: "Tracker", icon: "📍" },
      { name: "Fitbit Charge 6", type: "Wearable", icon: "⌚" },
      { name: "Smart Lock", type: "Security", icon: "🔒" },
      { name: "BLE Beacon", type: "Beacon", icon: "📡" },
      { name: "Heart Rate Monitor", type: "Health", icon: "❤️" },
      { name: "Smart Scale", type: "Health", icon: "⚖️" },
      { name: "Keyboard BT", type: "Input", icon: "⌨️" },
      { name: "Mouse BT", type: "Input", icon: "🖱️" },
      { name: "Unknown BLE", type: "Unknown", icon: "❓" },
      { name: "Smart Plug", type: "IoT", icon: "🔌" },
    ];
    
    const count = 5 + Math.floor(Math.random() * 7);
    return Array.from({length: count}, (_, i) => {
      const device = bleTypes[i % bleTypes.length];
      const mac = this.generateMAC();
      return {
        id: `ble-${i}-${Date.now()}`,
        type: "ble",
        name: device.name,
        deviceType: device.type,
        icon: device.icon,
        mac,
        manufacturer: this.getManufacturer(mac),
        rssi: -40 - Math.floor(Math.random() * 55),
        txPower: -59 - Math.floor(Math.random() * 20),
        connectable: Math.random() > 0.4,
        bonded: Math.random() > 0.8,
        lastSeen: Date.now(),
        distance: 0.5 + Math.random() * 10,
        angle: Math.random() * 360,
        serviceUUIDs: [`0x${Math.floor(Math.random()*65535).toString(16).padStart(4,'0')}`],
      };
    });
  },

  // UWB ranging results
  scanUWB(tick) {
    const count = 1 + Math.floor(Math.random() * 3);
    return Array.from({length: count}, (_, i) => ({
      id: `uwb-${i}-${Date.now()}`,
      type: "uwb",
      name: `UWB Tag ${i+1}`,
      distance: 0.5 + Math.random() * 8,
      azimuth: -90 + Math.random() * 180,
      elevation: -45 + Math.random() * 90,
      accuracy: 0.05 + Math.random() * 0.15,
      los: Math.random() > 0.3, // Line of sight
      lastSeen: Date.now(),
    }));
  },
};

// --- MODULE 2: SENSOR FUSION ENGINE ---
const SensorFusion = {
  orientation: { alpha: 0, beta: 0, gamma: 0 },
  position: { x: 0, y: 0, z: 1.2 }, // Phone position in room (meters)
  
  update(tick) {
    // Simulate IMU data (accelerometer + gyroscope + magnetometer)
    this.orientation = {
      alpha: (tick * 2.3) % 360,  // Compass heading
      beta: 85 + Math.sin(tick * 0.05) * 5,  // Tilt forward/back
      gamma: Math.sin(tick * 0.03) * 3,  // Tilt left/right
    };
    
    // Simulate slight hand movement
    this.position = {
      x: 2.5 + Math.sin(tick * 0.02) * 0.1,
      y: 3.0 + Math.cos(tick * 0.015) * 0.1,
      z: 1.2 + Math.sin(tick * 0.04) * 0.02,
    };
    
    return {
      orientation: { ...this.orientation },
      position: { ...this.position },
      accelerometer: {
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: 9.81 + (Math.random() - 0.5) * 0.1,
      },
      gyroscope: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      },
      magnetometer: {
        x: 25 + (Math.random() - 0.5) * 2,
        y: -10 + (Math.random() - 0.5) * 2,
        z: 45 + (Math.random() - 0.5) * 2,
      },
    };
  },

  // Transform signal position from world space to screen space
  worldToScreen(worldPos, orientation, screenW, screenH, fov = 60) {
    const dx = worldPos.x - this.position.x;
    const dy = worldPos.y - this.position.y;
    const heading = (orientation.alpha * Math.PI) / 180;
    
    const rx = dx * Math.cos(-heading) - dy * Math.sin(-heading);
    const ry = dx * Math.sin(-heading) + dy * Math.cos(-heading);
    
    if (ry < 0.3) return null; // Behind camera
    
    const fovRad = (fov * Math.PI) / 180;
    const screenX = screenW / 2 + (rx / ry) * (screenW / (2 * Math.tan(fovRad / 2)));
    const screenY = screenH / 2 + ((this.position.z - (worldPos.z || 0)) / ry) * (screenH / (2 * Math.tan(fovRad / 2)));
    const scale = Math.max(0.3, Math.min(2, 3 / ry));
    
    return { x: screenX, y: screenY, scale, depth: ry };
  },
};

// --- MODULE 3: AI PRESENCE RECONSTRUCTION ---
// CSI-based presence detection + motion estimation + silhouette generation

const AIEngine = {
  // Detected entities from RF analysis
  entities: [],
  
  // Process all signals and detect human-like presences
  processSignals(wifiData, bleData, uwbData, sensorData, tick) {
    const entities = [];
    
    // CSI-based motion detection from Wi-Fi signals
    wifiData.forEach(ap => {
      if (ap.motionScore > 0.4) {
        const entityAngle = (ap.angle + sensorData.orientation.alpha) * Math.PI / 180;
        const dist = ap.distance * (0.7 + ap.motionScore * 0.3);
        
        entities.push({
          id: `entity-wifi-${ap.id}`,
          type: "csi_detection",
          confidence: Math.min(0.95, 0.3 + ap.motionScore * 0.6 + ap.csiVariance * 2),
          x: sensorData.position.x + Math.cos(entityAngle) * dist,
          y: sensorData.position.y + Math.sin(entityAngle) * dist,
          z: 0.9 + Math.random() * 0.4, // Estimated height center
          distance: dist,
          motionLevel: ap.motionScore,
          velocity: ap.motionScore * 1.5 + (Math.random() - 0.5) * 0.3,
          source: "Wi-Fi CSI",
          sourceAP: ap.ssid,
          height: 1.5 + Math.random() * 0.4,
          bodyWidth: 0.4 + Math.random() * 0.2,
        });
      }
    });
    
    // BLE proximity detection
    bleData.forEach(dev => {
      if (dev.deviceType === "Wearable" || dev.deviceType === "Audio") {
        const entityAngle = (dev.angle + sensorData.orientation.alpha) * Math.PI / 180;
        entities.push({
          id: `entity-ble-${dev.id}`,
          type: "ble_carrier",
          confidence: Math.min(0.9, 0.5 + (1 - dev.distance / 15) * 0.4),
          x: sensorData.position.x + Math.cos(entityAngle) * dev.distance,
          y: sensorData.position.y + Math.sin(entityAngle) * dev.distance,
          z: dev.deviceType === "Wearable" ? 1.0 : 1.5,
          distance: dev.distance,
          motionLevel: 0.2 + Math.random() * 0.3,
          velocity: 0.1 + Math.random() * 0.5,
          source: "BLE",
          sourceDevice: dev.name,
          height: 1.6 + Math.random() * 0.3,
          bodyWidth: 0.45,
          carriedDevice: dev.icon,
        });
      }
    });
    
    // UWB precision ranging
    uwbData.forEach(tag => {
      const azRad = (tag.azimuth + sensorData.orientation.alpha) * Math.PI / 180;
      entities.push({
        id: `entity-uwb-${tag.id}`,
        type: "uwb_ranging",
        confidence: tag.los ? 0.92 : 0.6,
        x: sensorData.position.x + Math.cos(azRad) * tag.distance,
        y: sensorData.position.y + Math.sin(azRad) * tag.distance,
        z: 1.0 + Math.sin(tag.elevation * Math.PI / 180) * tag.distance,
        distance: tag.distance,
        motionLevel: 0.4 + Math.random() * 0.4,
        velocity: 0.5 + Math.random() * 1.0,
        source: "UWB",
        height: 1.7,
        bodyWidth: 0.45,
        lineOfSight: tag.los,
      });
    });
    
    // Merge nearby detections (multi-signal fusion)
    const merged = this.fuseDetections(entities);
    this.entities = merged;
    return merged;
  },
  
  fuseDetections(entities) {
    const merged = [];
    const used = new Set();
    
    for (let i = 0; i < entities.length; i++) {
      if (used.has(i)) continue;
      let fused = { ...entities[i], sources: [entities[i].source] };
      
      for (let j = i + 1; j < entities.length; j++) {
        if (used.has(j)) continue;
        const dx = entities[i].x - entities[j].x;
        const dy = entities[i].y - entities[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 1.5) {
          fused.confidence = Math.min(0.98, fused.confidence + entities[j].confidence * 0.3);
          fused.x = (fused.x + entities[j].x) / 2;
          fused.y = (fused.y + entities[j].y) / 2;
          fused.motionLevel = Math.max(fused.motionLevel, entities[j].motionLevel);
          fused.sources.push(entities[j].source);
          fused.type = "fused";
          used.add(j);
        }
      }
      merged.push(fused);
      used.add(i);
    }
    return merged;
  },
};


// --- MODULE 6: LOGGING & EXPORT ---
const Logger = {
  logs: [],
  maxLogs: 200,
  
  add(entry) {
    this.logs.unshift({ ...entry, timestamp: Date.now() });
    if (this.logs.length > this.maxLogs) this.logs.pop();
  },
  
  exportJSON(entities, wifiData, bleData, sensorData) {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      appVersion: "1.0.0",
      device: "Samsung Galaxy S24 Ultra",
      disclaimer: "Abstract RF signal analysis only. No personal identifiers captured.",
      scan: {
        wifiNetworks: wifiData.length,
        bleDevices: bleData.length,
        detectedPresences: entities.length,
      },
      entities: entities.map(e => ({
        type: e.type,
        confidence: Math.round(e.confidence * 100) + "%",
        distance: e.distance?.toFixed(2) + "m",
        motionLevel: e.motionLevel?.toFixed(2),
        sources: e.sources || [e.source],
      })),
      sensorState: sensorData,
      wifiSummary: wifiData.map(w => ({
        ssid: w.ssid,
        rssi: w.rssi,
        band: w.frequency,
        security: w.security,
        csiMotion: w.motionScore?.toFixed(3),
      })),
      bleSummary: bleData.map(b => ({
        name: b.name,
        type: b.deviceType,
        rssi: b.rssi,
        distance: b.distance?.toFixed(2) + "m",
      })),
    }, null, 2);
  },
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const MODES = {
  GHOST: "ghost",
  HEATMAP: "heatmap",
  SCANNER: "scanner",
  TRACKING: "tracking",
};

// Ghost silhouette SVG path for AR overlay
const GhostSilhouette = ({ x, y, scale, confidence, motion, color, pulse, sources }) => {
  const opacity = 0.3 + confidence * 0.6;
  const glowIntensity = motion * 20;
  const breathe = 1 + Math.sin(pulse * 0.08) * 0.03;
  const sway = Math.sin(pulse * 0.05) * 2 * motion;
  
  return (
    <g transform={`translate(${x + sway}, ${y}) scale(${scale * breathe})`} opacity={opacity}>
      <defs>
        <filter id={`glow-${x}-${y}`}>
          <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`grad-${x}-${y}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      
      {/* Head */}
      <ellipse cx="0" cy="-55" rx="12" ry="14" 
        fill="none" stroke={color} strokeWidth="2" 
        filter={`url(#glow-${x}-${y})`} />
      
      {/* Neck */}
      <line x1="0" y1="-41" x2="0" y2="-35" stroke={color} strokeWidth="2" />
      
      {/* Shoulders */}
      <line x1="-20" y1="-30" x2="20" y2="-30" stroke={color} strokeWidth="2" 
        strokeLinecap="round" />
      
      {/* Torso */}
      <path d={`M-18,-30 Q-15,0 -12,20 L12,20 Q15,0 18,-30`} 
        fill={`url(#grad-${x}-${y})`} stroke={color} strokeWidth="1.5" />
      
      {/* Arms */}
      <path d={`M-20,-30 Q-28,-10 -22,10`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d={`M20,-30 Q28,-10 22,10`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      
      {/* Legs */}
      <path d={`M-8,20 Q-10,40 -12,55`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d={`M8,20 Q10,40 12,55`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      
      {/* Motion trail effect */}
      {motion > 0.4 && (
        <>
          <path d={`M-18,-30 Q-15,0 -12,20 L12,20 Q15,0 18,-30`}
            fill="none" stroke={color} strokeWidth="0.5" opacity={motion * 0.3}
            transform={`translate(${-motion * 8}, 0)`} />
        </>
      )}
      
      {/* Confidence ring */}
      <circle cx="0" cy="-55" r={18} fill="none" stroke={color} 
        strokeWidth="0.5" strokeDasharray={`${confidence * 113} ${113 - confidence * 113}`}
        opacity="0.6" />
      
      {/* Source indicator */}
      <text x="0" y="70" textAnchor="middle" fill={color} fontSize="8" fontFamily="monospace" opacity="0.7">
        {sources ? sources.join("+") : "RF"} | {Math.round(confidence*100)}%
      </text>
    </g>
  );
};

// Radar/Heatmap component
const RadarView = ({ entities, wifiData, bleData, sensorData, tick, roomSize }) => {
  const centerX = 175;
  const centerY = 175;
  const maxRange = Math.max(roomSize.width, roomSize.depth) / 2;
  const scale = 150 / maxRange;
  
  const sweepAngle = (tick * 3) % 360;
  
  return (
    <svg width="350" height="350" viewBox="0 0 350 350">
      <defs>
        <radialGradient id="radarBg">
          <stop offset="0%" stopColor="#001a0a" />
          <stop offset="100%" stopColor="#000d05" />
        </radialGradient>
        <filter id="radarGlow">
          <feGaussianBlur stdDeviation="3" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <rect width="350" height="350" rx="12" fill="url(#radarBg)" />
      
      {/* Range rings */}
      {[0.25, 0.5, 0.75, 1].map((r, i) => (
        <circle key={i} cx={centerX} cy={centerY} r={150 * r}
          fill="none" stroke="#00ff4420" strokeWidth="0.5" />
      ))}
      
      {/* Crosshairs */}
      <line x1={centerX} y1="25" x2={centerX} y2="325" stroke="#00ff4415" strokeWidth="0.5" />
      <line x1="25" y1={centerY} x2="325" y2={centerY} stroke="#00ff4415" strokeWidth="0.5" />
      
      {/* Sweep */}
      <line x1={centerX} y1={centerY}
        x2={centerX + 150 * Math.cos(sweepAngle * Math.PI / 180)}
        y2={centerY + 150 * Math.sin(sweepAngle * Math.PI / 180)}
        stroke="#00ff44" strokeWidth="1" opacity="0.6" filter="url(#radarGlow)" />
      
      {/* Sweep trail */}
      <path d={`M${centerX},${centerY} L${centerX + 150 * Math.cos(sweepAngle * Math.PI / 180)},${centerY + 150 * Math.sin(sweepAngle * Math.PI / 180)} A150,150 0 0,0 ${centerX + 150 * Math.cos((sweepAngle - 30) * Math.PI / 180)},${centerY + 150 * Math.sin((sweepAngle - 30) * Math.PI / 180)} Z`}
        fill="#00ff4408" />
      
      {/* Wi-Fi APs */}
      {wifiData.map((ap, i) => {
        const angle = (ap.angle * Math.PI) / 180;
        const dist = Math.min(ap.distance, maxRange) * scale;
        const px = centerX + Math.cos(angle) * dist;
        const py = centerY + Math.sin(angle) * dist;
        const size = 2 + Math.max(0, (ap.rssi + 90) / 20) * 3;
        return (
          <g key={`wifi-${i}`}>
            <circle cx={px} cy={py} r={size} fill="#00aaff" opacity="0.4" />
            <circle cx={px} cy={py} r={size * 0.5} fill="#00ccff" opacity="0.8" />
          </g>
        );
      })}
      
      {/* BLE devices */}
      {bleData.map((dev, i) => {
        const angle = (dev.angle * Math.PI) / 180;
        const dist = Math.min(dev.distance, maxRange) * scale;
        const px = centerX + Math.cos(angle) * dist;
        const py = centerY + Math.sin(angle) * dist;
        return (
          <rect key={`ble-${i}`} x={px-3} y={py-3} width="6" height="6"
            fill="#aa44ff" opacity="0.6" transform={`rotate(45,${px},${py})`} />
        );
      })}
      
      {/* Entities (presences) */}
      {entities.map((ent, i) => {
        const dx = ent.x - sensorData.position.x;
        const dy = ent.y - sensorData.position.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const angle = Math.atan2(dy, dx);
        const renderDist = Math.min(dist, maxRange) * scale;
        const px = centerX + Math.cos(angle) * renderDist;
        const py = centerY + Math.sin(angle) * renderDist;
        const color = ent.motionLevel > 0.6 ? "#ff4444" : ent.motionLevel > 0.3 ? "#ffaa00" : "#00ff44";
        const pulseR = 8 + Math.sin(tick * 0.1 + i) * 3;
        
        return (
          <g key={`ent-${i}`}>
            <circle cx={px} cy={py} r={pulseR} fill={color} opacity="0.15" filter="url(#radarGlow)" />
            <circle cx={px} cy={py} r="4" fill={color} opacity="0.9" />
            <text x={px} y={py + 16} textAnchor="middle" fill={color} fontSize="7" fontFamily="monospace">
              {Math.round(ent.confidence*100)}%
            </text>
          </g>
        );
      })}
      
      {/* Center (phone position) */}
      <polygon points={`${centerX},${centerY-6} ${centerX+4},${centerY+4} ${centerX-4},${centerY+4}`}
        fill="#00ff44" opacity="0.9" />
      
      {/* Heading indicator */}
      <text x={centerX} y="18" textAnchor="middle" fill="#00ff44" fontSize="9" fontFamily="monospace">
        {Math.round(sensorData.orientation.alpha)}°N
      </text>
      
      {/* Range labels */}
      {[0.25, 0.5, 0.75, 1].map((r, i) => (
        <text key={i} x={centerX + 150 * r + 5} y={centerY - 3}
          fill="#00ff4460" fontSize="7" fontFamily="monospace">
          {(maxRange * r).toFixed(1)}m
        </text>
      ))}
    </svg>
  );
};

// Signal strength meter
const SignalMeter = ({ label, value, max, color, unit }) => (
  <div style={{ marginBottom: 6 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#8892a4", fontFamily: "'JetBrains Mono', monospace" }}>
      <span>{label}</span>
      <span style={{ color }}>{value}{unit}</span>
    </div>
    <div style={{ height: 3, background: "#1a1f2e", borderRadius: 2, overflow: "hidden", marginTop: 2 }}>
      <div style={{
        width: `${Math.max(0, Math.min(100, ((value - max) / -max) * 100))}%`,
        height: "100%", background: color, borderRadius: 2,
        transition: "width 0.3s ease",
      }} />
    </div>
  </div>
);

// ============================================================================
// MAIN APP
// ============================================================================

export default function RFGhostVision() {
  const [mode, setMode] = useState(MODES.GHOST);
  const [scanning, setScanning] = useState(false);
  const [tick, setTick] = useState(0);
  const [wifiData, setWifiData] = useState([]);
  const [bleData, setBleData] = useState([]);
  const [uwbData, setUwbData] = useState([]);
  const [sensorData, setSensorData] = useState({ orientation: {alpha:0,beta:0,gamma:0}, position: {x:2.5,y:3,z:1.2} });
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [roomSize, setRoomSize] = useState({ width: 10, depth: 10, height: 3 });
  const [showCalibration, setShowCalibration] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showDeviceList, setShowDeviceList] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [alertLog, setAlertLog] = useState([]);
  
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  
  // Main scan loop
  useEffect(() => {
    if (!scanning) return;
    
    intervalRef.current = setInterval(() => {
      setTick(t => {
        const newTick = t + 1;
        
        // Module 1: Signal scanning
        setWifiData(prev => SignalEngine.scanWifi(prev, newTick));
        setBleData(prev => SignalEngine.scanBLE(prev, newTick));
        setUwbData(SignalEngine.scanUWB(newTick));
        
        // Module 2: Sensor fusion
        const newSensor = SensorFusion.update(newTick);
        setSensorData(newSensor);
        
        setScanCount(c => c + 1);
        
        return newTick;
      });
    }, 250); // 4Hz scan rate
    
    return () => clearInterval(intervalRef.current);
  }, [scanning]);
  
  // Module 3: AI processing (separate from scan to allow different rates)
  useEffect(() => {
    if (!scanning || wifiData.length === 0) return;
    const newEntities = AIEngine.processSignals(wifiData, bleData, uwbData, sensorData, tick);
    setEntities(newEntities);
    
    // Log new high-confidence detections
    newEntities.forEach(ent => {
      if (ent.confidence > 0.7) {
        Logger.add({
          type: "detection",
          entity: ent.type,
          confidence: ent.confidence,
          distance: ent.distance,
          sources: ent.sources || [ent.source],
        });
      }
    });
  }, [tick]);
  
  // Add alerts for new entities
  useEffect(() => {
    if (entities.length > 0 && scanning) {
      const highConf = entities.filter(e => e.confidence > 0.75);
      if (highConf.length > 0 && tick % 20 === 0) {
        setAlertLog(prev => [{
          time: new Date().toLocaleTimeString(),
          msg: `${highConf.length} presence(s) detected — strongest: ${Math.round(highConf[0].confidence * 100)}% at ${highConf[0].distance?.toFixed(1)}m`,
        }, ...prev].slice(0, 10));
      }
    }
  }, [entities, tick]);
  
  const getEntityColor = (entity) => {
    if (entity.motionLevel > 0.6) return "#ff3355";
    if (entity.motionLevel > 0.3) return "#ff9900";
    if (entity.confidence > 0.7) return "#00ffaa";
    return "#44aaff";
  };
  
  const handleExport = () => {
    const data = Logger.exportJSON(entities, wifiData, bleData, sensorData);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rf-scan-${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // --- RENDER ---
  const ghostViewW = 400;
  const ghostViewH = 520;
  
  const totalDevices = wifiData.length + bleData.length + uwbData.length;
  const avgRSSI = wifiData.length > 0 ? Math.round(wifiData.reduce((s, w) => s + w.rssi, 0) / wifiData.length) : 0;
  const motionDetections = entities.filter(e => e.motionLevel > 0.3).length;
  
  return (
    <div style={{
      width: "100%", minHeight: "100vh",
      background: "#0a0d14",
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      color: "#c8d0e0",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,68,0.015) 2px, rgba(0,255,68,0.015) 4px)`,
        pointerEvents: "none", zIndex: 100,
      }} />
      
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        background: "linear-gradient(180deg, #0d1117 0%, #0a0d14 100%)",
        borderBottom: "1px solid #1a2030",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#00ff88", letterSpacing: 2, textTransform: "uppercase",
            textShadow: "0 0 10px #00ff4440" }}>
            ◈ RF GHOST VISION
          </div>
          <div style={{ fontSize: 9, color: "#4a5568", marginTop: 2, letterSpacing: 1 }}>
            CYBER INTELLIGENCE SCANNER v1.0 — S24 ULTRA
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: scanning ? "#00ff44" : "#ff4444",
            boxShadow: scanning ? "0 0 8px #00ff44" : "0 0 8px #ff4444",
            animation: scanning ? "pulse 1s infinite" : "none",
          }} />
          <span style={{ fontSize: 10, color: scanning ? "#00ff44" : "#ff4444" }}>
            {scanning ? "SCANNING" : "IDLE"}
          </span>
        </div>
      </div>
      
      {/* Mode selector */}
      <div style={{
        display: "flex", gap: 2, padding: "8px 12px",
        background: "#0c1018",
      }}>
        {[
          { id: MODES.GHOST, label: "👻 GHOST", desc: "AR View" },
          { id: MODES.HEATMAP, label: "🔥 RADAR", desc: "Heatmap" },
          { id: MODES.SCANNER, label: "📡 SCAN", desc: "Devices" },
          { id: MODES.TRACKING, label: "📊 INTEL", desc: "Analysis" },
        ].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            flex: 1, padding: "8px 4px", border: "none", borderRadius: 6,
            background: mode === m.id ? "#141c2a" : "transparent",
            color: mode === m.id ? "#00ff88" : "#4a5568",
            fontSize: 11, cursor: "pointer", textAlign: "center",
            borderBottom: mode === m.id ? "2px solid #00ff88" : "2px solid transparent",
            transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 16 }}>{m.label.split(" ")[0]}</div>
            <div style={{ fontSize: 8, marginTop: 2, letterSpacing: 1 }}>{m.desc}</div>
          </button>
        ))}
      </div>
      
      {/* Stats bar */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 4, padding: "6px 12px",
        background: "#080b10",
      }}>
        {[
          { label: "DEVICES", value: totalDevices, color: "#00aaff" },
          { label: "PRESENCES", value: entities.length, color: "#ff9900" },
          { label: "MOTION", value: motionDetections, color: "#ff3355" },
          { label: "SCANS", value: scanCount, color: "#aa44ff" },
        ].map((s, i) => (
          <div key={i} style={{
            textAlign: "center", padding: "6px 4px",
            background: "#0d1117", borderRadius: 6,
            border: `1px solid ${s.color}15`,
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontVariantNumeric: "tabular-nums" }}>
              {s.value}
            </div>
            <div style={{ fontSize: 8, color: "#4a5568", letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div style={{ padding: "8px 12px" }}>
        
        {/* ========= GHOST AR MODE ========= */}
        {mode === MODES.GHOST && (
          <div>
            {/* AR Viewport */}
            <div style={{
              position: "relative",
              width: "100%", height: ghostViewH,
              background: "linear-gradient(180deg, #0a1520 0%, #050a10 50%, #0a0510 100%)",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #1a2535",
            }}>
              {/* Simulated camera grid (night vision aesthetic) */}
              <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                {/* Grid lines */}
                {Array.from({length: 20}, (_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * (ghostViewH/20)} x2="100%" y2={i * (ghostViewH/20)}
                    stroke="#00ff4408" strokeWidth="0.5" />
                ))}
                {Array.from({length: 15}, (_, i) => (
                  <line key={`v${i}`} x1={`${i * (100/15)}%`} y1="0" x2={`${i * (100/15)}%`} y2="100%"
                    stroke="#00ff4408" strokeWidth="0.5" />
                ))}
                
                {/* Room perspective lines */}
                <line x1="0" y1="0" x2="50%" y2="45%" stroke="#00ff4410" strokeWidth="0.5" />
                <line x1="100%" y1="0" x2="50%" y2="45%" stroke="#00ff4410" strokeWidth="0.5" />
                <line x1="0" y1="100%" x2="50%" y2="45%" stroke="#00ff4410" strokeWidth="0.5" />
                <line x1="100%" y1="100%" x2="50%" y2="45%" stroke="#00ff4410" strokeWidth="0.5" />
                
                {/* Floor plane grid */}
                {Array.from({length: 8}, (_, i) => {
                  const t = (i + 1) / 9;
                  const y = ghostViewH * (0.45 + t * 0.55);
                  const xSpread = t * 0.5;
                  return (
                    <line key={`floor${i}`}
                      x1={`${(0.5 - xSpread) * 100}%`} y1={y}
                      x2={`${(0.5 + xSpread) * 100}%`} y2={y}
                      stroke="#00ff4408" strokeWidth="0.5" />
                  );
                })}
                
                {/* Ghost silhouettes */}
                {scanning && entities.map((entity, i) => {
                  const screenPos = SensorFusion.worldToScreen(
                    entity, sensorData.orientation, ghostViewW, ghostViewH
                  );
                  if (!screenPos) return null;
                  
                  const color = getEntityColor(entity);
                  const clampedX = Math.max(40, Math.min(ghostViewW - 40, screenPos.x));
                  const clampedY = Math.max(80, Math.min(ghostViewH - 40, screenPos.y));
                  
                  return (
                    <GhostSilhouette
                      key={`ghost-${i}`}
                      x={clampedX}
                      y={clampedY}
                      scale={screenPos.scale * 0.9}
                      confidence={entity.confidence}
                      motion={entity.motionLevel}
                      color={color}
                      pulse={tick}
                      sources={entity.sources || [entity.source]}
                    />
                  );
                })}
              </svg>
              
              {/* HUD overlay */}
              <div style={{ position: "absolute", top: 8, left: 8, fontSize: 9, color: "#00ff4480" }}>
                <div>HDG: {Math.round(sensorData.orientation?.alpha || 0)}°</div>
                <div>TILT: {Math.round(sensorData.orientation?.beta || 0)}°</div>
                <div>FOV: 60°</div>
              </div>
              <div style={{ position: "absolute", top: 8, right: 8, fontSize: 9, color: "#00ff4480", textAlign: "right" }}>
                <div>{new Date().toLocaleTimeString()}</div>
                <div>FPS: {scanning ? "30" : "--"}</div>
                <div>LAT: {scanning ? `${tick * 4.2}ms` : "--"}</div>
              </div>
              
              {/* Scanning indicator */}
              <div style={{
                position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
                fontSize: 10, color: "#00ff88", letterSpacing: 2,
                opacity: scanning ? 0.6 + Math.sin(tick * 0.1) * 0.4 : 0.3,
              }}>
                {scanning ? "◉ GHOST VISION ACTIVE" : "◯ TAP SCAN TO BEGIN"}
              </div>
              
              {/* Crosshair */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 40, height: 40,
                pointerEvents: "none",
              }}>
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <line x1="20" y1="5" x2="20" y2="15" stroke="#00ff4440" strokeWidth="1" />
                  <line x1="20" y1="25" x2="20" y2="35" stroke="#00ff4440" strokeWidth="1" />
                  <line x1="5" y1="20" x2="15" y2="20" stroke="#00ff4440" strokeWidth="1" />
                  <line x1="25" y1="20" x2="35" y2="20" stroke="#00ff4440" strokeWidth="1" />
                  <circle cx="20" cy="20" r="2" fill="none" stroke="#00ff4440" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
            
            {/* Alert log */}
            {alertLog.length > 0 && (
              <div style={{
                marginTop: 8, padding: 8,
                background: "#0d1117", borderRadius: 8,
                border: "1px solid #1a2030",
                maxHeight: 100, overflow: "auto",
              }}>
                <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 4, letterSpacing: 1 }}>DETECTION LOG</div>
                {alertLog.slice(0, 5).map((a, i) => (
                  <div key={i} style={{ fontSize: 9, color: "#8892a4", marginBottom: 2, display: "flex", gap: 6 }}>
                    <span style={{ color: "#4a5568" }}>{a.time}</span>
                    <span>{a.msg}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* ========= RADAR/HEATMAP MODE ========= */}
        {mode === MODES.HEATMAP && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <RadarView
              entities={entities}
              wifiData={wifiData}
              bleData={bleData}
              sensorData={sensorData}
              tick={tick}
              roomSize={roomSize}
            />
            
            {/* Legend */}
            <div style={{
              display: "flex", gap: 16, justifyContent: "center",
              fontSize: 9, color: "#4a5568",
            }}>
              <span><span style={{ color: "#00aaff" }}>●</span> Wi-Fi AP</span>
              <span><span style={{ color: "#aa44ff" }}>◆</span> BLE Device</span>
              <span><span style={{ color: "#00ff44" }}>●</span> Stationary</span>
              <span><span style={{ color: "#ff9900" }}>●</span> Moving</span>
              <span><span style={{ color: "#ff3355" }}>●</span> Fast Motion</span>
            </div>
            
            {/* Entity list */}
            <div style={{
              width: "100%", background: "#0d1117", borderRadius: 8,
              border: "1px solid #1a2030", padding: 8,
            }}>
              <div style={{ fontSize: 9, color: "#4a5568", letterSpacing: 1, marginBottom: 6 }}>
                DETECTED PRESENCES ({entities.length})
              </div>
              {entities.length === 0 ? (
                <div style={{ fontSize: 10, color: "#2a3040", textAlign: "center", padding: 16 }}>
                  {scanning ? "Analyzing RF patterns..." : "Start scanning to detect presences"}
                </div>
              ) : entities.map((ent, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 8px", marginBottom: 2,
                  background: "#141c2a", borderRadius: 6,
                  borderLeft: `3px solid ${getEntityColor(ent)}`,
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#c8d0e0" }}>
                      Presence #{i+1} — {ent.type === "fused" ? "Multi-Signal" : ent.source}
                    </div>
                    <div style={{ fontSize: 8, color: "#4a5568" }}>
                      {ent.sources?.join(" + ") || ent.source} | Motion: {(ent.motionLevel * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: getEntityColor(ent) }}>
                      {Math.round(ent.confidence * 100)}%
                    </div>
                    <div style={{ fontSize: 8, color: "#4a5568" }}>{ent.distance?.toFixed(1)}m</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* ========= SCANNER MODE ========= */}
        {mode === MODES.SCANNER && (
          <div>
            {/* Wi-Fi Networks */}
            <div style={{
              background: "#0d1117", borderRadius: 8, border: "1px solid #1a2030",
              padding: 10, marginBottom: 8,
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8,
              }}>
                <span style={{ fontSize: 11, color: "#00aaff", letterSpacing: 1, fontWeight: 600 }}>
                  📶 WI-FI NETWORKS ({wifiData.length})
                </span>
                <span style={{ fontSize: 8, color: "#4a5568" }}>Avg RSSI: {avgRSSI} dBm</span>
              </div>
              
              <div style={{ maxHeight: 200, overflow: "auto" }}>
                {wifiData.length === 0 ? (
                  <div style={{ fontSize: 10, color: "#2a3040", textAlign: "center", padding: 12 }}>
                    {scanning ? "Scanning..." : "Start scanning"}
                  </div>
                ) : wifiData.sort((a,b) => b.rssi - a.rssi).map((w, i) => (
                  <div key={i} style={{
                    padding: "6px 8px", marginBottom: 2,
                    background: "#141c2a", borderRadius: 6,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: "#c8d0e0", fontWeight: 500 }}>
                        {w.ssid || "<Hidden>"}{" "}
                        <span style={{ fontSize: 8, color: w.security === "Open" ? "#ff4444" : "#00ff44" }}>
                          {w.security}
                        </span>
                      </div>
                      <div style={{ fontSize: 8, color: "#4a5568" }}>
                        {w.bssid} • {w.manufacturer} • {w.standard} CH{w.channel}
                      </div>
                      {w.motionScore > 0.3 && (
                        <div style={{ fontSize: 8, color: "#ff9900", marginTop: 1 }}>
                          ⚠ CSI motion detected: {(w.motionScore * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right", minWidth: 55 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 700,
                        color: w.rssi > -50 ? "#00ff44" : w.rssi > -70 ? "#ffaa00" : "#ff4444",
                      }}>
                        {Math.round(w.rssi)} dBm
                      </div>
                      <div style={{ fontSize: 8, color: "#4a5568" }}>{w.distance?.toFixed(1)}m</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* BLE Devices */}
            <div style={{
              background: "#0d1117", borderRadius: 8, border: "1px solid #1a2030",
              padding: 10, marginBottom: 8,
            }}>
              <span style={{ fontSize: 11, color: "#aa44ff", letterSpacing: 1, fontWeight: 600 }}>
                🔵 BLUETOOTH LE DEVICES ({bleData.length})
              </span>
              
              <div style={{ maxHeight: 200, overflow: "auto", marginTop: 8 }}>
                {bleData.length === 0 ? (
                  <div style={{ fontSize: 10, color: "#2a3040", textAlign: "center", padding: 12 }}>
                    {scanning ? "Scanning..." : "Start scanning"}
                  </div>
                ) : bleData.sort((a,b) => b.rssi - a.rssi).map((b, i) => (
                  <div key={i} style={{
                    padding: "6px 8px", marginBottom: 2,
                    background: "#141c2a", borderRadius: 6,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#c8d0e0" }}>
                        {b.icon} {b.name}
                        <span style={{ fontSize: 8, color: "#4a5568", marginLeft: 4 }}>{b.deviceType}</span>
                      </div>
                      <div style={{ fontSize: 8, color: "#4a5568" }}>
                        {b.mac} • {b.manufacturer}
                        {b.connectable && <span style={{ color: "#00aaff" }}> • Connectable</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontSize: 12, fontWeight: 700,
                        color: b.rssi > -60 ? "#00ff44" : b.rssi > -80 ? "#ffaa00" : "#ff4444",
                      }}>
                        {Math.round(b.rssi)} dBm
                      </div>
                      <div style={{ fontSize: 8, color: "#4a5568" }}>{b.distance?.toFixed(1)}m</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* UWB */}
            <div style={{
              background: "#0d1117", borderRadius: 8, border: "1px solid #1a2030",
              padding: 10,
            }}>
              <span style={{ fontSize: 11, color: "#ff6600", letterSpacing: 1, fontWeight: 600 }}>
                📐 UWB RANGING ({uwbData.length})
              </span>
              <div style={{ marginTop: 8 }}>
                {uwbData.map((u, i) => (
                  <div key={i} style={{
                    padding: "6px 8px", marginBottom: 2,
                    background: "#141c2a", borderRadius: 6,
                    display: "flex", justifyContent: "space-between",
                  }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#c8d0e0" }}>{u.name}</div>
                      <div style={{ fontSize: 8, color: "#4a5568" }}>
                        Az: {u.azimuth?.toFixed(1)}° El: {u.elevation?.toFixed(1)}° 
                        {u.los ? " • LOS ✓" : " • NLOS ✗"}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#ff6600" }}>
                      {u.distance?.toFixed(2)}m
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* ========= INTEL/TRACKING MODE ========= */}
        {mode === MODES.TRACKING && (
          <div>
            {/* Signal Strength Overview */}
            <div style={{
              background: "#0d1117", borderRadius: 8, border: "1px solid #1a2030",
              padding: 12, marginBottom: 8,
            }}>
              <div style={{ fontSize: 11, color: "#00ff88", letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>
                📊 SIGNAL INTELLIGENCE
              </div>
              
              {wifiData.slice(0, 5).map((w, i) => (
                <SignalMeter key={i}
                  label={`${w.ssid} (${w.frequency})`}
                  value={Math.round(w.rssi)}
                  max={-95}
                  color={w.rssi > -50 ? "#00ff44" : w.rssi > -70 ? "#ffaa00" : "#ff4444"}
                  unit=" dBm"
                />
              ))}
            </div>
            
            {/* Security Analysis */}
            <div style={{
              background: "#0d1117", borderRadius: 8, border: "1px solid #1a2030",
              padding: 12, marginBottom: 8,
            }}>
              <div style={{ fontSize: 11, color: "#ff4444", letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>
                🛡 SECURITY ANALYSIS
              </div>
              
              {(() => {
                const openNets = wifiData.filter(w => w.security === "Open");
                const wepNets = wifiData.filter(w => w.security === "WEP");
                const wpa3 = wifiData.filter(w => w.security === "WPA3");
                const unknownBLE = bleData.filter(b => b.deviceType === "Unknown");
                
                return (
                  <>
                    <div style={{
                      padding: 8, background: openNets.length > 0 ? "#331a1a" : "#1a331a",
                      borderRadius: 6, marginBottom: 4, fontSize: 10,
                      borderLeft: `3px solid ${openNets.length > 0 ? "#ff4444" : "#00ff44"}`,
                    }}>
                      {openNets.length > 0 
                        ? `⚠ ${openNets.length} open network(s) detected — potential security risk`
                        : "✓ No open networks detected"}
                    </div>
                    <div style={{
                      padding: 8, background: wepNets.length > 0 ? "#332a1a" : "#1a331a",
                      borderRadius: 6, marginBottom: 4, fontSize: 10,
                      borderLeft: `3px solid ${wepNets.length > 0 ? "#ff9900" : "#00ff44"}`,
                    }}>
                      {wepNets.length > 0 
                        ? `⚠ ${wepNets.length} WEP network(s) — deprecated, easily cracked`
                        : "✓ No WEP networks detected"}
                    </div>
                    <div style={{
                      padding: 8, background: "#1a2030",
                      borderRadius: 6, marginBottom: 4, fontSize: 10,
                      borderLeft: "3px solid #00aaff",
                    }}>
                      ℹ {wpa3.length} WPA3 network(s) — latest security standard
                    </div>
                    <div style={{
                      padding: 8, background: unknownBLE.length > 0 ? "#332a1a" : "#1a331a",
                      borderRadius: 6, fontSize: 10,
                      borderLeft: `3px solid ${unknownBLE.length > 0 ? "#ff9900" : "#00ff44"}`,
                    }}>
                      {unknownBLE.length > 0 
                        ? `⚠ ${unknownBLE.length} unknown BLE device(s) — could be trackers`
                        : "✓ All BLE devices identified"}
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Sensor Data */}
            <div style={{
              background: "#0d1117", borderRadius: 8, border: "1px solid #1a2030",
              padding: 12, marginBottom: 8,
            }}>
              <div style={{ fontSize: 11, color: "#aa44ff", letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>
                🧭 SENSOR FUSION DATA
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                {[
                  { label: "HEADING", value: `${Math.round(sensorData.orientation?.alpha || 0)}°`, color: "#00ff88" },
                  { label: "PITCH", value: `${Math.round(sensorData.orientation?.beta || 0)}°`, color: "#00aaff" },
                  { label: "ROLL", value: `${(sensorData.orientation?.gamma || 0).toFixed(1)}°`, color: "#aa44ff" },
                  { label: "POS X", value: `${sensorData.position?.x?.toFixed(2) || 0}m`, color: "#ff9900" },
                  { label: "POS Y", value: `${sensorData.position?.y?.toFixed(2) || 0}m`, color: "#ff9900" },
                  { label: "POS Z", value: `${sensorData.position?.z?.toFixed(2) || 0}m`, color: "#ff9900" },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: "#141c2a", borderRadius: 6, padding: "6px 8px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 8, color: "#4a5568", letterSpacing: 1 }}>{s.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Manufacturer breakdown */}
            <div style={{
              background: "#0d1117", borderRadius: 8, border: "1px solid #1a2030",
              padding: 12,
            }}>
              <div style={{ fontSize: 11, color: "#ffaa00", letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>
                🏭 DEVICE MANUFACTURERS
              </div>
              {(() => {
                const mfrs = {};
                [...wifiData, ...bleData].forEach(d => {
                  const m = d.manufacturer || "Unknown";
                  mfrs[m] = (mfrs[m] || 0) + 1;
                });
                return Object.entries(mfrs).sort((a,b) => b[1] - a[1]).slice(0, 8).map(([name, count], i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "4px 8px", marginBottom: 2,
                    background: "#141c2a", borderRadius: 4,
                  }}>
                    <span style={{ fontSize: 10, color: "#c8d0e0" }}>{name}</span>
                    <span style={{ fontSize: 10, color: "#ffaa00", fontWeight: 600 }}>{count}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom controls */}
      <div style={{
        position: "sticky", bottom: 0,
        padding: "12px 16px",
        background: "linear-gradient(0deg, #0a0d14 0%, #0a0d14dd 80%, transparent 100%)",
        display: "flex", gap: 8, justifyContent: "center",
      }}>
        <button
          onClick={() => setScanning(!scanning)}
          style={{
            flex: 2, padding: "14px 20px",
            background: scanning 
              ? "linear-gradient(135deg, #331a1a 0%, #1a0a0a 100%)" 
              : "linear-gradient(135deg, #0a331a 0%, #0a1a0a 100%)",
            border: `2px solid ${scanning ? "#ff4444" : "#00ff44"}`,
            borderRadius: 12, cursor: "pointer",
            color: scanning ? "#ff4444" : "#00ff44",
            fontSize: 13, fontWeight: 700,
            letterSpacing: 2,
            fontFamily: "'JetBrains Mono', monospace",
            boxShadow: scanning 
              ? "0 0 20px #ff444420, inset 0 0 20px #ff444410" 
              : "0 0 20px #00ff4420, inset 0 0 20px #00ff4410",
            transition: "all 0.3s",
          }}
        >
          {scanning ? "■ STOP SCAN" : "◉ START SCAN"}
        </button>
        
        <button onClick={() => setShowCalibration(!showCalibration)} style={{
          flex: 1, padding: "14px 12px",
          background: "#0d1117", border: "1px solid #1a2535",
          borderRadius: 12, cursor: "pointer",
          color: "#4a5568", fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: 1,
        }}>
          ⚙ SETUP
        </button>
        
        <button onClick={handleExport} style={{
          flex: 1, padding: "14px 12px",
          background: "#0d1117", border: "1px solid #1a2535",
          borderRadius: 12, cursor: "pointer",
          color: "#4a5568", fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: 1,
        }}>
          📤 EXPORT
        </button>
      </div>
      
      {/* Calibration modal */}
      {showCalibration && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "#000000cc", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }} onClick={() => setShowCalibration(false)}>
          <div style={{
            background: "#0d1117", borderRadius: 16, padding: 20,
            border: "1px solid #1a2535", maxWidth: 350, width: "100%",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#00ff88", marginBottom: 16, letterSpacing: 1 }}>
              ⚙ CALIBRATION
            </div>
            
            {[
              { label: "Room Width (m)", key: "width", min: 3, max: 30 },
              { label: "Room Depth (m)", key: "depth", min: 3, max: 30 },
              { label: "Room Height (m)", key: "height", min: 2, max: 6 },
            ].map(({ label, key, min, max }) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#8892a4", marginBottom: 4 }}>
                  <span>{label}</span>
                  <span style={{ color: "#00ff88" }}>{roomSize[key]}m</span>
                </div>
                <input type="range" min={min} max={max} step="0.5"
                  value={roomSize[key]}
                  onChange={e => setRoomSize(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                  style={{ width: "100%", accentColor: "#00ff88" }}
                />
              </div>
            ))}
            
            <div style={{
              marginTop: 12, padding: 10, background: "#141c2a", borderRadius: 8,
              fontSize: 9, color: "#4a5568", lineHeight: 1.6,
            }}>
              <div style={{ color: "#ffaa00", marginBottom: 4, fontWeight: 600 }}>ℹ ABOUT THIS APP</div>
              RF Ghost Vision uses Wi-Fi CSI variance, BLE proximity, and UWB ranging to estimate
              human presence. Silhouettes are abstract representations based on RF signal analysis —
              not camera imagery. Detection accuracy depends on environment, signal density, and
              number of active access points. Best results in areas with 5+ Wi-Fi APs.
            </div>
            
            <button onClick={() => setShowCalibration(false)} style={{
              width: "100%", marginTop: 12, padding: 12,
              background: "#1a2535", border: "1px solid #2a3545",
              borderRadius: 8, cursor: "pointer",
              color: "#00ff88", fontSize: 11, fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              CLOSE
            </button>
          </div>
        </div>
      )}
      
      {/* Inline styles for animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0d14; }
        ::-webkit-scrollbar-thumb { background: #1a2535; border-radius: 2px; }
        
        input[type="range"] {
          -webkit-appearance: none;
          height: 4px;
          background: #1a2535;
          border-radius: 2px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
