import { message, Spin } from "antd";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import send from "../../assets/send.png";
import img_password from "../../assets/password.png";
import { useDispatch } from "react-redux";

import "./Login.scss";
import { sendEmailRecovery, sendNewPassRecovery } from "../../controllers/auth";
import { useNavigate } from "react-router-dom";


export const RecoveryPass = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const { match: { params } } = props;
    // console.log(params.id)
    const [loading, setLoading] = useState(false);

    const [formValues, handleInputChange] = useForm({
        email: "",
        password: "",
        newpassword: ""
    });

    const { email, password, newpassword } = formValues;

    function getVariableGetByName() {
        var variables = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            variables[key] = value;
        });
        return variables;
    }

    const res = getVariableGetByName();
    console.log(res);

    const handleEmailRecovery = (e) => {
        e.preventDefault();
        setLoading(true);
        dispatch(sendEmailRecovery({ email })).then(res => {
            console.log(res);
            setLoading(false);
        });
    }

    const handleRecovery = (e) => {
        e.preventDefault();
        if (formValues.password !== formValues.newpassword) {
            message.warning("Las contraseñas no coinciden, verifica por favor!")
            return;
        }
        const t = getVariableGetByName();
        t.newpassword = newpassword;
        console.log(t);
        setLoading(true);
        dispatch(sendNewPassRecovery(t)).then(res => {
            setLoading(false);
            if (res) {
                navigate("/");
            }
        });


    }


    return (
        <>
            {typeof res.token === 'undefined' ?
                <>
                    <form onSubmit={handleEmailRecovery} >
                        <Spin spinning={loading}>
                            <h1>Recuperar contraseña</h1>
                            <label htmlFor="email">
                                {/* <span>Usuario</span> */}
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Correo electronico"
                                    value={email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <input type="submit" value="Confirmar correo" />
                        </Spin>
                    </form>
                    <article className="recovery-pass">
                        <p>
                            Se enviará al correo link para la recuperación de su contraseña!
                        </p>
                        <figure>
                            <img src={send} alt="Send icons created by smalllikeart - Flaticon" />
                        </figure>
                    </article>
                </>
                :
                <>
                    <form onSubmit={handleRecovery}>
                        <Spin spinning={loading}>
                            <h1>Nueva contraseña</h1>
                            <label htmlFor="email">
                                {/* <span>Usuario</span> */}
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="password"
                                    id="newpassword"
                                    name="newpassword"
                                    placeholder="confirmar password"
                                    value={newpassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <input type="submit" value="Confirmar" />
                        </Spin>
                    </form>
                    <article className="confirm">
                        {/* <p>
                            Se enviará al correo link para la recuperación de su contraseña!
                        </p> */}
                        <figure>
                            <img src={img_password} alt="Send icons created by smalllikeart - Flaticon" />
                        </figure>
                    </article>
                </>
            }
        </>
    );
}
