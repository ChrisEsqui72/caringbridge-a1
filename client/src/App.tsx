import { useEffect, useState } from "react";

function App() {
    const [status, setStatus] =
        useState("Checking server...");

    useEffect(() => {
        fetch("http://localhost:3001/api/health")
            .then((response) => response.json())
            .then((data) => {
                setStatus(data.status);
            })
            .catch(() => {
                setStatus("Server unavailable");
            });
    }, []);

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold">
                    CaringBridge AI Reference
                </h1>

                <p className="mt-4">
                    API status: {status}
                </p>
            </div>
        </main>
    );
}

export default App;