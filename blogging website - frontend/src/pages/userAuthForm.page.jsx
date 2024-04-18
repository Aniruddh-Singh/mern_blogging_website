import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png"
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { useContext } from "react";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {

    // let { userAuth: { accessToken }, setUserAuth } = useContext(UserContext);
    let { userAuth: { accessToken } = { accessToken: null }, setUserAuth } = useContext(UserContext);

    const userAuthThroughServer = (serverRoute, formData) => {
        axios.post(serverRoute, formData)
            .then((response) => {
                storeInSession("user", JSON.stringify(response.data));
                setUserAuth(response.data);
            })
            .catch((err) => {
                toast.error(err.response.data.error);
            })
    }

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const handleAuthButton = (e) => {
        e.preventDefault();

        let route = type === "sign-up" ? "/signup" : "/signin";

        let serverRoute = import.meta.env.VITE_SERVER_ROUTE + route;

        const form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        const { fullname, email, password } = formData;

        if (fullname || "" || null) {
            if (fullname.length < 3) {
                return toast.error("FullName should be at least 3 letter long.")
            }
        }
        if (!email) {
            return toast.error("enter an email.")
        }
        if (!emailRegex.test(email)) {
            return toast.error("email is not valid.")
        }
        if (!passwordRegex.test(password)) {
            return toast.error("password should be between 6 to 20 letters atleast 1 numeric, 1 lowerCase and 1 upperCase letter.")
        }

        userAuthThroughServer(serverRoute, formData);
    }

    const handleGoogleAuth = (e) => {
        e.preventDefault();
        authWithGoogle().then(user => {

            let serverRoute = import.meta.env.VITE_SERVER_ROUTE + "/google-auth";

            let formData = {
                accessToken: user.accessToken
            }

            userAuthThroughServer(serverRoute, formData);

        }).catch((err) => {
            toast.error('trouble login through google');
            console.log(err)
        })
    }

    return (
        accessToken ? <Navigate to="/" /> :
            <AnimationWrapper keyValue={type}>
                <section className="h-cover flex items-center justify-center">
                    <Toaster />
                    <form className="w-[80%] max-w-[400px]" id="formElement">

                        <h1 className="text-4xl font-gelasio capitalize text-center">
                            {type == "sign-in" ? "sign in" : "sign up"}
                        </h1>

                        {
                            type != "sign-in" ?
                                <InputBox
                                    name={"fullname"}
                                    type={"text"}
                                    placeholder={"Full Name"}
                                    icon={"fi-rr-user"}
                                /> :
                                ""
                        }

                        <InputBox
                            name={"email"}
                            type={"email"}
                            placeholder={"email"}
                            icon={"fi-rr-envelope"}
                        />

                        <InputBox
                            name={"password"}
                            type={"password"}
                            placeholder={"password"}
                            icon={"fi-rr-key"}
                        />

                        <button className="btn-dark center mt-16" onClick={handleAuthButton}>
                            {type.replace("-", " ")}
                        </button>

                        <div className="flex items-center gap-2 my-10 opacity-40 uppercase text-black font-bold">
                            <hr className="w-1/2 border-black" />
                            <p>or</p>
                            <hr className="w-1/2 border-black" />
                        </div>

                        <button className="btn-dark flex gap-4 items-center center justify-center w-[90%] " onClick={handleGoogleAuth}>
                            <img className="w-5" src={googleIcon} />
                            Continue With Google
                        </button>

                        {
                            type == "sign-in" ?
                                <p className="mt-6 text-dark-grey text-xl text-center">
                                    Don't have an acoount ?
                                    <Link className="underline text-xl ml-1" to="/signup" >Sign up here</Link>
                                </p> :
                                <p className="mt-6 text-dark-grey text-xl text-center">
                                    Already a member ?
                                    <Link className="underline text-xl ml-1" to="/signin" >Sign in here</Link>
                                </p>
                        }

                    </form>
                </section>
            </AnimationWrapper>
    )
}

export default UserAuthForm;