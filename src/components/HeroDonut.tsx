import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Spinning donut component
function SpinningDonut() {
    const meshRef = useRef<THREE.Mesh>(null);

    // Animation loop - rotate around Y axis
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Slow rotation around Y axis
            meshRef.current.rotation.y += 0.1 * delta;
            meshRef.current.rotation.z += 0.1 * delta;
        }
    });

    return (
        <mesh ref={meshRef}>
            {/* TorusGeometry with wireframe material */}
            <torusGeometry args={[2, 0.5, 16, 100]} />
            <meshBasicMaterial
                color="#ffffff"
                wireframe={true}
                transparent={true}
                opacity={0.2}
            />
        </mesh>
    );
}

// Main HeroDonut component
export default function HeroDonut() {
    return (
        <div className="hero-donut">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent'
                }}
            >
                {/* Ambient light for basic illumination */}
                <ambientLight intensity={0.5} />

                {/* Spinning donut */}
                <SpinningDonut />
            </Canvas>
        </div>
    );
} 