import PointChart from "../components/Graph";
import LogHistory from "../components/Log";
import { useAuthContext } from "../Context/AuthContext";

const Home = () => {
    const {user}=useAuthContext();
    return (
        <div className="flex flex-col gap-5">
            <span className="mt-5 text-xl">Your Thrash ID : {user?.ThrashID}</span>
           <div className="m-1"> <PointChart/></div>
           <LogHistory/>
        </div>
    )
}

export default Home