import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

// Clean Flying Drone
function FlyingDrone({ scale = 0.5 }) {
    const group = useRef();
    const propellers = useRef([]);
    const pathRef = useRef(0);

    useFrame((state, delta) => {
        if (group.current) {
            pathRef.current += delta * 0.2;
            const t = pathRef.current;

            // Gentle loop path
            const x = Math.sin(t) * 3;
            const y = Math.cos(t * 0.5) * 0.5 + 1.5;
            const z = -4 + Math.cos(t) * 1;

            group.current.position.set(x, y, z);
            group.current.rotation.z = -Math.cos(t) * 0.15;
            group.current.rotation.y = Math.sin(t) * 0.3;
        }

        propellers.current.forEach((prop, i) => {
            if (prop) {
                prop.rotation.y = state.clock.elapsedTime * 20 * (i % 2 === 0 ? 1 : -1);
            }
        });
    });

    const arms = [[0.4, 0, 0.4], [-0.4, 0, 0.4], [0.4, 0, -0.4], [-0.4, 0, -0.4]];

    return (
        <group ref={group} scale={scale}>
            {/* Body */}
            <mesh>
                <boxGeometry args={[0.3, 0.1, 0.3]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Camera */}
            <mesh position={[0, -0.1, 0.05]}>
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshStandardMaterial color="#AEFF00" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Arms & Props */}
            {arms.map((pos, i) => (
                <group key={i}>
                    <mesh position={[pos[0] / 2, 0, pos[2] / 2]}>
                        <boxGeometry args={[0.03, 0.03, 0.45]} />
                        <meshStandardMaterial color="#2a2a2a" />
                    </mesh>
                    <mesh position={pos}>
                        <cylinderGeometry args={[0.05, 0.05, 0.06, 12]} />
                        <meshStandardMaterial color="#1a1a1a" />
                    </mesh>
                    <group position={[pos[0], 0.05, pos[2]]} ref={el => propellers.current[i] = el}>
                        <mesh>
                            <cylinderGeometry args={[0.18, 0.18, 0.008, 24]} />
                            <meshBasicMaterial color="#AEFF00" transparent opacity={0.12} />
                        </mesh>
                    </group>
                </group>
            ))}
        </group>
    );
}

// Subtle floating dots
function FloatingDots({ count = 15 }) {
    const points = useRef();

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 8;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
            pos[i * 3 + 2] = -3 - Math.random() * 4;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.elapsedTime * 0.01;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.015} color="#AEFF00" transparent opacity={0.3} />
        </points>
    );
}

// Simple grid
function SubtleGrid() {
    return (
        <gridHelper
            args={[16, 16, "#AEFF00", "#111"]}
            position={[0, -2.5, -3]}
            rotation={[0, 0, 0]}
        />
    );
}

export default function Scene3D() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 5, 3]} intensity={0.5} />
            <pointLight position={[0, 2, -2]} intensity={0.2} color="#AEFF00" />

            <FlyingDrone scale={0.6} />
            <FloatingDots count={12} />
            <SubtleGrid />
        </>
    );
}
