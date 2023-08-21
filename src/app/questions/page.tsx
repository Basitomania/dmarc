"use client";
import React, { useState } from "react";
import NavigationMenu from "../NavigationMenu";

const Questions = () => {
  const [formattedDmarc, setFormattedDmarc] = useState<string[]>([]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let index: number;
    let newArray = [...formattedDmarc];

    if (name == "connectionSecurity") {
      index = 0;
      newArray[index] = `p=${value}`;
    }

    if (name === "aggEmail") {
      index = 3;
      newArray[index] = `rua=mailto:${value}`;
    }

    if (name == "forensicEmail") {
      index = 4;
      newArray[index] = `ruf=mailto:${value}`;
    }

    if (name == "percentage") {
      index = 5;
      newArray[index] = `pct=${value}`;
    }

    if (name === "subDomain") {
      index = 1;
      newArray[index] = `subdomain:${value}`;
    }

    if (name === "subEmail") {
      index = 2;
      newArray[index] = `subdomain email:${value}`;
    }

    setFormattedDmarc(newArray);
    console.log(">>>", value, name);
  };

  const [a, ...rest] = formattedDmarc;

  console.log('>>', formattedDmarc)
    console.log('>>', !formattedDmarc)


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <NavigationMenu />
      <div className="grid grid-cols-2 gap-4 text-center mb-8 max-w-5xl w-full lg:text-left mt-[5%]">
        <>
          <div className="col-span-1">
            <div className="col-span-1">
              {/* Left column: DMARC setup instructions */}
              <div>
                <p className="text-xl font-semibold mb-2">
                  HOW TO CREATE A DMARC RECORD
                </p>
                <p>
                  Answer the questions below and we’ll generate a record for you
                  in the correct format. For more details about each question or
                  option list, click on the Help link beside it for more
                  detailed information.
                </p>
                <ol className="list-decimal list-inside mt-4">
                  <li>
                    <p className="font-semibold pb-2">
                      How would you want your domain emails that fail
                      authenication to be treated?
                    </p>
                    <p>
                      <select
                        className="w-full p-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:border-gray-500"
                        name="connectionSecurity"
                        onChange={handleChange}
                      >
                        {/* <option value="">--</option> */}
                        <option value="none">None</option>
                        <option value="quarantine">Quarantine</option>
                        <option value="reject">Reject</option>
                      </select>
                    </p>
                  </li>

                  <li className="mt-4">
                    <p className="font-semibold pb-2">
                      Do you want this Policy to cover your subdomain
                    </p>
                    <p>
                      <select
                        className="w-full p-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:border-gray-500"
                        name="subDomain"
                        onChange={handleChange}

                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </p>
                  </li>

                  <li>
                    <p className="font-semibold pb-2">
                      How would you want your sub domain email to be treated?
                    </p>
                    <p>
                      <select
                        className="w-full p-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:border-gray-500"
                        name="subEmail"
                        onChange={handleChange}
                      >
                        <option value="">--</option>
                        <option value="none">None</option>
                        <option value="quarantine">Quarantine</option>
                        <option value="reject">Reject</option>
                      </select>
                    </p>
                  </li>

                  <li className="mt-4">
                    <p className="font-semibold pb-2">
                      Which email address would you have aggregate report (RUA)
                      sent to?
                    </p>
                    <input
                      className="w-full text-black p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                      type="text"
                      placeholder="Enter email addresses"
                      name="aggEmail"
                      onChange={handleChange}
                    />
                  </li>
                  <li className="mt-4">
                    <p className="font-semibold pb-2">
                      Which email address would you have forensic (RUF) reports
                      sent to?
                    </p>
                    <input
                      className="w-full text-black p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                      type="text"
                      placeholder="Enter email addresses"
                      name="forensicEmail"
                      onChange={handleChange}
                    />
                  </li>

                  <li className="mt-4">
                    <p className="font-semibold">
                      How frequently do you want to receive reports
                    </p>
                    <input
                      className="w-full text-black p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                      type="text"
                      placeholder="Enter percentage"
                      name="percentage"
                      onChange={handleChange}
                    />
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
                    Once you have finished creating your record in this editor,
                    visit your DNS hosting provider and create a new record with
                    the values presented below.
                  </p>

                  <p className="mt-4 text-red-500">
                    <span className="font-semibold text-black">Type:</span>
                    <span>TXT</span>
                    <br />
                    <br />
                    <span className="font-semibold text-black">Value:</span>
                    {formattedDmarc.length != 0 ? `${a} ${rest}` : ''}
                    <br />
                  </p>
                  {/* <p className="opacity-75 text-black mt-5">
                    * Note: For many DNS hosting providers, youll just type
                    _DMARC as the host/name and the tool will automatically
                    add/append your domain name.
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </main>
  );
};

export default Questions;
