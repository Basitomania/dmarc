"use client";
import { useState } from "react";
import axios from "axios";
import NavigationMenu from "../NavigationMenu";

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

