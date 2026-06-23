"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const schema = z.object({
  venueName: z.string().min(2, "Please enter your venue name"),
  contactName: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a phone number"),
  venueType: z.string().min(1, "Please select a venue type"),
  message: z.string().min(10, "Please tell us a bit more — at least 10 characters"),
  consent: z.boolean().refine((v) => v, "Please tick to confirm you have read our Privacy Policy"),
});

type FormValues = z.infer<typeof schema>;

const VENUE_TYPES = [
  "Hotel",
  "Nightclub",
  "Bar / Pub",
  "Restaurant",
  "Gym / Fitness studio",
  "Spa / Salon",
  "Event space",
  "Shopping centre",
  "Office / Workplace",
  "Airport / Transport hub",
  "Festival / Pop-up",
  "Other",
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 font-sans text-xs text-red-600 flex items-center gap-1">
      <AlertCircle size={12} aria-hidden="true" />
      {message}
    </p>
  );
}

const labelClass = "block font-sans text-sm text-ink mb-1.5";
const inputClass =
  "block w-full font-sans text-sm text-ink bg-white border border-ink/15 rounded-xl px-4 py-3 placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const searchParams = useSearchParams();
  const modelParam = searchParams.get("model");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      consent: false,
      message: modelParam
        ? `I'm interested in the ${modelParam} — please get in touch to discuss this model for my venue.`
        : "",
    },
  });

  async function onSubmit(data: FormValues) {
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
      } else {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6">
        <CheckCircle2 size={48} className="text-accent mb-6" aria-hidden="true" />
        <h3 className="font-serif text-2xl text-ink">Thank you</h3>
        <p className="mt-3 font-sans text-sm text-stone max-w-sm leading-relaxed">
          We&apos;ve received your enquiry and will be in touch within two
          working days to arrange a call.
        </p>
        <Button
          variant="ghost"
          className="mt-8 text-accent hover:text-accent-deep"
          onClick={() => setStatus("idle")}
        >
          Submit another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="venueName" className={labelClass}>
            Venue name <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="venueName"
            type="text"
            autoComplete="organization"
            placeholder="The Grand Hotel"
            className={cn(inputClass, errors.venueName && "border-red-400 focus:ring-red-400")}
            aria-invalid={!!errors.venueName}
            aria-describedby={errors.venueName ? "venueName-error" : undefined}
            {...register("venueName")}
          />
          <FieldError message={errors.venueName?.message} />
        </div>
        <div>
          <label htmlFor="contactName" className={labelClass}>
            Your name <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="contactName"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            className={cn(inputClass, errors.contactName && "border-red-400 focus:ring-red-400")}
            aria-invalid={!!errors.contactName}
            {...register("contactName")}
          />
          <FieldError message={errors.contactName?.message} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email address <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jane@thegrandhotel.co.uk"
            className={cn(inputClass, errors.email && "border-red-400 focus:ring-red-400")}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+44 7700 XXXXXX"
            className={cn(inputClass, errors.phone && "border-red-400 focus:ring-red-400")}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="venueType" className={labelClass}>
          Venue type <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <select
          id="venueType"
          className={cn(
            inputClass,
            "appearance-none cursor-pointer",
            errors.venueType && "border-red-400 focus:ring-red-400"
          )}
          aria-invalid={!!errors.venueType}
          {...register("venueType")}
          defaultValue=""
        >
          <option value="" disabled>
            Select a venue type…
          </option>
          {VENUE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <FieldError message={errors.venueType?.message} />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Tell us about your venue <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="A brief description of your venue, rough weekly footfall, and any questions you have…"
          className={cn(inputClass, "resize-none", errors.message && "border-red-400 focus:ring-red-400")}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded-sm border-ink/20 text-accent accent-accent focus:ring-accent shrink-0"
            aria-invalid={!!errors.consent}
            {...register("consent")}
          />
          <span className="font-sans text-sm text-stone leading-relaxed">
            I have read and accept the{" "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-accent transition-colors">
              Privacy Policy
            </a>{" "}
            and consent to Éclat contacting me regarding this enquiry.{" "}
            <span className="text-red-600" aria-hidden="true">*</span>
          </span>
        </label>
        <FieldError message={errors.consent?.message} />
      </div>

      {serverError && (
        <p className="font-sans text-sm text-red-600 flex items-center gap-2">
          <AlertCircle size={16} aria-hidden="true" />
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        variant="accent"
        size="lg"
        disabled={status === "loading"}
        className="w-full sm:w-auto"
      >
        {status === "loading" && (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        )}
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
