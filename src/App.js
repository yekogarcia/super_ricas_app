import { Provider } from "react-redux";
import { Routers } from "./components/router/Routers";
import { store } from "./store/store";
import "antd/dist/antd.css";

function App() {
  return (
    <Provider store={store}>
      <Routers />
    </Provider>
  );
}

export default App;
