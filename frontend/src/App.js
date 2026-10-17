import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Industries from "@/pages/Industries";
import CaseStudies from "@/pages/CaseStudies";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Calculator from "@/pages/Calculator";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Portal from "@/pages/Portal";
import Admin from "@/pages/Admin";

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
                <Route path="/industries" element={<Industries />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/portal/*" element={<ProtectedRoute><Portal /></ProtectedRoute>} />
                <Route path="/admin/*" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
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
