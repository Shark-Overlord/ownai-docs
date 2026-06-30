import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../lib/api';
import { useAuth } from '../lib/auth';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [userAccount, setUserAccount] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = '注册 - OwnAI';
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register({ userAccount, userPassword, checkPassword });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '注册失败');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[760px] items-center px-10 py-16 max-[760px]:px-5">
      <form
        className="w-full rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
        onSubmit={handleSubmit}
      >
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.26em] text-[#1677ff]">OwnAI Account</p>
        <h1 className="m-0 text-[34px] font-extrabold text-[#050816]">创建账号</h1>
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
            autoComplete="new-password"
            required
          />
        </label>
        <label className="mt-5 block text-sm font-bold text-[#334155]">
          确认密码
          <input
            className="mt-2 h-12 w-full rounded-xl border border-[#dbe3ef] px-4 text-base outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-blue-500/10"
            type="password"
            value={checkPassword}
            onChange={(event) => setCheckPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
        {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
        <button
          className="mt-7 h-12 w-full rounded-xl bg-[#1677ff] text-base font-bold text-white transition hover:bg-[#095fd8] disabled:cursor-not-allowed disabled:bg-[#9bbcff]"
          disabled={submitting}
          type="submit"
        >
          {submitting ? '注册中...' : '注册'}
        </button>
        <p className="mb-0 mt-5 text-center text-sm text-[#64748b]">
          已有账号？
          <Link className="font-bold text-[#1677ff] no-underline" to="/login">
            去登录
          </Link>
        </p>
      </form>
    </main>
  );
}
