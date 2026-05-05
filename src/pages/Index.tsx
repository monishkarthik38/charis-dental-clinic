import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Highlights } from "@/components/site/Highlights";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Doctors } from "@/components/site/Doctors";
import { Appointment } from "@/components/site/Appointment";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: "Charis Multi Speciality Hospital",
    description: "Advanced dental and multi-speciality hospital in Chennai offering expert dental care, general medicine, diagnostics, and preventive healthcare.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Anna Salai, T. Nagar",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      postalCode: "600017",
      addressCountry: "IN",
    },
    telephone: "+91-98765-43210",
    medicalSpecialty: ["Dentistry", "General Medicine", "Diagnostics", "Preventive Care"],
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <Hero />
        <Highlights />
        <About />
        <Services />
        <Doctors />
        <Appointment />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Index;
