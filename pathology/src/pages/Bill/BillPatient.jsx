import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BillPatient() {
  const { id: patientId } = useParams();
  const api = "http://localhost:8060";
  const [allTests, setAllTests] = useState([]); // API data
  const [filteredTests, setFilteredTests] = useState([]); // search result
  const [selectedTests, setSelectedTests] = useState([]); // added tests
  const [showDropdown, setShowDropdown] = useState(false);
  const [tests, setTests] = useState([]);
  const [paymentType, setPaymentType] = useState("Cash");
  const [advancePaid, setAdvancePaid] = useState(0);
  const navigate = useNavigate();
  const [newTest, setNewTest] = useState({
    name: "",
    price: 0,
    concession: 0,
  });
  const [patient, setPatient] = useState({
    name: "Loading...",
    age: "",
    gender: "",
    id: "",
    contact: "",
    referral: "",
    organisation: "",
    address: "",
    previousReport: "N/A",
  });

  useEffect(() => {
    if (patientId) {
      const fetchPatient = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${api}/api/patient/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data;
          setPatient({
            name: data.name,
            age: data.age,
            gender:
              data.gender === "Male"
                ? "M"
                : data.gender === "Female"
                  ? "F"
                  : "O",
            id: `#${data.id}`,
            contact: data.phone,
            referral: data.referal || "SELF",
            organisation: "TREGO", // Hardcoded for now or fetch if available
            address: `${data.city}, ${data.state} ${data.pincode}`,
            previousReport: new Date(data.created_at).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }),
          });
        } catch (error) {
          console.error("Error fetching patient:", error);
        }
      };
      fetchPatient();
    }
  }, [patientId]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${api}/api/bill/patient-test-list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data;
        setAllTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    fetchTests();
  }, []);

  //  FUNCTION
  const addTest = () => {
    if (!newTest.name) return alert("Enter test name");

    if (selectedTests.some((t) => t.name === newTest.name)) {
      return alert("Test already added");
    }
    if (newTest.concession > newTest.price) {
      return alert("Concession Price must be greator then Medicine Price");
    }
    if (newTest.price < 0) {
      return "Price must be greator than zero";
    }
    setSelectedTests([...selectedTests, newTest]);

    setNewTest({
      name: "",
      price: 0,
      concession: 0,
      sample: "",
    });
  };

  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const now = new Date();
    setDateTime(now.toLocaleString());
  }, []);

  const removeTest = (index) => {
    setSelectedTests(selectedTests.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...selectedTests];
    updated[index][field] = value;
    setSelectedTests(updated);
  };
  // const billSubmit =  (patientId) => {
  //      navigate(`/home/billReceipt/${patientId}`);
  // };
  const createBillAPI = async ({
    paymentType,
    advancePaid,
    transactionData,
  }) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        patientId,
        tests: selectedTests,
        paymentType,
        advancePaid,
        transactionData,
      };

      const response = await axios.post(`${api}/api/bill/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        navigate(`/home/billReceipt/${response.data.billId}`);
      }
    } catch (error) {
      console.error("Bill API Error:", error);
      alert("Failed to create bill");
    }
  };
  const handleBillSubmit = async () => {
    if (selectedTests.length === 0) return alert("Add at least one test");

    const totalAmount = total;
    if (totalAmount < 0) {
      return alert("Total Amount must be greater than zero");
    }
    if (selectedTests.concession > selectedTests.price) {
      return alert("Concession Price must be greator then Medicine Price");
    }
    if (paymentType === "Cash") {
      await createBillAPI({
        paymentType: "Cash",
        advancePaid,
        transactionData: null,
      });
      return;
    }

    if (paymentType === "UPI") {
      const { data: order } = await axios.post(
        `${api}/api/bill/payment/order`,
        {
          amount: test_total,
        },
      );

      const options = {
        key: "[ENCRYPTION_KEY]",
        amount: order.amount,
        currency: "INR",
        name: "Lab Billing",
        order_id: order.id,

        handler: async function (response) {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
          };

          await createBillAPI({
            paymentType: "UPI",
            advancePaid: totalAmount,
            transactionData: paymentData,
          });
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  const total = selectedTests.reduce(
    (sum, t) => sum + Number(t.price) - Number(t.concession),
    0,
  );
  const test_total = selectedTests.reduce((sum, t) => sum + Number(t.price), 0);
  const totalAmount = total - advancePaid;
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Bill Patient</h1>

        <div className="text-sm bg-gray-200 px-3 py-1 rounded">
          Sample Collect Time: {dateTime}
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-1/3 bg-white rounded-xl shadow p-4 h-fit">
          <h2 className="text-lg font-semibold">
            {patient.name} ({patient.gender} - {patient.age} years)
          </h2>

          <p className="text-gray-400 text-sm mb-2">{patient.id}</p>

          <hr className="mb-3" />

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Contact No</p>
              <p className="font-medium">{patient.contact}</p>
            </div>

            <div>
              <p className="text-gray-500">Referral</p>
              <p className="font-medium">{patient.referral}</p>
            </div>

            <div>
              <p className="text-gray-500">Organisation</p>
              <p className="font-medium">{patient.organisation}</p>
            </div>

            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium">{patient.address}</p>
            </div>

            <div>
              <p className="text-gray-500">Current Report On</p>
              <p className="font-medium">{patient.previousReport}</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 text-gray-600 font-semibold border-b pb-2">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Test Name</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Concession</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          {selectedTests.map((test, index) => (
            <div
              key={index}
              className="grid grid-cols-12 items-center gap-2 py-3 border-b"
            >
              <div className="col-span-1">{index + 1}</div>

              {/* Test name */}
              <div className="col-span-6">
                <input
                  type="text"
                  value={test.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                {test.code && (
                  <p className="text-xs text-gray-400">{test.code}</p>
                )}
              </div>

              {/* Price */}
              <input
                type="number"
                value={test.price}
                onChange={(e) => handleChange(index, "price", e.target.value)}
                className="col-span-2 px-3 py-2 border rounded bg-gray-100"
              />

              {/* Concession */}
              <input
                type="number"
                value={test.concession}
                onChange={(e) =>
                  handleChange(index, "concession", e.target.value)
                }
                className="col-span-2 px-3 py-2 border rounded bg-gray-100"
              />

              {/* Delete */}
              <button
                onClick={() => removeTest(index)}
                className="col-span-1 text-red-500 text-lg"
              >
                ✕
              </button>
            </div>
          ))}

          <div className="grid grid-cols-12 gap-2 items-center mt-3 border p-3 rounded-lg">
            {/* index */}
            <div className="col-span-1 text-gray-500">
              {selectedTests.length + 1}
            </div>

            {/* search input */}
            <div className="col-span-6 relative">
              <input
                type="text"
                value={newTest.name}
                onFocus={() => {
                  setShowDropdown(true);
                  setFilteredTests(allTests);
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewTest({ ...newTest, name: value });

                  const filtered = allTests.filter((t) =>
                    t.investigation.toLowerCase().includes(value.toLowerCase()),
                  );

                  setFilteredTests(filtered);
                }}
                placeholder="Search & Select List"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>

              {showDropdown && filteredTests.length > 0 && (
                <div className="absolute bg-white text-black border w-full mt-1 max-h-40 overflow-y-auto rounded shadow z-10">
                  {filteredTests.map((test, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        const isAlreadyAdded = selectedTests.some(
                          (t) => t.name === test.investigation,
                        );

                        if (isAlreadyAdded) {
                          alert("Test already added");
                          return;
                        }

                        setSelectedTests([
                          ...selectedTests,
                          {
                            name: test.investigation,
                            price: test.mcc || 0,
                            concession: 0,
                            sample: test.sample,
                          },
                        ]);

                        setNewTest({
                          name: "",
                          price: 0,
                          concession: 0,
                          sample: "",
                        });
                        setShowDropdown(false);
                      }}
                      className="flex justify-between p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {test.investigation}{" "}
                      <span className="text-black">₹{test.mcc}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* search icon */}
            </div>

            {/* price */}
            <input
              type="number"
              value={newTest.price}
              onChange={(e) =>
                setNewTest({ ...newTest, price: e.target.value })
              }
              className="col-span-2 px-3 py-2 border rounded bg-gray-100"
            />

            {/* concession */}
            <input
              type="number"
              value={newTest.concession}
              onChange={(e) =>
                setNewTest({ ...newTest, concession: e.target.value })
              }
              className="col-span-2 px-3 py-2 border rounded bg-gray-100"
            />

            {/* Add Test */}

            <div className="col-span-1"></div>
            <div className="col-span-12 flex justify-center mt-3">
              <button
                onClick={addTest}
                className="px-6 py-2 bg-blue-100 text-blue-600 rounded-lg"
              >
                Add Test
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t pt-6">
            {/* LEFT SIDE */}
            <div className="space-y-3 text-sm pr-4 border-r">
              <div className="flex justify-between">
                <span>Test Amount</span>
                <span className="font-semibold">₹ {test_total}</span>
              </div>

              <hr className="my-2 border-gray-300" />

              <div className="flex justify-between">
                <span>Organization Advance</span>
                <span className="font-semibold">₹ 0</span>
              </div>

              <div className="flex justify-between">
                <span>Organization Payable</span>
                <span className="font-semibold">₹ 0</span>
              </div>

              <div className="mt-4">
                <label className="text-blue-600 font-medium cursor-pointer">
                  Instant Comment *
                </label>

                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" />
                  <span>Same for Report</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-3 text-sm  pr-4">
              <div className="flex justify-between">
                <span>Payable Amount:</span>
                <span className="font-semibold">₹ {totalAmount}</span>
              </div>

              {/* Advance input */}
              <div className="flex items-center justify-between gap-3">
                <span>Advance Paid:</span>
                <input
                  type="number"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(e.target.value)}
                />
              </div>

              {/* Payment options */}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setPaymentType("Cash")}
                  className={`px-6 py-2 rounded-xl font-bold transition-all border ${
                    paymentType === "Cash"
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  Cash
                </button>
               
              </div>
              <hr className="my-2 border-gray-300" />
              {/* Online */}
              <div className="flex justify-between mt-3">
                <span>ONLINE</span>
                <span>₹ 0</span>
              </div>

              {/* Remaining */}
              <div className="flex justify-between font-semibold">
                <span>Remaining</span>
                <span>₹ {total}</span>
              </div>
            </div>
          </div>
          {/* Total */}
          <div className="flex justify-between mt-6 border-t pt-4">
            <h2 className="font-semibold">Total Amount</h2>
            <span className="font-bold">₹ {total}</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button className="px-5 py-2 border rounded-lg">Cancel</button>

            <button
              onClick={handleBillSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:cursor-pointer"
            >
              Confirm & Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
