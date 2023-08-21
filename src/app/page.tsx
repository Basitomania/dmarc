// const Home = () => {
//   return (
//     <main className="flex min-h-screen flex-col items-center p-24">
//       <div className="z-10 max-w-5xl w-full pb-10 items-center justify-center font-mono text-sm lg:flex">
//         <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//           {`Set up > Connet Mailbox`}
//         </p>
//       </div>

//       <div>
//         <form className="grid grid-cols-2 gap-4 text-center mb-8 max-w-5xl w-full lg:text-left">
//           <div className="col-span-1">
//             <p className="text-xl font-semibold mb-2">IMAP Server</p>
//           </div>
//           <div className="col-span-1">
//             <input
//               className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-500"
//               type="text"
//               placeholder="IMAP Server"
//             />
//           </div>

//           <div className="col-span-1">
//             <p className="text-xl font-semibold mb-2">Username</p>
//           </div>
//           <div className="col-span-1">
//             <input
//               className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-500"
//               type="text"
//               placeholder="Username"
//             />
//           </div>

//           <div className="col-span-1">
//             <p className="text-xl font-semibold mb-2">Password</p>
//           </div>
//           <div className="col-span-1">
//             <input
//               className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-500"
//               type="password"
//               placeholder="Password"
//             />
//           </div>

//           <div className="col-span-1">
//             <p className="text-xl font-semibold mb-2">Connection Security</p>
//           </div>
//           <div className="col-span-1">
//             <select
//               className="w-full p-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:border-gray-500"
//               name="connectionSecurity"
//             >
//               <option value="ssl">SSL</option>
//               <option value="tls">TLS</option>
//             </select>
//           </div>

//           <div className="col-span-2 text-center">
//             <button
//               className="px-5 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
//               type="button"
//             >
//               Connect
//             </button>
//           </div>
//         </form>
//       </div>

//     </main>
//   );
// };

// export default Home;

"use client";
import { useState } from "react";
import axios from "axios";
import NavigationMenu from "./NavigationMenu";

function Home() {
  const [url, setUrl] = useState("");
  const [dmarcResults, setDmarcResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formattedDmarc, setFormattedDmarc] = useState<string[]>([]);

  const handleCheckDmarc = () => {
    dmarcLookup();
  };

  const isValidUrl = (urlString: string) => {
    var urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!urlPattern.test(urlString);
  };

  const dmarcLookup = () => {
    setLoading(true);
    axios
      .get(
        `https://demarc.azurewebsites.net/dmarc/dnsTxtLookUp?dmarcHostName=${url}`
      )
      .then((response) => {
        console.log(">>", response.data.data.split(";"));
        setLoading(false);
        setFormattedDmarc(response.data.data.split(";"));
        setDmarcResults(response.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
      <NavigationMenu />
        <form className="grid grid-cols-2 gap-4 text-center mb-8 max-w-5xl w-full lg:text-left">
          <div className="col-span-1">
            <p className="text-xl font-semibold mb-2">
              Enter your Email Domain{" "}
              <span className="text-sm">(valid url)</span>
            </p>
            <div className="flex flex-row">
              <input
                className="w-full m-5 text-black p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL"
              />
              <button
                className="w-full m-5 px-5 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                type="button"
                onClick={handleCheckDmarc}
                disabled={!isValidUrl(url)}
              >
                {loading ? "Loading..." : "Check DMARC"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {dmarcResults && <div>
        <p className="mt-4 font-semibold">Current Record:</p>
        <p className="opacity-75 text-red-500">{dmarcResults?.data}</p>
      </div>}
    </main>
  );
}

export default Home;
