import axios from "axios";
import React, { useState } from "react";
import { apiEndpoints, newEndpoints } from "./apiEndpoints";

const AstrologyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
  });

  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const userId = 612511;
  const apiKey = "a3a014ee35f19c7c8ddf42bd1b7972bb";
  const baseUrl = "https://json.astrologyapi.com/v1/";
  const language = "en";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [year, month, day] = formData.birthDate.split("-");
    const [hour, min] = formData.birthTime.split(":");
    let newFinalData = {};

    const data = {
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
      hour: parseInt(hour),
      min: parseInt(min),
      lat: 19.132,
      lon: 72.342,
      tzone: 5.5,
      varshaphal_year: 2024,
      dasha_date: "8-02-2024",
      place: "mumbai",
      maxRows: 6,
      country_code: "Asia/Kolkata",
      isDst: true,
      latitude: 19.23232,
      longitude: 72.23234,
      date: "01-06-2000",
      m_day: 6,
      m_month: 1,
      m_year: 2000,
      m_hour: 7,
      m_min: 45,
      m_lat: 19.132,
      m_lon: 72.342,
      m_tzone: 5.5,
      f_day: 6,
      f_month: 1,
      f_year: 2000,
      f_hour: 7,
      f_min: 45,
      f_lat: 19.132,
      f_lon: 72.342,
      f_tzone: 5.5,
      you_date: 10,
      you_month: 5,
      you_year: 1990,
      you_gender: "male",
      match_date: 3,
      match_month: 5,
      match_year: 1992,
      match_gender: "female",
      match_name: formData.name,
    };

    const requestOptions = {
      headers: {
        Authorization: `Basic ${btoa(`${userId}:${apiKey}`)}`,
        "Content-Type": "application/json",
        "Accept-Language": language,
      },
    };

    await Promise.all(
      newEndpoints.map(async (endpoint) => {
        try {
          const response = await axios.post(
            `${baseUrl}${endpoint}`,
            data,
            requestOptions
          );
          newFinalData[endpoint] = response.data;
        } catch (error) {
          setError(error.message);
        }
      })
    );

    setResponseData(newFinalData);
  };

  const renderTable = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                {Object.keys(data[0] || {}).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="bg-white">
                  {Object.values(item).map((value, subIndex) => (
                    <td
                      key={subIndex}
                      className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700"
                    >
                      {typeof value === "object" ? renderTable(value) : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (typeof data === "object" && data !== null) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <tbody>
              {Object.entries(data).map(([key, value]) => (
                <tr key={key} className="bg-white">
                  <td className="px-4 py-2 border-b border-gray-200 text-sm font-medium text-gray-700">
                    {key}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                    {typeof value === "object" ? renderTable(value) : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="p-8 w-full bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-6">Astrology Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="birthDate"
            >
              Birth Date
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="birthTime"
            >
              Birth Time
            </label>
            <input
              id="birthTime"
              name="birthTime"
              type="time"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              value={formData.birthTime}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="birthPlace"
            >
              Birth Place
            </label>
            <input
              id="birthPlace"
              name="birthPlace"
              type="text"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              value={formData.birthPlace}
              onChange={handleChange}
            />
          </div>
          <button
            className="w-full px-3 py-2 text-white bg-blue-500 rounded shadow hover:bg-blue-600"
            type="submit"
          >
            Submit
          </button>
        </form>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {responseData && (
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Response Data</h3>
            {Object.entries(responseData).map(([key, data]) => (
              <div key={key} className="mb-4">
                <h4 className="text-lg font-semibold mb-2">{key}</h4>
                {renderTable(data)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AstrologyForm;
