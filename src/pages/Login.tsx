import { useAuth } from "../context/AuthContext";


const Login = () => {
  const { login, loading } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
        <button
          disabled={loading}
          onClick={login}
          className="px-4 py-2 w-[250px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
         {!loading ? "Login with Random User" : "Loading..."} 
        </button>
      </div>
    </div>
  );
};


export default Login