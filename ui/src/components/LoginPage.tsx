import LoginForm from "./auth/LoginForm"
import SocialLogin from "./auth/SocialLogin"

const LoginPage = () => {
  return (
    <main className="login-main">
      <section
        className="login-panel"
        aria-labelledby="login-title"
      >
        <h1 id="login-title">Welcome back</h1>
        <p className="intro">Please enter your details to sign in.</p>
        <LoginForm />
        <SocialLogin />
        <p className="signup-prompt">
          Don't have an account? <a href="#register">Register</a>
        </p>
      </section>
    </main>
  )
}

export default LoginPage
