import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import React from "react";

export default function IntroScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center space-y-8">
      {/* Hero image */}
      <div className="relative w-full max-w-2xl">
        <img
          src="/assets/generated/anti-scam-hero.dim_1200x500.png"
          alt="No More Scam — Voyagez en sécurité au Maroc"
          className="w-full rounded-2xl object-cover h-52 sm:h-64 shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent rounded-2xl" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-flex items-center gap-1.5 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Shield className="h-3.5 w-3.5" /> Communauté anti-arnaque
          </span>
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
          No More Scam
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Votre guide de confiance pour voyager au Maroc en toute sécurité.
          Découvrez les prix réels, apprenez à négociez et à éviter les pièges
          des souks marocains.
          <br />
          Notre application vous guide vers une expérience authentique et
          sécurisée.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          {["🛡️ Protégez-vous", "💰 Prix justes", "🤝 Communauté"].map((tag) => (
            <span
              key={tag}
              className="bg-muted text-muted-foreground px-3 py-1 rounded-full border border-border"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        onClick={() => navigate({ to: "/feed" })}
        className="px-10 font-semibold"
      >
        Devenir invulnérable
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
