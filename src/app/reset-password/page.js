import Link from "next/link";
import ResetPasswordPanel from "@/components/ResetPasswordPanel";
import styles from "@/components/landing/EduAssistAuth.module.css";

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === "string" ? params.token : "";

  return (
    <div className={styles.shell}>
      <div className={styles.backdrop} />
      <div className={styles.layout}>
        <section className={styles.marketing}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>EA</span>
            <span>EduAssist AI</span>
          </Link>
          <p className={styles.eyebrow}>Password reset</p>
          <h1 className={styles.title}>Set a fresh password.</h1>
          <p className={styles.description}>
            Enter a new password for your account. Reset links expire after 20 minutes.
          </p>
        </section>

        <ResetPasswordPanel token={token} />
      </div>
    </div>
  );
}
