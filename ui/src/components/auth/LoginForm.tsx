import { useState } from "react"
import type { SyntheticEvent } from "react"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!username.trim() || !password) {
      setError("Enter your username and password to continue.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username.trim(), password }),
      })

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(result?.error ?? "Unable to sign in right now.")
      }

      setSuccess("You are signed in.")
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
      <label htmlFor="username">USERNAME OR EMAIL</label>
      <input
        id="username"
        name="username"
        type="text"
        autoComplete="username"
        placeholder="yourname@example.com"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <div className="password-label-row">
        <label htmlFor="password">PASSWORD</label>
        <a href="#forgot-password">Forgot password?</a>
      </div>
      <div className="password-field">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
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
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}

export default LoginForm
