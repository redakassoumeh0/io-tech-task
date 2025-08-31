"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const t = useTranslations("footer");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const links = t.raw("links") as string[];

  const emailSchema = Yup.object().shape({
    email: Yup.string().email(t("invalidEmail")).required(t("required")),
  });

  const handleSubmit = async (
    values: { email: string },
    { resetForm }: any
  ) => {
    try {
      const res = await fetch(`http://localhost:1337/api/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { email: values.email } }),
      });

      const data = await res.json();

      if (!res.ok) {
        // إذا الايميل موجود مسبقاً
        if (
          data?.error?.details?.errors?.[0]?.message ===
          "This attribute must be unique"
        ) {
          toast.info(t("emailExists"));
        } else {
          throw new Error(data?.error?.message || "Unknown error");
        }
        return;
      }

      resetForm();
      toast.success(t("successMessage"));
    } catch (err) {
      console.error(err);
      toast.error(t("errorMessage"));
    }
  };

  return (
    <footer className="bg-brand-dark text-white" dir={isRTL ? "rtl" : "ltr"}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">
        <div
          className={`flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between`}
        >
          <div className="flex-1" />

          <Formik
            initialValues={{ email: "" }}
            validationSchema={emailSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form
                className={`flex items-center gap-2 rounded border border-white/40 bg-white/5 px-1 py-1`}
                aria-label="newsletter"
              >
                <Field
                  type="email"
                  name="email"
                  placeholder={t("emailPlaceholder")}
                  className="w-44 sm:w-60 bg-transparent px-3 py-1.5 text-sm text-white placeholder:text-white/70 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded bg-white px-3 py-1.5 text-xs font-medium text-brand-dark hover:opacity-90 transition"
                >
                  {t("subscribe")}
                </button>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-xs text-red-500 ml-2"
                />
              </Form>
            )}
          </Formik>

          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-white/80 text-sm">{t("contacts")}</span>
            <div
              className={`flex items-center ${
                isRTL ? "flex-row-reverse" : ""
              } gap-3`}
            >
              <Link
                href="#"
                aria-label="Twitter"
                className="text-white/80 hover:text-white transition"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="text-white/80 hover:text-white transition"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="text-white/80 hover:text-white transition"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>
        </div>

        <hr className="my-6 border-white/20" />

        <div
          className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}
        >
          <nav className={`-mx-2 flex flex-wrap items-center gap-x-4 gap-y-2`}>
            {links.map((label, i) => (
              <Link
                key={`${label}-${i}`}
                href="#"
                className="px-2 text-sm text-white/80 hover:text-white transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="text-xs text-white/70">
            © {new Date().getFullYear()}. {t("rights")}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
