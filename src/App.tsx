import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

// 500 küre için rastgele pozisyonlar ve numaralar üreten fonksiyon
type SphereData = { id: number; position: [number, number, number] };
function generateSpheres(count: number): SphereData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    position: [
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 60,
    ],
  }));
}

function App() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(500);
  const spheres = useMemo(() => generateSpheres(500), []);
  const filtered = spheres.filter(s => s.id >= min && s.id <= max);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D ortam tam ekran */}
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }} style={{ position: 'absolute', inset: 0 }}>
        <color attach="background" args={["#1a0033"]} />
        <Stars radius={120} depth={60} count={2000} factor={4} saturation={2} fade speed={1} />
        <ambientLight intensity={0.7} />
        <pointLight position={[30, 30, 30]} intensity={1} />
        <OrbitControls />
        {filtered.map(sphere => (
          <group key={sphere.id} position={sphere.position}>
            <mesh>
              <sphereGeometry args={[1.5, 32, 32]} />
              <meshStandardMaterial color={'#39f'} />
            </mesh>
            <Text
              position={[0, 0, 2]}
              fontSize={1}
              color="#fff"
              anchorX="center"
              anchorY="middle"
              outlineColor="#000"
              outlineWidth={0.1}
            >
              {sphere.id}
            </Text>
          </group>
        ))}
      </Canvas>
      {/* Sol üstte sade filtre paneli */}
      <div style={{ position: 'absolute', top: 24, left: 24, minWidth: 180, background: 'rgba(24,24,40,0.92)', color: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 2px 16px #0007', zIndex: 10, maxWidth: '90vw' }}>
        <h3 style={{margin:'0 0 10px 0', fontWeight:600, fontSize: '1.1rem'}}>Küre Filtresi</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <label style={{fontSize:13}}>Min:</label>
          <input type="number" min={1} max={max} value={min} onChange={e => setMin(Number(e.target.value))} style={{ width: 55, fontSize:13, borderRadius:4, border:'1px solid #333', background:'#222', color:'#fff', padding:'2px 6px' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{fontSize:13}}>Max:</label>
          <input type="number" min={min} max={500} value={max} onChange={e => setMax(Number(e.target.value))} style={{ width: 55, fontSize:13, borderRadius:4, border:'1px solid #333', background:'#222', color:'#fff', padding:'2px 6px' }} />
        </div>
        <div style={{ marginTop: 12, fontSize:13 }}>
          <b>Gösterilen küre:</b> {filtered.length}
        </div>
      </div>
      <Analytics />
    </div>
  );
}

export default App;
