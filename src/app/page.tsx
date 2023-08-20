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

function Home() {
  const [url, setUrl] = useState("");
  const [dmarcResults, setDmarcResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formattedDmarc, setFormattedDmarc] = useState<string[]>([]);

  const handleCheckDmarc = () => {
    // Simulated DMARC check logic, replace with actual logic
    const simulatedResults = [
      { condition: "SPF Record", result: "Pass" },
      { condition: "DKIM Alignment", result: "Pass" },
      { condition: "SPF Alignment", result: "Fail" },
      // Add more conditions and results as needed
    ];

    setDmarcResults(simulatedResults);
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
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  };

  const dmarcLookup = () => {
    // demarc.azurewebsites.net/dmarc/report?startDate=2023-07-01&endDate=2023-08-16
    // fetch(
    //   `https://demarc.azurewebsites.net/dmarc/dnsTxtLookUp?dmarcHostName=${url}`,
    //   { headers: { "Content-Type": "application/json" } }
    // )
    //   // fetch(`https://demarc.azurewebsites.net/dmarc/report?startDate=2023-07-01&endDate=2023-08-16`, { mode: 'no-cors' })
    //   .then((response) => {
    //     response.json()
    //   })
    //   .then((data) => {
    //     console.log("S", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching API data:", error);
    //   });
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let index: number;
    let newArray = [...formattedDmarc];

    if (name == "connectionSecurity") {
      index = 1;
      newArray[index] = `p=${value}`;
    }

    if (name === "aggEmail") {
      index = 2;
      newArray[index] = `rua=mailto:${value}`;
    }

    if (name == "forensicEmail") {
      index = 3;
      newArray[index] = `ruf=mailto:${value}`;
    }

    if (name == "percentage") {
      index = 5;
      newArray[index] = `pct=${value}`;
    }

    setFormattedDmarc(newArray);
    console.log(">>>", value, name);
  };

  const [a, ...rest] = formattedDmarc;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <form className="grid grid-cols-2 gap-4 text-center mb-8 max-w-5xl w-full lg:text-left">
          <div className="col-span-1">
            <p className="text-xl font-semibold mb-2">
              Enter URL <span className="text-sm">(valid url)</span>
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

      <div className="grid grid-cols-2 gap-4 text-center mb-8 max-w-5xl w-full lg:text-left">
        {dmarcResults && (
          <>
            <div className="col-span-1">
              <div className="col-span-1">
                {/* Left column: DMARC setup instructions */}
                <div>
                  <p className="text-xl font-semibold mb-2">
                    HOW TO CREATE A DMARC RECORD
                  </p>
                  <p>
                    Answer the questions below and we’ll generate a record for
                    you in the correct format. For more details about each
                    question or option list, click on the Help link beside it
                    for more detailed information.
                  </p>
                  <ol className="list-decimal list-inside mt-4">
                    <li>
                      <p className="font-semibold pb-2">
                        How do you want mail that fails DMARC to be treated by
                        the recipient?
                      </p>
                      <p className="font-light text-xs pb-2">
                        We recommend that you start with a policy of none -
                        which is Reporting Mode.
                      </p>
                      <p>
                        <select
                          className="w-full p-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:border-gray-500"
                          name="connectionSecurity"
                          onChange={handleChange}
                        >
                          <option value="">--</option>
                          <option value="none">None</option>
                          <option value="quarantine">Quarantine</option>
                          <option value="reject">Reject</option>
                        </select>
                      </p>
                      {/* <p className="text-sm opacity-50">
                        <a href="/help/quarantine" target="_blank" rel="noopener noreferrer">Help</a>
                      </p> 
                  */}
                    </li>
                    <li className="mt-4">
                      <p className="font-semibold pb-2">
                        What email address(s) should aggregate DMARC reports be
                        sent to?
                      </p>
                      <p className="font-light text-xs pb-2">
                        *If adding multiple email addresses, please use a comma
                        to separate each one.
                      </p>
                      <input
                        className="w-full text-black p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                        type="text"
                        placeholder="Enter email addresses"
                        name="aggEmail"
                        onChange={handleChange}
                      />
                      {/* <p className="text-sm opacity-50">
                    <a
                      href="/help/aggregated-reports"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Help
                    </a>
                  </p> */}
                    </li>
                    <li className="mt-4">
                      <p className="font-semibold pb-2">
                        What email address(s) would you like to receive forensic
                        DMARC failure reports?
                      </p>
                      <p className="font-light text-xs pb-2">
                        *If adding multiple email addresses, please use a comma
                        to separate each one.
                      </p>
                      <input
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                        type="text"
                        placeholder="Enter email addresses"
                        name="forensicEmail"
                        onChange={handleChange}
                      />
                      <p className="text-sm opacity-50">
                        <a
                          href="/help/forensic-reports"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Help
                        </a>
                      </p>
                    </li>
                    <li className="mt-4">
                      <p className="font-semibold pb-2">
                        Would you like to have MxToolbox automatically process
                        your DMARC reports for analysis and delivery insights?
                      </p>
                      <p>
                        <select
                          className="w-full p-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:border-gray-500"
                          name="connectionSecurity"
                        >
                          <option value="ssl">Yes</option>
                          <option value="ssl">No</option>
                        </select>
                      </p>
                      {/* <p className="text-sm opacity-50">
                    <a
                      href="/help/automatic-processing"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Help
                    </a>
                  </p> */}
                    </li>
                    <li className="mt-4">
                      <p className="font-semibold">
                        What percentage of email do you want to apply this to?
                      </p>
                      <input
                        className="w-full text-black p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                        type="text"
                        placeholder="Enter percentage"
                        name="percentage"
                        onChange={handleChange}
                      />
                      {/* <p className="text-sm opacity-50">
                    <a
                      href="/help/percentage"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Help
                    </a>
                  </p> */}
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              {/* Right column: Display DMARC results */}
              <div className="col-span-1">
                <div>
                  <p className="text-xl font-semibold mb-2">
                    Created Record Output:
                  </p>
                  <p>
                    The below record is updated as you modify the fields on the
                    left.
                  </p>

                  <div className="bg-emerald-100 p-5 rounded">
                    <p className="mt-4 font-semibold text-black">
                      Once you have finished creating your record in this
                      editor, visit your DNS hosting provider and create a new
                      record with the values presented below.
                    </p>

                    <p className="mt-4 text-red-500">
                      <span className="font-semibold text-black">Type:</span>
                      <span>TXT</span>
                      <br />
                      <span className="font-semibold text-black">
                        Host/Name:
                      </span>
                      {`_DMARC.${url}`}
                      <br />
                      <span className="font-semibold text-black">Value:</span>
                      {/* v=DMARC1; p=reject;
                      rua=mailto:mailauth-reports@google.com,mailto:5dab9692@mxtoolbox.dmarc-report.com;
                      ruf=mailto:5dab9692@forensics.dmarc-report.com */}
                      {`${a} ${rest}`}
                      <br />
                    </p>
                    <p className="opacity-75 text-black mt-5">
                      * Note: For many DNS hosting providers, youll just type
                      _DMARC as the host/name and the tool will automatically
                      add/append your domain name.
                    </p>
                  </div>

                  <p className="mt-4 font-semibold">Current Record:</p>
                  <p className="opacity-75 text-red-500">
                    {dmarcResults?.data}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </main>
  );
}

export default Home;

