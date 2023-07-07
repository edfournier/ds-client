import cayde from "../images/cayde.png";

const AUTH_URL = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code`;

const Login = () => {
    const handleLogin = () => window.location.href = AUTH_URL;

    return (
        <div className="login-container tile">
            <h1>Destiny Scout</h1>
            <img className="cayde" src={cayde} alt="startled Cayde-6" />
            <input className="login-button grow" type="button" onClick={handleLogin} value="Log in with Bungie.net" />
        </div>
    );
}

export default Login;