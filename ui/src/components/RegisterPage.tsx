import { Link } from "react-router-dom"

import RegisterForm from "./auth/RegisterForm"
import SocialLogin from "./auth/SocialLogin"

const RegisterPage = () => {
  return (
    <main className="login-main">
      <section
        className="auth-panel register-panel"
        aria-labelledby="register-title"
      >
        <h1 id="register-title">Create your account</h1>
        <RegisterForm />
        <SocialLogin />
        <p className="signup-prompt">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage
