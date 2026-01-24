import { PrismaClient } from "@prisma/client";

export async function seedSystemSettings(prisma: PrismaClient) {
  console.log("⚙️ Seeding System Settings...");

  const settingCategories = [
    {
      name: "Organization",
      slug: "organization",
      description: "Company and organizational details",
      icon: "Building2",
      order: 1,
      settings: [
        { key: "org_name", value: "ABC Corp", type: "string", description: "Organization name" },
        { key: "legal_name", value: "ABC Corporation Inc.", type: "string", description: "Legal entity name" },
        { key: "address", value: "123 Business Ave, Tech City", type: "string", description: "Physical address" },
        { key: "contact_email", value: "contact@abc.corp", type: "string", description: "Primary contact email" },
        { key: "contact_phone", value: "+1-555-0123", type: "string", description: "Primary contact phone" },
        { key: "logo", value: "/images/logo.png", type: "string", description: "Organization logo path" },
        { key: "timezone", value: "UTC", type: "string", description: "System timezone" },
        { key: "date_format", value: "YYYY-MM-DD", type: "string", description: "Preferred date format" },
        { key: "time_format", value: "HH:mm", type: "string", description: "Preferred time format" },
        { key: "currency", value: "USD", type: "string", description: "Base currency" },
        { key: "currency_symbol", value: "$", type: "string", description: "Currency symbol" },
        { key: "decimal_places", value: "2", type: "number", description: "Number of decimal places for currency" },
      ]
    },
    {
      name: "Localization",
      slug: "localization",
      description: "Regional and language preferences",
      icon: "Globe",
      order: 2,
      settings: [
        { key: "language", value: "en", type: "string", description: "Default system language" },
        { key: "country", value: "US", type: "string", description: "Default country" },
        { key: "number_format", value: "standard", type: "string", description: "Number formatting style" },
        { key: "week_starts_on", value: "1", type: "number", description: "Starting day of the week (0=Sun, 1=Mon)" },
      ]
    },
    {
      name: "User-Auth-Settings",
      slug: "user-auth-settings",
      description: "Authentication and security settings",
      icon: "ShieldCheck",
      order: 3,
      settings: [
        { key: "allow_self_registration", value: "true", type: "boolean", description: "Allow users to sign up" },
        { key: "require_email_verification", value: "true", type: "boolean", description: "Require email verification after signup" },
        { key: "default_role", value: "User", type: "string", description: "Default role for new users" },
        { key: "password_min_length", value: "8", type: "number", description: "Minimum password length" },
        { key: "require_special_characters", value: "true", type: "boolean", description: "Require special characters in passwords" },
        { key: "session_timeout", value: "3600", type: "number", description: "Session timeout in seconds" },
        { key: "max_login_attempts", value: "5", type: "number", description: "Maximum failed login attempts before lockout" },
        { key: "2fa_enabled", value: "false", type: "boolean", description: "Enable two-factor authentication system-wide" },
        { key: "otp_expiration", value: "300", type: "number", description: "OTP expiration time in seconds" },
      ]
    },
    {
      name: "UI Branding",
      slug: "ui-branding",
      description: "Whitelabeling and look & feel",
      icon: "Palette",
      order: 4,
      settings: [
        { key: "primary_color", value: "#000000", type: "string", description: "Primary theme color" },
        { key: "secondary_color", value: "#ffffff", type: "string", description: "Secondary theme color" },
        { key: "dark_mode_default", value: "false", type: "boolean", description: "Default to dark mode" },
        { key: "app_name", value: "NextJS Boilerplate", type: "string", description: "Application name used in headers" },
        { key: "favicon", value: "/favicon.ico", type: "string", description: "Path to favicon" },
        { key: "email_logo", value: "/images/email-logo.png", type: "string", description: "Logo for email templates" },
        { key: "footer_text", value: "© 2026 ABc Corp", type: "string", description: "Footer copyright text" },
        { key: "powered_by_text", value: "Powered by NextJS", type: "string", description: "Branding text" },
      ]
    },
    {
      name: "System Behavior",
      slug: "system-behavior",
      description: "Core system runtime flags",
      icon: "Cpu",
      order: 5,
      settings: [
        { key: "maintenance_mode", value: "false", type: "boolean", description: "Enable maintenance mode" },
        { key: "maintenance_message", value: "System is undergoing scheduled maintenance.", type: "string", description: "Message shown during maintenance" },
      ]
    },
    {
      name: "Module Toggles/Switch",
      slug: "module-toggles",
      description: "Enable or disable feature modules",
      icon: "ToggleLeft",
      order: 6,
      settings: [
        { key: "enable_user_management", value: "true", type: "boolean", description: "Enable User Management module" },
        { key: "enable_audit_logs", value: "true", type: "boolean", description: "Enable Audit Logs module" },
        { key: "enable_billing", value: "false", type: "boolean", description: "Enable Billing/Invoicing module" },
      ]
    },
    {
      name: "Financial & Billing",
      slug: "financial-billing",
      description: "Taxation and invoicing configuration",
      icon: "Receipt",
      order: 7,
      settings: [
        { key: "tax_rate", value: "10", type: "number", description: "Default tax rate percentage" },
        { key: "vat_enabled", value: "true", type: "boolean", description: "Enable VAT tracking" },
        { key: "invoice_prefix", value: "INV-", type: "string", description: "Prefix for invoice numbers" },
        { key: "receipt_prefix", value: "RCP-", type: "string", description: "Prefix for receipt numbers" },
        { key: "fiscal_year_start", value: "1", type: "number", description: "Starting month of fiscal year" },
        { key: "rounding_mode", value: "half-up", type: "string", description: "Currency rounding mode" },
      ]
    },
    {
      name: "Developer Integration",
      slug: "developer-integration",
      description: "Third-party keys and API settings",
      icon: "Code2",
      order: 8,
      settings: [
        { key: "api_key", value: "", type: "string", description: "Internal API key" },
        { key: "webhook_url", value: "", type: "string", description: "Default webhook destination" },
        { key: "oauth_google_id", value: "", type: "string", description: "Google OAuth Client ID" },
        { key: "stripe_public_key", value: "", type: "string", description: "Stripe Public Key" },
        { key: "paypal_client_id", value: "", type: "string", description: "PayPal Client ID" },
      ]
    },
  ];

  for (const category of settingCategories) {
    const upsertedCategory = await prisma.systemSettingCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        order: category.order,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        order: category.order,
      },
    });

    for (const setting of category.settings) {
      await prisma.systemSetting.upsert({
        where: { key: setting.key },
        update: {
          value: setting.value,
          type: setting.type,
          description: setting.description,
          categoryId: upsertedCategory.id,
        },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.type,
          description: setting.description,
          categoryId: upsertedCategory.id,
        },
      });
    }
  }

  console.log("✅ System settings seeded.");
}
