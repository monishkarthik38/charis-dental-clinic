import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, ShieldCheck, Star } from "lucide-react";
import heroImg from "@/assets/hero-hospital.jpg";

export const Hero = () => {
  return (
    <section id="home" className="relative pt-28 md:pt-36 pb-16 md:pb-24 bg-hero-gradient overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" aria-hidden />

      <div className="container relative grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-soft border border-primary/10 text-primary text-xs font-semibold mb-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trusted by 10,000+ patients in Chennai
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground">
            Advanced <span className="text-gradient">Dental Care</span> You Can Trust
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Expert doctors, modern technology, and compassionate care in Chennai — delivering medical excellence with a human touch.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="hero" size="xl" asChild>
              <a href="#appointment">
                Book Appointment <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="soft" size="xl" asChild>
              <a href="#contact">
                <Phone className="h-4 w-4" /> Contact Us
              </a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-8">
            <div>
              <div className="font-display text-3xl font-bold">15+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Years of Care</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <div className="font-display text-3xl font-bold">25+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Specialists</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <div className="flex items-center gap-1 font-display text-3xl font-bold">
                4.9 <Star className="h-5 w-5 fill-accent text-accent" />
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Patient Rating</div>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-in">
          <div className="absolute inset-0 bg-primary-gradient rounded-3xl blur-3xl opacity-20" aria-hidden />
          <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/40">
            <img
              src={heroImg}
              alt="Charis Dental Clinic — modern medical facility in Chennai"
              width={1536}
              height={1024}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-card border border-border flex items-center gap-3 animate-float hidden sm:flex">
            <div className="h-12 w-12 rounded-xl bg-success/10 grid place-items-center">
              <ShieldCheck className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-sm font-semibold">NABH Standards</div>
              <div className="text-xs text-muted-foreground">Certified care quality</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
