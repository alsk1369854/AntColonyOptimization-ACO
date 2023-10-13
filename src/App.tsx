import React, {Suspense} from 'react';
import './App.css';
import { Canvas } from '@react-three/fiber';
import {OrbitControls, PerspectiveCamera} from '@react-three/drei'

function CarShow(){
  return (
    <>
    <OrbitControls target={[0,0.35,0]} maxPolarAngle={1.45}></OrbitControls>
    <PerspectiveCamera makeDefault far={50} position={[3,2,5]}></PerspectiveCamera>
    <mesh>
      <boxGeometry args={[1,1,1]}></boxGeometry>
      <meshBasicMaterial color={'red'}></meshBasicMaterial>
    </mesh>
    </>
  )
}


function App() {
  return (
    <Suspense fallback={null}>
      <Canvas shadows>
        <CarShow></CarShow>
      </Canvas>
    </Suspense>
  );
}

export default App;
