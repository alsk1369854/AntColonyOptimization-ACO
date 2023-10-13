import React, { Suspense } from "react";
import "./App.css";
import Example from "./components/Example";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";

function App() {
  return (
    <Suspense fallback={true}>
      <Example></Example>
    </Suspense>
  );
}

export default App;
