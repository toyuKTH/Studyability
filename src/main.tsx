import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "./state/store.ts";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import PageLayout from "./components/PageLayout.tsx";
import Home from "./pages/Home.tsx";
import Compare from "./pages/Compare.tsx";
import About from "./pages/About.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PageLayout>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </PageLayout>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
