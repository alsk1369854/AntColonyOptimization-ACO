import React, { Suspense } from "react";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <div>
      <Suspense fallback={true}>
        <MainPage></MainPage>
      </Suspense>
    </div>
  );
}

export default App;
