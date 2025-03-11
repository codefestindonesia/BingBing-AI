// import useUser from "@hooks/useUser";
import { useAgentManager, useAuth } from "@ic-reactor/react";

const Test: React.FC = () => {
    const agentManager = useAgentManager()
    const { identity } = useAuth()
    // const { createUser } = useUser().createUser("name", "email", "phoneNumber", BigInt(123456789), "address");

    async function handleLogin() {
        await agentManager.login()
    }

    async function handleLogout() {
        await agentManager.logout()
    }

    async function handleCreateUser() {
        const principal = identity?.getPrincipal().toText();
        console.log(principal);
        
        // const result = await createUser();
        // console.log(result);
        
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-evenly">
            <input className="bg-gray-300" type="text" placeholder="test" />
            <button className="bg-gray-400 p-5" onClick={handleLogin} >login</button>
            <button className="bg-gray-400 p-5" onClick={handleLogout} >logout</button>
            <button className="bg-gray-400 p-5" onClick={handleCreateUser} >create</button>
        </div>
    )
};

export default Test;