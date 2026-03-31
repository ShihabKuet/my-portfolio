import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Zod schema — defines exactly what data this endpoint accepts
// If anything is wrong, Zod rejects it before we touch it
const contactSchema = z.object({
  name:    z.string().min(2,  "Name must be at least 2 characters"),
  email:   z.string().email("Please enter a valid email"),
  subject: z.string().min(5,  "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

// This function handles POST requests to /api/contact
export async function POST(request: NextRequest) {
  try {
    // 1. Parse the incoming JSON body
    const body = await request.json();

    // 2. Validate against our schema
    // .safeParse() returns { success, data } or { success, error } — never throws
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.flatten() },
        { status: 400 } // 400 = Bad Request
      );
    }

    const { name, email, subject, message } = result.data;

    // 3. Send the email via Resend
    await resend.emails.send({
      from:    "Portfolio Contact <onboarding@resend.dev>", // Resend's test sender
      to:      process.env.CONTACT_EMAIL!,                  // Your email
      replyTo: email,                                       // Visitor's email
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">New message from your portfolio</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; color: #6b7280; width: 80px;">Name</td>
              <td style="padding: 8px; font-weight: 600;">${name}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 8px; color: #6b7280;">Email</td>
              <td style="padding: 8px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #6b7280;">Subject</td>
              <td style="padding: 8px;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 8px; white-space: pre-wrap;">
            ${message}
          </div>
        </div>
      `,
    });

    // 4. Return success
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 } // 500 = Internal Server Error
    );
  }
}