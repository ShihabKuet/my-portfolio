"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { personalInfo } from "@/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Same schema as the backend — single source of truth for validation rules
// The form validates BEFORE sending, and the backend validates AFTER receiving
const contactSchema = z.object({
  name:    z.string().min(2,  "Name must be at least 2 characters"),
  email:   z.string().email("Please enter a valid email"),
  subject: z.string().min(5,  "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Status of the form submission
type FormStatus = "idle" | "loading" | "success" | "error";

// ── Contact Info Cards ────────────────────────────────────────────────────────
const contactInfo = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "your@email.com",   // ← will pull from personalInfo
    href: `mailto:${personalInfo.email}`,
  },
  {
    icon: <MapPin size={18} />,
    label: "Location",
    value: personalInfo.location,
    href: null,
  },
];

const socialLinks = [
  { icon: <FaGithub size={20} />,   label: "GitHub",   href: personalInfo.github   },
  { icon: <FaLinkedin size={20} />, label: "LinkedIn", href: personalInfo.linkedin },
  { icon: <Mail size={20} />,       label: "Email",    href: `mailto:${personalInfo.email}` },
];

// ── Reusable Input component ──────────────────────────────────────────────────
// Building small sub-components reduces repetition and keeps JSX readable
function InputField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-zinc-300 text-sm font-medium mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = cn(
  "w-full px-4 py-3 rounded-lg text-sm",
  "bg-zinc-900/50 border border-zinc-800",
  "text-zinc-100 placeholder:text-zinc-600",
  "focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50",
  "transition-colors duration-200"
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");

  // react-hook-form setup
  // register()   → connects input fields to the form
  // handleSubmit → wraps our submit function with validation
  // formState    → contains errors, isSubmitting, etc.
  // reset()      → clears the form after success
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema), // plug in Zod validation
  });

  // This only runs if Zod validation passes
  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send");

      setStatus("success");
      reset(); // clear form fields

      // Reset back to idle after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Contact"
          subtitle="Have a project in mind or just want to connect? I'd love to hear from you."
        />

        <div className="grid lg:grid-cols-5 gap-10">

          {/* ── Left Column — Info (2/5 width) ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h3 className="text-zinc-100 font-semibold text-lg mb-2">
                Let&apos;s talk
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Whether it&apos;s a job opportunity, collaboration, or just a
                technical discussion — feel free to reach out.
              </p>
            </div>

            {/* Contact info cards */}
            <div className="space-y-3">
              {contactInfo.map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <span className="text-violet-400 shrink-0">{icon}</span>
                  <div>
                    <p className="text-zinc-500 text-xs">{label}</p>
                    {href ? (
                      <a href={href} className="text-zinc-200 text-sm hover:text-violet-400 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-zinc-200 text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-zinc-500 text-xs font-mono mb-3 uppercase tracking-wider">
                Find me on
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 hover:text-violet-400 hover:border-violet-500/30 transition-all duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right Column — Form (3/5 width) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 space-y-5"
            >
              {/* Name + Email row */}
              <div className="grid sm:grid-cols-2 gap-5">
                <InputField label="Name" error={errors.name?.message}>
                  <input
                    {...register("name")}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </InputField>

                <InputField label="Email" error={errors.email?.message}>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="your@email.com"
                    className={inputClass}
                  />
                </InputField>
              </div>

              <InputField label="Subject" error={errors.subject?.message}>
                <input
                  {...register("subject")}
                  placeholder="What's this about?"
                  className={inputClass}
                />
              </InputField>

              <InputField label="Message" error={errors.message?.message}>
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Tell me about your project or just say hi..."
                  className={cn(inputClass, "resize-none")}
                />
              </InputField>

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={cn(
                  "w-full py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200",
                  "flex items-center justify-center gap-2",
                  status === "success"
                    ? "bg-emerald-600 text-white cursor-default"
                    : status === "error"
                    ? "bg-red-600/20 text-red-400 border border-red-500/30"
                    : "bg-violet-600 hover:bg-violet-500 text-white hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                )}
              >
                {status === "loading" && <Loader2 size={16} className="animate-spin" />}
                {status === "success" && <CheckCircle size={16} />}
                {status === "error"   && <AlertCircle size={16} />}
                {status === "idle"    && <Send size={16} />}

                {status === "loading" && "Sending..."}
                {status === "success" && "Message Sent!"}
                {status === "error"   && "Failed — Try Again"}
                {status === "idle"    && "Send Message"}
              </button>

              {/* Feedback messages */}
              {status === "success" && (
                <p className="text-emerald-400 text-sm text-center">
                  ✓ Thanks! I&apos;ll get back to you within 24 hours.
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm text-center">
                  Something went wrong. You can also email me directly at{" "}
                  <a href={`mailto:${personalInfo.email}`} className="underline">
                    {personalInfo.email}
                  </a>
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}