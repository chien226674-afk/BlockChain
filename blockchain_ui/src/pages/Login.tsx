import SignupForm from "@/components/SignupForm"

export default function Login() {
  return <div className="flex justify-center ">
    <div className="flex-1">
  <img src="Sign_Up.png"alt="Login" className="w-full max-h-162.5"></img>
    </div>
    <div className="flex-1 text-white ml-10">
      <div className="max-w-92.5 mt-18">
       <h1 className="text-5xl font-semibold">Create Account</h1>
       <h2 className="font-medium ">Welcome! Enter Your Details And Start Creating, Collecting And Selling Nfts.</h2>
        <SignupForm />
      </div>
    </div>
  </div>
}
