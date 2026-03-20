"use client"
import { useAlertStore } from '@/store/global/useAlertStore';
import Image from "next/image"
import { Mail, Lock, EyeOff, Eye, MoveLeft } from "lucide-react"
import Link from "next/link";
import { Roboto, Michroma } from 'next/font/google';
import { oAuth } from "../_actions/oAuth";
import { loginWithEmail } from "../_actions/email_login";
import { signUpNewUser } from "../_actions/email_signup";

import { useState } from "react";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
});

const michroma = Michroma({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-michroma',
});

const oAuthProviders = [
  { Name: "Google", Icon: "/Google_Favicon_2025.svg", providerID: "google" },
]

function page() {
  const [isLogin, setIsLogin] = useState(true);
  const showAlert = useAlertStore((state) => state.showAlert);
const [confirmEmail, setconfirmEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const hasUpperLowerDigit = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+]/.test(password);
  const hasMinLength = password.length >= 8;

  return (
    <div className={`bg-black flex w-full min-h-screen relative ${roboto.className} overflow-hidden`}>
      
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-[60] flex items-center gap-2 text-white/50 hover:text-orange-500 transition-colors duration-300 group bg-black/20 backdrop-blur-sm border border-white/10 px-4 py-2 uppercase tracking-widest text-xs font-bold"
      >
        <MoveLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>

      {confirmEmail &&
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-51 h-full w-full">
          <div className="p-12 border-2 border-white max-w-2xl text-center bg-black">
            <h2 className={`text-4xl font-black mb-6 uppercase tracking-widest ${michroma.className}`}>Confirm Your Email</h2>
            <p className="mb-6 text-white/70 text-lg leading-relaxed">
              We've sent a confirmation link to your email address. Please check your inbox and click the link to verify your account.
            </p>
            <p className="text-base text-white/50 mb-4 uppercase tracking-wider">
              Didn't receive the email? Check your spam folder or Try Again after 1 Hour
            </p>
            <p className="text-sm text-white/40 mb-8 border border-white/20 p-4">
              (As we're currently using a free email service, delivery may be limited—please try again after an hour if you still haven't received it.)
            </p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 border-2 border-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 text-white">
               Got It
            </button>
          </div>
        </div>
      }

      <div className="hidden lg:flex flex-col flex-1 items-center justify-center bg-black border-r-2 border-white/10 p-12 relative overflow-hidden group">
        <div className="z-10 flex flex-col items-start justify-center text-left max-w-2xl w-full">
          <Image src="/nv.svg" alt="Neura Verse" width={80} height={80} className="mb-8" />
          <h1 className={`text-6xl xl:text-8xl font-black mb-6 tracking-tighter uppercase text-white ${michroma.className}`}>
            Neura<br/>Verse
          </h1>
          <p className="text-xl xl:text-2xl text-white/50 font-light tracking-widest uppercase border-l-4 border-orange-500 pl-6 leading-relaxed">
            The Universe<br/>of Neurons<br/><span className="text-white font-bold">Neural Intelligence</span>
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative overflow-y-auto max-h-screen">
        <div className="z-50 bg-black border-2 border-white/20 p-8 md:p-10 w-full max-w-md flex flex-col items-center h-fit">
          <div className="items-center justify-center flex flex-col w-full">
            <h1 className={`text-3xl md:text-4xl font-black mb-2 tracking-widest uppercase text-center ${isLogin ? '' : 'leading-tight'} ${michroma.className}`}>
              {isLogin ? "Welcome Back" : <>Enter the<br/>Universe</>}
            </h1>
            {isLogin && <h1 className="text-sm md:text-base mb-6 tracking-widest uppercase text-center text-white/50">Login to Gain Full Experience</h1>}
            <h2 className={`text-orange-500 font-bold border border-orange-500/30 px-4 py-1 text-xs tracking-widest uppercase ${isLogin ? 'mb-8' : 'mb-6 mt-4'} text-center bg-orange-500/10`}>
              {isLogin ? "It'll only take mere seconds" : "Get full experience in mere seconds."}
            </h2>
            
            <div className={`flex flex-col gap-4 w-full items-center justify-center ${isLogin ? 'mb-6' : ''}`}>
              <div className="w-full flex items-center gap-4">
                <div className="h-px bg-white/20 flex-grow"></div>
                {isLogin ? (
                  <div className="text-white/50 text-sm font-bold uppercase tracking-widest">OAuth</div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-white/50 text-sm font-bold uppercase tracking-widest">OAuth</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1 hidden">Faster</span>
                  </div>
                )}
                <div className="h-px bg-white/20 flex-grow"></div>
              </div>
              
              <div className="flex flex-row flex-wrap gap-4 items-center justify-center w-full">
                {oAuthProviders.map((item) => (
                  <button
                    key={item.Name}
                    type="button"
                    className="w-full px-4 py-3 border-2 border-white/50 flex flex-row items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-colors duration-300 group bg-black"
                    onClick={() => oAuth(item.providerID)}
                  >
                    <Image
                      src={item.Icon}
                      width={20}
                      height={20}
                      alt={item.Name}
                      className="mr-3"
                    />
                    <div className="text-white group-hover:text-black font-bold uppercase tracking-widest text-sm"> {item.Name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={`flex items-center text-center w-full ${isLogin ? 'mb-6' : 'my-6'} `}>
              <div className="flex-grow h-px bg-white/20"></div>
              <span className="mx-4 font-bold text-white/50 text-xs tracking-widest">OR</span>
              <div className="flex-grow h-px bg-white/20"></div>
            </div>

            <form
              className="w-full"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append('email', e.target.elements.email.value);
                formData.append('password', e.target.elements.password.value);
                
                if (isLogin) {
                  const { error } = await loginWithEmail(formData);
                  if (error) {
                    if (error == "AuthApiError: Invalid login credentials") {
                      showAlert('Invalid email or password.');
                    } else {
                      showAlert('Login failed. Please try again.');
                    }
                  } else {
                    window.location.href = "/";
                  }
                } else {
                  const { error } = await signUpNewUser(formData);
                  if (error) {
                    showAlert('Sign up failed. Please try again.');
                  } else {
                    setconfirmEmail(true);
                  }
                }
              }}
            >
              <div className="flex flex-col gap-4 w-full items-center justify-center">
                <div className="w-full border-2 border-white/50 flex flex-row items-center focus-within:border-white transition-colors duration-300 bg-black">
                  <div className="p-3 border-r-2 border-white/20">
                    <Mail size={20} className="text-white" />
                  </div>
                  <input name="email" type="email" placeholder="EMAIL" className="bg-transparent text-white w-full px-4 py-3 text-base outline-none uppercase tracking-widest placeholder:text-white/30" required />
                </div>
                
                <div className="w-full border-2 border-white/50 flex flex-row items-center focus-within:border-white transition-colors duration-300 bg-black relative">
                  <div className="p-3 border-r-2 border-white/20">
                    <Lock size={20} className="text-white" />
                  </div>
                  <input
                    name="password"
                    type={!isLogin && showPassword ? "text" : "password"}
                    placeholder="PASSWORD"
                    className="bg-transparent text-white w-full px-4 py-3 text-base outline-none tracking-widest placeholder:text-white/30 pr-12"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  {!isLogin && (
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      onClick={() => setShowPassword(s => !s)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  )}
                </div>

                {!isLogin && (
                  <div className="mt-2 text-white/80 text-xs tracking-wider uppercase w-full bg-white/5 p-4 border border-white/10">
                    <span className="font-bold block mb-2 text-white/70">Password Requirements:</span>
                    <ul className="space-y-2">
                        <li className={`flex items-center gap-2 ${hasUpperLowerDigit ? "text-orange-500 font-bold" : "text-white/40"}`}>
                            <span className={hasUpperLowerDigit ? "text-orange-500" : "text-white/40"}>{hasUpperLowerDigit ? "✓" : "○"}</span> Upper/lower & digits
                        </li>
                        <li className={`flex items-center gap-2 ${hasSpecialChar ? "text-orange-500 font-bold" : "text-white/40"}`}>
                            <span className={hasSpecialChar ? "text-orange-500" : "text-white/40"}>{hasSpecialChar ? "✓" : "○"}</span> Special char (!@#$%*&()_+)
                        </li>
                        <li className={`flex items-center gap-2 ${hasMinLength ? "text-orange-500 font-bold" : "text-white/40"}`}>
                            <span className={hasMinLength ? "text-orange-500" : "text-white/40"}>{hasMinLength ? "✓" : "○"}</span> Min 8 characters
                        </li>
                    </ul>
                  </div>
                )}
                
                <button type="submit" className="w-full py-4 mt-2 border-2 border-white bg-white text-black font-black text-lg tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300">
                  {isLogin ? "Login" : "Sign Up"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-white/50 text-xs tracking-widest uppercase">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button" 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-white font-bold hover:underline ml-2 uppercase"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page
