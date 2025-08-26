"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Line2 } from 'three-stdlib';

const Contour3D = ({ contour }: { contour: number[][] }) => {
  const lineRef = useRef<Line2>(null);
  
  // Convert 2D contour points to 3D
  const points = contour.map(([x, y]) => new THREE.Vector3(
    (x - 250) * 0.01,  // Center and scale x
    (250 - y) * 0.01,  // Flip y and center
    0                  // Keep z=0 for now
  ));

  // Close the loop
  if (points.length > 0) {
    points.push(points[0].clone());
  }

  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        color="hotpink"
        lineWidth={3}
      />
      <gridHelper args={[10, 10]} />
    </group>
  );
};

interface ViewerProps {
  contourData: number[][] | null;
}

const Viewer = ({ contourData }: ViewerProps) => {
  return (
    <div className="w-full h-full bg-gray-800 rounded-lg">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {contourData && <Contour3D contour={contourData} />}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Viewer;
