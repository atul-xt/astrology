import React, { useState } from 'react';

const AstrologyForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: ''
    });
  
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
  
    const userId = 632129;
    const apiKey = '3c63d275a9aa3f083d7a827552fa8b2e0d730915';
    const baseUrl = 'https://json.astrologyapi.com/v1/';
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const [year, month, day] = formData.birthDate.split('-');
      const [hour, min] = formData.birthTime.split(':');
  
      const data = {
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year),
        hour: parseInt(hour),
        min: parseInt(min),
        lat: 19.132,
        lon: 72.342, 
        tzone: 5.5 
      };
  
      const requestOptions = {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${btoa(`${userId}:${apiKey}`)}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      };
  
      try {
        const response = await fetch(`${baseUrl}astro_details`, requestOptions);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        setResponseData(result);
      } catch (error) {
        setError(error.message);
      }
    };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="p-8 w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-6">Astrology Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="name">Name</label>
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
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="birthDate">Birth Date</label>
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
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="birthTime">Birth Time</label>
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
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="birthPlace">Birth Place</label>
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
            <pre className="bg-gray-100 text-sm md:text-base lg:text-lg p-4 rounded">{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AstrologyForm;
