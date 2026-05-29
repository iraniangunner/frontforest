"use client";
export default function TorobTest() {
  const test = async () => {
    const res = await fetch("https://pmk-co.com/api/torob_api/v3/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Torob-Token": "invalid_token", // توکن اشتباه
      },
      body: JSON.stringify({ page: 1, sort: "date_added_desc" }),
    });
    const data = await res.json();
    console.log(data);
    alert(JSON.stringify(data));
  };

  return <button onClick={test}>تست ترب</button>;
}
