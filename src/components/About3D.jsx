import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Environment, Float } from "@react-three/drei";

function Waveform({ scrollY }) {
    const meshRef = useRef();
    const pointsRef = useRef();

    // Create a grid of points
    const { positions, colors } = useMemo(() => {
        const count = 50; // 50x50 grid
        const positions = new Float32Array(count * count * 3);
        const colors = new Float32Array(count * count * 3);
        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const index = (i * count + j) * 3;
                // X and Z coordinates centered
                positions[index] = (i / count - 0.5) * 10;
                positions[index + 1] = 0; // Y is height
                positions[index + 2] = (j / count - 0.5) * 10;

                // Color gradient based on position
                color.setHSL(0.2 + (i / count) * 0.1, 1, 0.5); // Lime-ish
                colors[index] = color.r;
                colors[index + 1] = color.g;
                colors[index + 2] = color.b;
            }
        }
        return { positions, colors };
    }, []);

    useFrame(({ clock }) => {
        if (!pointsRef.current) return;

        const time = clock.getElapsedTime();
        const positions = pointsRef.current.geometry.attributes.position.array;
        const count = 50;

        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const index = (i * count + j) * 3;
                const x = positions[index];
                const z = positions[index + 2];

                // Wave equation
                // Complex wave moving diagonally
                const y = Math.sin(x * 0.5 + time) * Math.cos(z * 0.5 + time) * 1.5
                    + Math.sin(x * 1.5 + time * 0.5) * 0.5;

                positions[index + 1] = y;
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Rotate entire system slowly
        pointsRef.current.rotation.y = time * 0.1;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </points>
    );
}

export default function About3D() {
    return (
        <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
            <fog attach="fog" args={["#111", 5, 20]} />
            <Waveform />
        </Canvas>
    );
}
