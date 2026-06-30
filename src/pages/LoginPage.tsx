import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { ApiError } from '../lib/api';
import { getLoginCaptcha, LoginCaptcha, useAuth } from '../lib/auth';

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userAccount, setUserAccount] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captcha, setCaptcha] = useState<LoginCaptcha | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/learn';

  async function loadCaptcha() {
    try {
      setCaptcha(await getLoginCaptcha());
    } catch {
      setCaptcha(null);
    }
  }

  useEffect(() => {
    document.title = '登录 - OwnAI';
    void loadCaptcha();
  }, []);

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login({
        userAccount,
        userPassword,
        captchaId: captcha?.captchaId,
        captchaCode,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '登录失败');
      setCaptchaCode('');
      void loadCaptcha();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1180px] items-center px-10 py-16 max-[760px]:px-5">
      <section className="grid w-full grid-cols-[1fr_420px] gap-14 max-[900px]:grid-cols-1">
        <div className="flex flex-col justify-center">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.26em] text-[#1677ff]">OwnAI Account</p>
          <h1 className="m-0 max-w-[640px] text-[52px] font-extrabold leading-tight tracking-normal text-[#050816] max-[760px]:text-[38px]">
            登录后继续阅读站内教程
          </h1>
          <p className="mt-6 max-w-[600px] text-lg leading-[1.9] text-[#50617a]">
            文档站复用 de.ownai.icu 的账号体系，登录态通过 JWT 保存到当前浏览器。
          </p>
        </div>
        <form
          className="rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
          onSubmit={handleSubmit}
        >
          <h2 className="m-0 text-[28px] font-extrabold text-[#050816]">账号登录</h2>
          <label className="mt-7 block text-sm font-bold text-[#334155]">
            账号
            <input
              className="mt-2 h-12 w-full rounded-xl border border-[#dbe3ef] px-4 text-base outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-blue-500/10"
              value={userAccount}
              onChange={(event) => setUserAccount(event.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="mt-5 block text-sm font-bold text-[#334155]">
            密码
            <input
              className="mt-2 h-12 w-full rounded-xl border border-[#dbe3ef] px-4 text-base outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-blue-500/10"
              type="password"
              value={userPassword}
              onChange={(event) => setUserPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {captcha ? (
            <div className="mt-5 grid grid-cols-[1fr_130px_40px] items-end gap-2">
              <label className="block text-sm font-bold text-[#334155]">
                验证码
                <input
                  className="mt-2 h-12 w-full rounded-xl border border-[#dbe3ef] px-4 text-base outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-blue-500/10"
                  value={captchaCode}
                  onChange={(event) => setCaptchaCode(event.target.value)}
                  required
                />
              </label>
              <img
                className="h-12 rounded-xl border border-[#dbe3ef] object-cover"
                src={getCaptchaSource(captcha)}
                alt="验证码"
              />
              <button
                className="flex h-12 w-10 items-center justify-center rounded-xl border border-[#dbe3ef] bg-white text-[#64748b]"
                type="button"
                onClick={loadCaptcha}
                aria-label="刷新验证码"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          ) : null}
          {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
          <button
            className="mt-7 h-12 w-full rounded-xl bg-[#1677ff] text-base font-bold text-white transition hover:bg-[#095fd8] disabled:cursor-not-allowed disabled:bg-[#9bbcff]"
            disabled={submitting}
            type="submit"
          >
            {submitting ? '登录中...' : '登录'}
          </button>
          <p className="mb-0 mt-5 text-center text-sm text-[#64748b]">
            还没有账号？
            <Link className="font-bold text-[#1677ff] no-underline" to="/register">
              去注册
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function getCaptchaSource(captcha: LoginCaptcha) {
  if (captcha.imageUrl) {
    return captcha.imageUrl;
  }
  if (!captcha.imageBase64) {
    return '';
  }
  if (captcha.imageBase64.startsWith('data:')) {
    return captcha.imageBase64;
  }
  return `data:image/png;base64,${captcha.imageBase64}`;
}
