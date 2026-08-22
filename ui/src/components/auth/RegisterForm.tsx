import { useState } from "react"
import type { SyntheticEvent } from "react"

const RegisterForm = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Complete all fields to create your account.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      })

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(
          result?.error ?? "Unable to create your account right now.",
        )
      }

      setSuccess("Your account was created and you are signed in.")
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to connect to the server right now.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
    >
      <label htmlFor="register-username">USERNAME</label>
      <input
        id="register-username"
        name="username"
        type="text"
        autoComplete="username"
        placeholder="Choose a username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <label htmlFor="register-email">EMAIL ADDRESS</label>
      <input
        id="register-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="yourname@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="register-password">PASSWORD</label>
      <div className="password-field">
        <input
          id="register-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          className="visibility-button"
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <label htmlFor="confirm-password">CONFIRM PASSWORD</label>
      <div className="password-field">
        <input
          id="confirm-password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        <button
          className="visibility-button"
          type="button"
          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? "Hide" : "Show"}
        </button>
      </div>

      {error && (
        <p
          className="form-error"
          role="alert"
        >
          {error}
        </p>
      )}
      {success && (
        <p
          className="form-success"
          role="status"
        >
          {success}
        </p>
      )}
      <button
        className="submit-button"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  )
}

export default RegisterForm
