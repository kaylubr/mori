import { useEffect, useState } from "react"

const SocialLogin = () => {
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.origin !== window.location.origin) return

      setMessage(
        event.data.type === "oauth-success"
          ? "You are signed in."
          : "Unable to sign in with that provider.",
      )
    }

    window.addEventListener("message", handleOAuthMessage)
    return () => window.removeEventListener("message", handleOAuthMessage)
  }, [])

  const openOAuthPopup = (provider: "google" | "github") => {
    const popup = window.open(
      `/api/auth/${provider}`,
      `${provider}-oauth`,
      "width=520,height=650,menubar=no,toolbar=no",
    )

    if (!popup) {
      setMessage("Allow pop-ups to continue with social sign-in.")
    }
  }

  return (
    <>
      <div className="divider">
        <span>OR</span>
      </div>
      <div className="oauth-links">
        <button
          type="button"
          onClick={() => openOAuthPopup("google")}
          className="oauth-button"
        >
          <img
            src="/google-logo.svg"
            alt="Google logo"
            aria-hidden="true"
          />
          Google
        </button>
        <button
          type="button"
          onClick={() => openOAuthPopup("github")}
          className="oauth-button"
        >
          <img
            src="/github-logo.svg"
            alt="Github logo"
            aria-hidden="true"
          />
          GitHub
        </button>
      </div>
      {message && (
        <p
          className="form-success"
          role="status"
        >
          {message}
        </p>
      )}
    </>
  )
}

export default SocialLogin
