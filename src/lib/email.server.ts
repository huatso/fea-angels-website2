import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const LOGO_URL =
  "https://vhzweugjodimgjkqlaur.supabase.co/storage/v1/object/public/images/logos/Logo%20Azul%20&%20Azul%20Escuro.png";
const LOGO_BRANCA =
  "https://vhzweugjodimgjkqlaur.supabase.co/storage/v1/object/public/images/logos/Logo%20FEA%20Angels%20-%20Branca.png";

function getTransporter() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.resend.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: { user: process.env.SMTP_USER || "resend", pass: key },
  });
}

const FROM = process.env.SMTP_FROM || "noreply@feaangels.huatso.com.br";

function brandedHtml(bodyContent: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;line-height:1.6">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0"><tr><td align="center">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    <tr><td align="center" style="padding:40px 40px 24px">
      <img src="${LOGO_URL}" alt="FEA Angels" width="180" style="display:block;border:0;max-width:180px;height:auto">
    </td></tr>
    <tr><td style="padding:0 40px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:2px solid #003366;height:0">&nbsp;</td></tr></table></td></tr>
    <tr><td style="padding:32px 40px 40px;color:#27272a">${bodyContent}</td></tr>
    <tr><td style="background:#003366;padding:32px 40px">
      <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
        <img src="${LOGO_BRANCA}" alt="FEA Angels" width="140" style="display:block;border:0;max-width:140px;height:auto;margin-bottom:16px;opacity:0.9">
        <p style="margin:0 0 8px;font-size:13px;color:#a1a1aa;line-height:1.5"><strong style="color:#fff">FEA Angels</strong><br>Faculdade de Economia, Administra\u00e7\u00e3o e Contabilidade da USP<br>Av. Prof. Luciano Gualberto, 908 \u2014 Butant\u00e3 \u2014 S\u00e3o Paulo/SP</p>
        <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.5">Este \u00e9 um e-mail autom\u00e1tico, por favor n\u00e3o responda.<br>Para qualquer d\u00favida, entre em contato: <a href="mailto:contato@feaangels.com.br" style="color:#22d3ee;text-decoration:underline">contato@feaangels.com.br</a></p>
      </td></tr></table>
    </td></tr>
  </table>
  <table width="560" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:16px 0">
    <p style="margin:0;font-size:12px;color:#a1a1aa">&copy; 2026 FEA Angels. Todos os direitos reservados.</p>
  </td></tr></table>
</td></tr></table>
</body></html>`;
}

async function getRecipient(): Promise<string> {
  try {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (key) {
      const supabase = createClient(process.env.VITE_SUPABASE_URL!, key);
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", "config")
        .eq("section", "email_to")
        .order("id", { ascending: false })
        .limit(1)
        .single();
      if (data?.content) return data.content as string;
    }
  } catch {}
  return process.env.SMTP_TO || "contato@feaangels.com.br";
}

export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(1), email: z.string().email(), msg: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { name, email, msg } = data;
    const [transporter, to] = await Promise.all([getTransporter(), getRecipient()]);

    await transporter.sendMail({
      from: `"${name}" <${FROM}>`,
      replyTo: email,
      to,
      subject: `Contato — FEA Angels — ${name}`,
      html: brandedHtml(`
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#003366;font-family:Georgia,'Times New Roman',serif">Novo contato do site</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">
          <tr><td style="padding:8px 12px;font-weight:600;color:#003366;border-bottom:1px solid #e4e4e7">Nome</td><td style="padding:8px 12px;border-bottom:1px solid #e4e4e7">${name}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#003366;border-bottom:1px solid #e4e4e7">E-mail</td><td style="padding:8px 12px;border-bottom:1px solid #e4e4e7"><a href="mailto:${email}">${email}</a></td></tr>
        </table>
        <h3 style="margin:20px 0 8px;font-size:16px;font-weight:600;color:#003366;font-family:Georgia,serif">Mensagem</h3>
        <p style="white-space:pre-wrap;background:#f4f4f5;padding:16px;border-radius:8px;margin:0">${msg}</p>
      `),
    });

    await transporter.sendMail({
      from: `"FEA Angels" <${FROM}>`,
      to: email,
      subject: `Recebemos sua mensagem — FEA Angels`,
      html: brandedHtml(`
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#003366;font-family:Georgia,'Times New Roman',serif">Recebemos sua mensagem!</h2>
        <p style="margin:0 0 16px">Ol\u00e1, <strong>${name}</strong>!</p>
        <p style="margin:0 0 16px">Recebemos sua mensagem enviada pelo site e retornaremos o contato em breve.</p>
        <p style="margin:0 0 16px">Abaixo uma c\u00f3pia do que voc\u00ea nos enviou:</p>
        <blockquote style="background:#f4f4f5;padding:16px;border-radius:8px;margin:16px 0;font-style:italic;color:#52525b">${msg}</blockquote>
        <p style="margin:0">Atenciosamente,<br><strong>Equipe FEA Angels</strong></p>
      `),
    });

    return { ok: true };
  });

export const sendNewsletterEmail = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const { email } = data;
    const [transporter, to] = await Promise.all([getTransporter(), getRecipient()]);
    await transporter.sendMail({
      from: `"FEA Angels" <${FROM}>`,
      to,
      subject: `Nova inscrição na newsletter — ${email}`,
      html: brandedHtml(`
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#003366;font-family:Georgia,'Times New Roman',serif">Nova inscrição na newsletter</h2>
        <p style="margin:0 0 16px">Um novo e-mail se inscreveu na newsletter:</p>
        <p style="background:#f4f4f5;padding:12px 16px;border-radius:8px;font-size:18px;font-weight:600;color:#003366"><a href="mailto:${email}">${email}</a></p>
      `),
    });
    return { ok: true };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string(), email: z.string().email() }))
  .handler(async ({ data }) => {
    const { name, email } = data;
    const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const { error } = await supabase.from("newsletter_subscribers").upsert(
      { name, email },
      { onConflict: "email" },
    );
    if (error) throw new Error(error.message);

    const [transporter, to] = await Promise.all([getTransporter(), getRecipient()]);
    await transporter.sendMail({
      from: `"FEA Angels" <${FROM}>`,
      to,
      subject: `Nova inscrição na newsletter — ${name} <${email}>`,
      html: brandedHtml(`
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#003366;font-family:Georgia,'Times New Roman',serif">Nova inscrição na newsletter</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">
          <tr><td style="padding:8px 12px;font-weight:600;color:#003366;border-bottom:1px solid #e4e4e7">Nome</td><td style="padding:8px 12px;border-bottom:1px solid #e4e4e7">${name}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#003366;border-bottom:1px solid #e4e4e7">E-mail</td><td style="padding:8px 12px;border-bottom:1px solid #e4e4e7"><a href="mailto:${email}">${email}</a></td></tr>
        </table>
      `),
    });

    return { ok: true };
  });

export const sendStartupEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      company: z.string().min(1),
      website: z.string().optional().default(""),
      founder: z.string().min(1),
      email: z.string().email(),
      stage: z.string().optional().default(""),
      sector: z.string().optional().default(""),
      pitch: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const { company, website, founder, email, stage, sector, pitch } = data;
    const [transporter, to] = await Promise.all([getTransporter(), getRecipient()]);

    await transporter.sendMail({
      from: `"${founder}" <${FROM}>`,
      replyTo: email,
      to,
      subject: `Submissão de startup — ${company}`,
      html: brandedHtml(`
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#003366;font-family:Georgia,'Times New Roman',serif">Nova submissão de startup</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">
          <tr><td style="padding:8px 12px;font-weight:600;color:#003366;border-bottom:1px solid #e4e4e7">Startup</td><td style="padding:8px 12px;border-bottom:1px solid #e4e4e7">${company}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#003366;border-bottom:1px solid #e4e4e7">Site</td><td style="padding:8px 12px;border-bottom:1px solid #e4e4e7">${website || "\u2014"}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#003366;border-bottom:1px solid #e4e4e7">Fundador</td><td style="padding:8px 12px;border-bottom:1px solid #e4e4e7">${founder}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#003366;border-bottom:1px solid #e4e4e7">E-mail</td><td style="padding:8px 12px;border-bottom:1px solid #e4e4e7"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#003366;border-bottom:1px solid #e4e4e7">Est\u00e1gio</td><td style="padding:8px 12px;border-bottom:1px solid #e4e4e7">${stage || "\u2014"}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:600;color:#003366;border-bottom:1px solid #e4e4e7">Setor</td><td style="padding:8px 12px;border-bottom:1px solid #e4e4e7">${sector || "\u2014"}</td></tr>
        </table>
        <h3 style="margin:20px 0 8px;font-size:16px;font-weight:600;color:#003366;font-family:Georgia,serif">Pitch</h3>
        <p style="white-space:pre-wrap;background:#f4f4f5;padding:16px;border-radius:8px;margin:0">${pitch}</p>
      `),
    });

    await transporter.sendMail({
      from: `"FEA Angels" <${FROM}>`,
      to: email,
      subject: `Recebemos sua submissão — FEA Angels`,
      html: brandedHtml(`
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#003366;font-family:Georgia,'Times New Roman',serif">Recebemos sua submiss\u00e3o!</h2>
        <p style="margin:0 0 16px">Ol\u00e1, <strong>${founder}</strong>!</p>
        <p style="margin:0 0 16px">Recebemos a submiss\u00e3o da <strong>${company}</strong>. Nossa equipe ir\u00e1 avaliar e retornaremos o contato em at\u00e9 3 semanas.</p>
        <p style="margin:0 0 16px">Abaixo uma c\u00f3pia do que voc\u00ea nos enviou:</p>
        <blockquote style="background:#f4f4f5;padding:16px;border-radius:8px;margin:16px 0;font-style:italic;color:#52525b">
          <strong>${company}</strong>${website ? " — " + website : ""}<br>
          Fundador: ${founder}<br><br>
          ${pitch}
        </blockquote>
        <p style="margin:0">Atenciosamente,<br><strong>Equipe FEA Angels</strong></p>
      `),
    });

    return { ok: true };
  });
