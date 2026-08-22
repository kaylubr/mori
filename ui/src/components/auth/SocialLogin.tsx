const SocialLogin = () => {
  return (
    <>
      <div className="divider">
        <span>OR</span>
      </div>
      <div className="oauth-links">
        <a
          href="/auth/google"
          className="oauth-button"
        >
          <img
            src="/google-logo.svg"
            alt="Google logo"
            aria-hidden="true"
          />
          Google
        </a>
        <a
          href="/auth/github"
          className="oauth-button"
        >
          <img
            src="/github-logo.svg"
            alt="Github logo"
            aria-hidden="true"
          />
          GitHub
        </a>
      </div>
    </>
  )
}

export default SocialLogin
