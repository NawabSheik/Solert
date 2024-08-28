'use client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export const TrackAccount = () => {
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [allTrackAddress, setAllTrackAddress] = useState<{ id: number, accountAddress: string, amount: number }[]>([]);
  const [editStates, setEditStates] = useState<{ [key: number]: boolean }>({});
  const [updatedAmounts, setUpdatedAmounts] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { data: token } = useSession();
  const { data: session } = useSession();
  // const {user: }
  // const userId = session?.user?.id;

  console.log("login data", session)
  console.log("token", token)
  const userId = 8;

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/accounts/trackAddress?userId=${userId}`);
      setAllTrackAddress(response.data.data);
    } catch (error) {
      console.error('Error fetching tracked addresses:', error);
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]); // This will run when the component mounts or when userId changes


  const updateAmount = async (id: number) => {
    try {
      await axios.patch('http://localhost:3001/api/v1/accounts/trackAddress', { id, amount: updatedAmounts[id] });
      fetchData()
      // setAllTrackAddress(allTrackAddress.map(item => item.id === id ? { ...item, amount: updatedAmounts[id] } : item));
      setEditStates({ ...editStates, [id]: false });  // Disable edit mode after updating
    } catch (error) {
      console.error('Error updating amount:', error);
    }
  };

  const deleteTrackAddress = async (id: number) => {
    try {
      await axios.delete('http://localhost:3001/api/v1/accounts/trackAddress', { data: { id } });
      setAllTrackAddress(allTrackAddress.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const addAccount = async () => {
    setLoading(true)
    try {
      if (userId) {
        const response = await axios.post(`http://localhost:3001/api/v1/accounts/trackAddress?userId=${userId}`, { address, amount });
        fetchData()
        // setAllTrackAddress([...allTrackAddress, response.data.data]);
        setAmount(0);
        setAddress('');
      }
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const toggleEditMode = (id: number) => {
    setEditStates({ ...editStates, [id]: !editStates[id] });
    setUpdatedAmounts({ ...updatedAmounts, [id]: allTrackAddress.find(item => item.id === id)?.amount || 0 });
  };

  return (
    <div className='h-[80vh]'>
      <div className='flex gap-4 p-7'>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Address"
          className='border rounded-lg p-2 w-2/5 outline-none text-slate-600'
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            setAmount(Number(value.replace(/^0+/, '')));
          }}
          placeholder="Enter Amount"
          className='border rounded-lg p-2 w-2/5 outline-none text-slate-600'
        />
        <button onClick={addAccount} className='bg-black text-white py-2 px-4 rounded-lg w-1/5 active:text-xl'>Add Account</button>
      </div>

      <div className='mt-8 h-[50vh]  p-4 shadow-xl'>
        {loading ? (<p className='text-center mt-12'>Loading...</p>) : (
          <ul>
            {allTrackAddress.length > 0 ? (
              allTrackAddress.map((item) => (
                <li key={item.id} className='flex gap-4 text-slate-600 mb-4'>
                  <p className='bg-gray-100 py-1 px-2 rounded-lg w-4/6'>{item.accountAddress}</p>
                  <input
                    type="number"
                    value={editStates[item.id] ? updatedAmounts[item.id] : item.amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUpdatedAmounts({ ...updatedAmounts, [item.id]: Number(value.replace(/^0+/, '')) });
                    }}
                    placeholder="Update Amount"
                    disabled={!editStates[item.id]}
                    className='text-slate-600 border p-2 rounded-lg w-1/6 outline-none'
                  />
                  <button
                    onClick={() => editStates[item.id] ? updateAmount(item.id) : toggleEditMode(item.id)}
                    className='bg-black text-white py-2 px-4 rounded-lg w-1/6'
                  >
                    {editStates[item.id] ? 'Update' : 'Edit Amt'}
                  </button>
                  <button onClick={() => deleteTrackAddress(item.id)} className='bg-black text-white py-2 px-4 rounded-lg w-1/6'>Delete</button>
                </li>

              ))
            ) : (<p className="text-center mt-16 text-2xl">Please add address you want to track</p>)}

          </ul>)}
      </div>
    </div>
  );
};