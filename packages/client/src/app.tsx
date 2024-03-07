import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import Routes from "./routes";

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        <Routes />
      </AnimatePresence>
    </LazyMotion>
  );
}

export default App;
