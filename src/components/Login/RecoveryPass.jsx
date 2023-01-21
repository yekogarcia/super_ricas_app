import { Spin } from "antd";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import send from "../../assets/send.png";
import password from "../../assets/password.png";

import "./Login.scss";


export const RecoveryPass = () => {

    // const { match: { params } } = props;
    // console.log(params.id)
    const [loading, setLoading] = useState(false);

    const [formValues, handleInputChange] = useForm({
        email: "",
    });

    const { email } = formValues;

    function getVariableGetByName() {
        var variables = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            variables[key] = value;
        });
        return variables;
    }

    const res = getVariableGetByName();
    console.log(res);

    const handleRecovery = () => {

    }
    return (
        <>
            {typeof res.token === 'undefined' ?
                <>

                    <form onSubmit={handleRecovery}>
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
                                    value={email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="confirm_password"
                                    id="confirm_password"
                                    name="confirm_password"
                                    placeholder="confirmar password"
                                    value={email}
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
                            <img src={password} alt="Send icons created by smalllikeart - Flaticon" />
                        </figure>
                    </article>
                </>
            }
        </>
    );
}
