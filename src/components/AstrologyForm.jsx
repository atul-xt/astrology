import axios from "axios";
import React, { useState, useEffect } from "react";
import { apiEndpoints, newEndpoints } from "./apiEndpoints";
import AsyncSelect from "react-select/async";
import { LocationData } from "./location";

const AstrologyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
  });

  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedBirthLocation, setSelectedBirthLocation] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [newEndpointsData, setNewEndpointsData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const handleSelect = (selectedOption) => {
    if (selectedOption.value === "show_more") {
      setShowMore(true);
      return;
    }
    setSelectedBirthLocation(selectedOption);
    setLatitude(selectedOption.latitude);
    setLongitude(selectedOption.longitude);
  };

  const filterCities = (inputValue) => {
    let filteredCities = LocationData.filter((city) =>
      city.city_name.toLowerCase().includes(inputValue.toLowerCase())
    ).map((city) => ({
      value: city.city_name,
      label: city.city_name,
      latitude: city.latitude,
      longitude: city.longitude,
    }));

    if (!showMore && filteredCities.length > 5) {
      filteredCities = filteredCities.slice(0, 5);
      filteredCities.push({ value: "show_more", label: "Show more..." });
    }

    return filteredCities;
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterCities(inputValue));
    }, 500);
  };

  const handleInputChange = (newValue) => {
    if (newValue === "show_more") {
      setShowMore(true);
      return "";
    }
    return newValue;
  };

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

  const fetchData = async (data, requestOptions) => {
    try {
      // Fetch data from newEndpoints
      const newEndpointResponses = await Promise.all(
        newEndpoints.map(async (endpoint) => {
          try {
            const response = await axios.post(
              `${baseUrl}${endpoint.endPoint}`,
              data,
              requestOptions
            );
            return { endpoint: endpoint.endPoint, name: endpoint.name, data: response.data };
          } catch (error) {
            setError(`Error fetching ${endpoint.endPoint}: ${error.message}`);
            return { endpoint: endpoint.endPoint, name: endpoint.name, data: null };
          }
        })
      );

      // Extract and store the responses
      let newFinalData = {};
      newEndpointResponses.forEach(({ endpoint, name, data }) => {
        newFinalData[endpoint] = { name, data };
      });

      setNewEndpointsData(newFinalData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDateBlur = (e) => {
    const currentDate = new Date();
    const birthDate = new Date(e.target.value);
    if (birthDate > currentDate) {
      alert("Birth date cannot be in the future.");
      setFormData({
        ...formData,
        birthDate: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [year, month, day] = formData.birthDate.split("-");
    const [hour, min] = formData.birthTime.split(":");

    const data = {
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
      hour: parseInt(hour),
      min: parseInt(min),
      lat: latitude,
      lon: longitude,
      tzone: 5.5,
      varshaphal_year: 2024,
      dasha_date: "8-02-2024",
      place: "mumbai",
      maxRows: 6,
      country_code: "Asia/Kolkata",
      isDst: true,
      latitude: latitude,
      longitude: longitude,
      date: "01-06-2000",
      m_day: parseInt(day),
      m_month: parseInt(month),
      m_year: parseInt(year),
      m_hour: parseInt(hour),
      m_min: parseInt(min),
      m_lat: latitude,
      m_lon: longitude,
      m_tzone: 5.5,
      f_day: parseInt(day),
      f_month: parseInt(month),
      f_year: parseInt(year),
      f_hour: parseInt(hour),
      f_min: parseInt(min),
      f_lat: latitude,
      f_lon: longitude,
      f_tzone: 5.5,
      you_date: parseInt(day),
      you_month: parseInt(month),
      you_year: parseInt(year),
      you_gender: "male",
      match_date: 2,
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

    await fetchData(data, requestOptions);

    try {
      // Use the responses from newEndpoints to fetch data from apiEndpoints
      const apiEndpointResponses = await Promise.all(
        apiEndpoints.map(async (endpoint) => {
          try {
            const response = await axios.post(
              `${baseUrl}${endpoint.endPoint}`,
              data,
              requestOptions
            );
            return { endpoint: endpoint.endPoint, name: endpoint.name, data: response.data };
          } catch (error) {
            setError(`Error fetching ${endpoint.endPoint}: ${error.message}`);
            return { endpoint: endpoint.endPoint, name: endpoint.name, data: null };
          }
        })
      );

      // Extract and store the responses
      let newFinalData = {};
      apiEndpointResponses.forEach(({ endpoint, name, data }) => {
        newFinalData[endpoint] = { name, data };
      });

      // Update state with all the responses
      setResponseData(newFinalData);
    } catch (error) {
      setError(error.message);
    }
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

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
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
              onBlur={handleDateBlur}
              required
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
            <AsyncSelect
              id="birthPlace"
              name="birthPlace"
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions
              onChange={handleSelect}
              onInputChange={handleInputChange}
              value={selectedBirthLocation}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
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
        {Object.keys(newEndpointsData).length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl text-center bg-orange-400 py-2 font-bold mb-2">
              Transits Data (Monthly, Weekly & Daily)
            </h3>
            <div className="flex mb-4">
              <button
                className={`px-4 py-2 mr-2 ${
                  selectedPeriod === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => handlePeriodChange("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 mr-2 ${
                  selectedPeriod === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => handlePeriodChange("weekly")}
              >
                Weekly
              </button>
              <button
                className={`px-4 py-2 ${
                  selectedPeriod === "daily" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => handlePeriodChange("daily")}
              >
                Daily
              </button>
            </div>
            <div>
              {selectedPeriod === "monthly" && renderTable(newEndpointsData["tropical_transits/monthly"].data)}
              {selectedPeriod === "weekly" && renderTable(newEndpointsData["tropical_transits/weekly"].data)}
              {selectedPeriod === "daily" && renderTable(newEndpointsData["tropical_transits/daily"].data)}
            </div>
          </div>
        )}
        {responseData && (
          <div className="mt-4">
            {Object.entries(responseData).map(([key, { name, data }]) => (
              <div key={key} className="mb-4">
                <h4 className="text-lg font-semibold mb-2 text-center py-3 bg-orange-400">{name}</h4>
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
