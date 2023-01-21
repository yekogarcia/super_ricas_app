import { Route, Routes } from "react-router-dom"
import { Login } from "./Login"
import { RecoveryPass } from "./RecoveryPass"
import "./Login.scss";

export const Public = () => {
    return <>
        <div className="fondo">
            <div className="content">
                <header>
                    <h1>Control de inventarios</h1>
                </header>
                <main>
                    <section>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/recovery" element={<RecoveryPass />} />
                        </Routes>
                    </section>
                </main>
                <footer></footer>
            </div>
        </div>
    </>
}
