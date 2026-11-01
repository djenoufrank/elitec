import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Offers from "@/pages/Offers";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Calculator from "@/pages/Calculator";
import Privacy from "@/pages/Privacy";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Portal from "@/pages/Portal";
import Admin from "@/pages/Admin";
import { FEATURES } from "@/lib/features";

function App() {
  return (
    <div className="App bg-background text-foreground">
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/login" element={FEATURES.authentication ? <Login /> : <Navigate to="/" replace />} />
                <Route path="/register" element={FEATURES.authentication ? <Register /> : <Navigate to="/" replace />} />
                <Route path="/portal/*" element={FEATURES.authentication ? <ProtectedRoute><Portal /></ProtectedRoute> : <Navigate to="/" replace />} />
                <Route path="/admin/*" element={FEATURES.authentication ? <ProtectedRoute requireAdmin><Admin /></ProtectedRoute> : <Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" richColors />
          </BrowserRouter>
        </AuthProvider>
      </I18nProvider>
    </div>
  );
}

export default App;
